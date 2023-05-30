import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import { createJwtToken, refreshJwtToken, verifyToken } from "../utils/jwt.js";

var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const AuthController = {
  signup: async (req, res) => {
    try {
      const { name, email, password, age } = req.body;

      if (!name || !email || !password || !age)
        throw new Error("name, email, password or age is required !");

      if (!email.match(emailFormat)) throw new Error("Enter Valid Email !");
      const isEmailExist = await User.findOne({ email });

      if (isEmailExist)
        throw new Error("User already registered with this email");

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        name,
        email,
        age: +age,
        password: hashedPassword,
      });

      return res.status(201).json({
        statusCode: 201,
        data: user,
        message: "User Registered Successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email or password is required !");

      if (!email.match(emailFormat)) throw new Error("Enter Valid Email !");
      const user = await User.findOne({ email });

      if (!user) throw new Error("User is not registered with this email");

      const isAuthorised = await comparePassword(password, user.password);
      if (!isAuthorised) throw new Error("Invalid Credentials !");

      const accesstoken = createJwtToken(email, user.tokenVersion, user._id);
      const refreshtoken = refreshJwtToken(email, user.tokenVersion, user._id);
      delete user["tokenVersion"];
      res.status(200).json({
        statusCode: 200,
        message: "Login User Successfully",
        data: {
          accesstoken,
          refreshtoken,
          user,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, error: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      const JWT = req.headers["authorization"].replaceAll("JWT ", "");
      const tokenDetails = await verifyToken(
        JWT,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!tokenDetails) throw new Error("Unauthorised");

      await User.findByIdAndUpdate(tokenDetails.id, {
        tokenVersion: tokenDetails.tokenVersion + 1,
      });

      return res.json({ statusCode: 200, message: "signout success" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, error: err.message });
    }
  },
};

export default AuthController;

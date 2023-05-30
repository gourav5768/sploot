import Article from "../models/article.js";
import User from "../models/user.js";

const ArticleController = {
  makeArticles: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title || !description)
        throw new Error("title and Description is required !");

      const article = await Article.create({
        title,
        description,
        user: req.params.userId,
      });

      return res.status(201).json({
        statusCode: 201,
        data: article,
        message: "Article Created Successfull !",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, message: err.message });
    }
  },
  updateUserDetails: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) throw new Error("User not found");

      const { age, name } = req.body;

      if (age) user.age = +age;
      if (name) user.name = name;

      await user.save();
      delete user["tokenVersion"];
      return res.status(200).json({
        message: "User Update Successfull !",
        statusCode: 200,
        data: user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, message: err.message });
    }
  },
};

export default ArticleController;

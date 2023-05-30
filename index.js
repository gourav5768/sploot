import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import fs from "fs";
import cors from "cors";

const app = express();
dotenv.config();
connectDB();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));

fs.readdirSync("./routes").map(async (route) => {
  const { router } = await import(`./routes/${route}`);
  app.use("/api", router);
});

app.listen(process.env.PORT, () =>
  console.log(`Server Running on port ${process.env.PORT}`)
);

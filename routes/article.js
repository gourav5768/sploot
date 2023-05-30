import express from "express";
import ArticleController from "../controllers/articles.js";
import { isAuthorised } from "../middlewares/auth.js";

export const router = express.Router();

router.get("/articles", isAuthorised, ArticleController.getArticles);

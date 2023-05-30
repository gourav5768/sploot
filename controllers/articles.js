import Article from "../models/article.js";

const ArticleController = {
  getArticles: async (_, res) => {
    try {
      const articles = await Article.find().populate("user");
      return res.status(200).json({
        statusCode: 200,
        data: articles,
        message: "Articles Fetched Successfully !",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ statusCode: 400, message: err.message });
    }
  },
};

export default ArticleController;

import express, { Request, Response, NextFunction } from "express";

// 导入 Article 相关的控制器
import {
  indexData,
  article_list,
  article_list_data,
  article_detail_data,
  article_create_get,
  article_create_post,
  article_delete_post,
  article_update_post,
} from "../controllers/articleController";

// 导入 Author 相关的控制器
import {
  author_list,
  author_detail,
  author_create_post,
  author_delete_post,
  author_update_post,
} from "../controllers/authorController";

// 导入 Genre 相关的控制器
import {
  genre_list,
  genre_detail,
  genre_create_post,
  genre_delete_post,
  genre_update_post,
} from "../controllers/genreController";

const router = express.Router();

///  ROUTES ///

router.get("/data", (req: Request, res: Response, next: NextFunction) => {
  indexData(req, res, next);
});

// GET request for creating a new article
router.get(
  "/article/create",
  (req: Request, res: Response, next: NextFunction) => {
    article_create_get(req, res, next);
  }
);

// POST request for creating a new article
router.post(
  "/article/create",
  (req: Request, res: Response, next: NextFunction) => {
    article_create_post(req, res, next);
  }
);

// POST request to delete an article
router.post(
  "/article/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    article_delete_post(req, res, next);
  }
);

// POST request to update an article
router.post(
  "/article/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    article_update_post(req, res, next);
  }
);

// GET request for article details
router.get(
  "/articlesData/:id",
  (req: Request, res: Response, next: NextFunction) => {
    article_detail_data(req, res, next);
  }
);

// GET request for list of all articles
router.get("/articles", (req: Request, res: Response, next: NextFunction) => {
  article_list(req, res, next);
});

// GET request for list of all articles data
router.get(
  "/articlesData",
  (req: Request, res: Response, next: NextFunction) => {
    article_list_data(req, res, next);
  }
);

/// AUTHOR ROUTES ///

router.post(
  "/author/create",
  (req: Request, res: Response, next: NextFunction) => {
    author_create_post(req, res, next);
  }
);

router.post(
  "/author/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    author_delete_post(req, res, next);
  }
);

router.post(
  "/author/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    author_update_post(req, res, next);
  }
);

router.get("/author/:id", (req: Request, res: Response, next: NextFunction) => {
  author_detail(req, res, next);
});

router.get("/authors", (req: Request, res: Response, next: NextFunction) => {
  author_list(req, res, next);
});

/// GENRE ROUTES ///

router.post(
  "/genre/create",
  (req: Request, res: Response, next: NextFunction) => {
    genre_create_post(req, res, next);
  }
);

router.post(
  "/genre/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    genre_delete_post(req, res, next);
  }
);

router.post(
  "/genre/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    genre_update_post(req, res, next);
  }
);

router.get("/genre/:id", (req: Request, res: Response, next: NextFunction) => {
  genre_detail(req, res, next);
});

router.get("/genres", (req: Request, res: Response, next: NextFunction) => {
  genre_list(req, res, next);
});

// Add more routes for article instance...

export default router;

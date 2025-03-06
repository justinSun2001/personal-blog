import express, { Request, Response, NextFunction } from "express";

// 导入 Article 相关的控制器
import {
  indexData,
  article_list,
  article_list_data,
  summary_list_data,
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

// 获取所有文章/作者/类别数（前后端都需要）
router.get("/data", (req: Request, res: Response, next: NextFunction) => {
  indexData(req, res, next);
});

// 文章相关 //
// 获取创建文章时所需的作者数据和类别数据（后台）
router.get(
  "/article/create",
  (req: Request, res: Response, next: NextFunction) => {
    article_create_get(req, res, next);
  }
);

// 创建文章（后台）
router.post(
  "/article/create",
  (req: Request, res: Response, next: NextFunction) => {
    article_create_post(req, res, next);
  }
);

// 删除文章（后台）
router.post(
  "/article/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    article_delete_post(req, res, next);
  }
);

// 更新文章（后台）
router.post(
  "/article/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    article_update_post(req, res, next);
  }
);

// 获取单个文章的详细数据（用于后台文章的更新）
router.get(
  "/articlesData/:id",
  (req: Request, res: Response, next: NextFunction) => {
    article_detail_data(req, res, next);
  }
);

// 获取所有的文章的title和author（用于后台显示）
router.get("/articles", (req: Request, res: Response, next: NextFunction) => {
  article_list(req, res, next);
});

// 获取批量的文章数据（通过前端传入的索引）
router.post(
  "/articlesData",
  (req: Request, res: Response, next: NextFunction) => {
    article_list_data(req, res, next);
  }
);
// 获取批量的文章摘要数据（通过前端传入的索引）
router.post(
  "/summaryData",
  (req: Request, res: Response, next: NextFunction) => {
    summary_list_data(req, res, next);
  }
);
/// 作者相关 ///
// 创建作者
router.post(
  "/author/create",
  (req: Request, res: Response, next: NextFunction) => {
    author_create_post(req, res, next);
  }
);
// 删除作者
router.post(
  "/author/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    author_delete_post(req, res, next);
  }
);
// 更新作者
router.post(
  "/author/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    author_update_post(req, res, next);
  }
);
// 获取单个作者下的相关数据
router.get("/author/:id", (req: Request, res: Response, next: NextFunction) => {
  author_detail(req, res, next);
});
// 获取所有作者数据
router.get("/authors", (req: Request, res: Response, next: NextFunction) => {
  author_list(req, res, next);
});

/// 类别相关 ///
// 创建类别
router.post(
  "/genre/create",
  (req: Request, res: Response, next: NextFunction) => {
    genre_create_post(req, res, next);
  }
);
// 删除类别
router.post(
  "/genre/:id/delete",
  (req: Request, res: Response, next: NextFunction) => {
    genre_delete_post(req, res, next);
  }
);
// 更新类别
router.post(
  "/genre/:id/update",
  (req: Request, res: Response, next: NextFunction) => {
    genre_update_post(req, res, next);
  }
);
// 获取单个类别下的相关数据
router.get("/genre/:id", (req: Request, res: Response, next: NextFunction) => {
  genre_detail(req, res, next);
});
// 获取所有类别数据
router.get("/genres", (req: Request, res: Response, next: NextFunction) => {
  genre_list(req, res, next);
});

// Add more routes for article instance...

export default router;

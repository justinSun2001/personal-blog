import { Request, Response, NextFunction } from "express";
import Genre, { IGenre } from "../models/genre";
import Article from "../models/article";
import { body, validationResult } from "express-validator";

// List all genres
export const genre_list = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec()
    .then((listGenres: IGenre[]) => {
      if (!listGenres) {
        return res.status(404).json({ message: "Genre not found" });
      }
      res.status(200).json(listGenres);
    })
    .catch((err: any) => next(err));
};

// Genre detail page
export const genre_detail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.all([
    Genre.findById(req.params.id).exec(),
    Article.find({ genre: req.params.id }, "title summary").exec(),
  ])
    .then(([genre, genre_articles]) => {
      if (!genre) {
        const error = new Error("Genre not found") as any;
        error.status = 404;
        return next(error);
      }
      if (!genre_articles) {
        return res
          .status(404)
          .json({ message: "No articles found for this genre" });
      }
      res.status(200).json({ genre, genre_articles });
    })
    .catch((err: any) => next(err));
};

// Genre creation form submission on POST
export const genre_create_post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证字段
    await body("name", "Genre name must contain at least 2 characters")
      .trim()
      .isLength({ min: 2 })
      .escape()
      .run(req);

    // 获取验证结果
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      res.status(400).json(errors.array());
      return;
    }
    const genre = new Genre({ name: req.body.name });
    // 如果没有验证错误，检查是否已有相同名称的 genre
    const foundGenre = await Genre.findOne({ name: req.body.name }).exec();

    if (foundGenre) {
      res.status(400).json("Genre already exists");
      return;
    }

    // 如果没有找到，保存新的 genre
    const savedGenre = await genre.save();

    if (savedGenre) {
      res.status(201).json("success");
      return;
    }
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};

// Handle Genre delete on POST
export const genre_delete_post = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.all([
    Genre.findById(req.params.id).exec(),
    Article.find({ genre: req.params.id }).exec(),
  ])
    .then(([genre, genreArticles]) => {
      // 如果 genre 为 null，返回 404 错误
      if (!genre) {
        const error = new Error("Genre not found") as any;
        error.status = 404;
        throw error;
      }

      // 如果有相关文章，发送 403 状态码和错误信息，并且不再继续执行后续操作
      if (genreArticles.length > 0) {
        res.status(403).json("该分类下有文章，无法删除");
        return Promise.reject();
      }

      // 如果没有相关文章，执行删除操作
      return Genre.findByIdAndDelete(req.params.id).exec();
    })
    .then((deletedGenre) => {
      if (deletedGenre) {
        // 数据库删除操作成功后，发送 200 状态码和成功信息
        res.status(200).json("success");
        console.log("Genre deleted successfully");
      }
    })
    .catch((err: any) => next(err));
};

// 导出一个异步函数，用于更新 genre
export const genre_update_post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证字段
    await body("name", "Genre name must contain at least 2 characters")
      .trim()
      .isLength({ min: 2 })
      .escape()
      .run(req);

    // 获取验证结果
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      res.status(400).json(errors.array());
      return;
    }

    // 创建一个新的 genre 对象
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    // 更新 genre
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {
      new: true,
    }).exec();

    if (!updatedGenre) {
      // 如果找不到该 Genre，返回 404 错误
      const error = new Error("Genre not found");
      (error as any).status = 404;
      return next(error);
    }

    // 成功更新，重定向到该 genre 的 URL
    res.status(200).json("success");
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};

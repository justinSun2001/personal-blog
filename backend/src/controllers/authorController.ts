import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Author, { IAuthor } from "../models/author";
import Article, { IArticle } from "../models/article";
import { sendToClients } from "../websocketServer";
// Display list of all Authors.
export const author_list = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Author.find()
    .sort([["family_name", "ascending"]])
    .then((list_authors) => {
      res.json(list_authors);
    })
    .catch(next);
};

// Display detail page for a specific Author.
export const author_detail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.all([
    Author.findById(req.params.id).exec(),
    Article.find({ author: req.params.id }, "title summary").exec(),
  ])
    .then(([author, author_articles]) => {
      if (!author) {
        const error = new Error("Author not found");
        (error as any).status = 404;
        throw error;
      }
      if (!author_articles) {
        author_articles = [];
      }
      res.json({ author, author_articles });
    })
    .catch(next);
};

// Handle Author create on POST.
export const author_create_post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证字段
    await body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters.")
      .run(req);
    await body("family_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Family name must be specified.")
      .isAlphanumeric()
      .withMessage("Family name has non-alphanumeric characters.")
      .run(req);
    await body("date_of_birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .run(req);
    await body("date_of_death")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .run(req);

    // 获取验证结果
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      res.status(400).json(errors.array());
      return;
    }

    // 保存 author
    const savedAuthor = await author.save();
    if (savedAuthor) {
      // 发送 WebSocket 消息
      sendToClients("有新作者增加了！");
      res.status(201).json(savedAuthor);
      return;
    }
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};

// Handle Author delete on POST.
export const author_delete_post = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.all([
    Author.findById(req.params.id).exec(),
    Article.find({ author: req.params.id }).exec(),
  ])
    .then(([author, author_articles]) => {
      if (!author) {
        const error = new Error("Author not found");
        (error as any).status = 404;
        throw error;
      }
      if (author_articles.length > 0) {
        // 如果作者下有文章，发送 403 状态码和错误信息，并返回一个 resolved 的 Promise
        res.status(403).json("该作者下有文章，无法删除");
        return Promise.reject();
      }
      // 如果没有相关文章，执行删除操作
      return Author.findByIdAndDelete(req.params.id).exec();
    })
    .then((deletedAuthor) => {
      if (deletedAuthor) {
        // 数据库删除操作成功后，发送 200 状态码和成功信息
        res.status(200).json("success");
        console.log("Author deleted successfully");
      }
    })
    .catch(next);
};

// Handle Author update on POST.
export const author_update_post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证字段
    await body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters.")
      .run(req);
    await body("family_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Family name must be specified.")
      .isAlphanumeric()
      .withMessage("Family name has non-alphanumeric characters.")
      .run(req);
    await body("date_of_birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .run(req);
    await body("date_of_death")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .run(req);

    // 获取验证结果
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      res.status(400).json(errors.array());
      return;
    }
    // 创建更新后的 author 对象
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    // 更新 author
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      author,
      { new: true }
    ).exec();

    if (!updatedAuthor) {
      // 如果没有找到 author，返回 404 错误
      const error = new Error("Author not found");
      (error as any).status = 404;
      throw error;
    } else {
      res.status(200).json("success");
    }
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};

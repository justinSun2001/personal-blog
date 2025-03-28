import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import Article, { IArticle } from "../models/article";
import Author, { IAuthor } from "../models/author";
import Genre, { IGenre } from "../models/genre";
import { sendToClients } from "../websocketServer";
import crypto from "crypto";

// Multer 配置
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = path.join(__dirname, "../public/photos");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // 递归创建目录
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

let cache = null as string | null;
// 首页数据
export const indexData = (req: Request, res: Response, next: NextFunction) => {
  // const clientETag = req.headers["if-none-match"];
  // // 1. 强制要求浏览器每次验证缓存
  // res.setHeader("Cache-Control", "no-cache");
  // console.log(`aaa[${req.method} ${req.path}] ETag: ${clientETag}`);
  // console.log(`bbb[${req.method} ${req.path}] ETag: ${cache}`);
  // if (cache && clientETag === cache) {
  //   console.log("命中缓存"); // 命中缓存不起作用除了304都可以，304会变成200，但是他确实运行了下面的return
  //   return res.status(304).end();
  // }
  console.log("1", req.session.user);
  if (!req.session.user) {
    res.status(401).send("cookie过期");
    return;
  }
  Promise.all([
    Article.countDocuments().exec(),
    Author.countDocuments().exec(),
    Genre.countDocuments().exec(),
  ])
    .then(([articleCount, authorCount, genreCount]) => {
      res.json({
        article_count: articleCount,
        author_count: authorCount,
        genre_count: genreCount,
      });
      // // 获取并记录 ETag
      // res.on("finish", () => {
      //   cache = res.getHeader("ETag") as string;
      //   console.log(`[${req.method} ${req.path}] ETag: ${cache}`);
      // });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// 获取后台文章所需数据（title和author）
export const article_list = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Article.find({}, "title author")
    .sort({ _id: -1 })
    .populate("author")
    .exec()
    .then((articles) => res.json(articles))
    .catch(next);
};

// 获取指定索引的文章的部分所需数据
export const article_list_data = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestedIndexes: number[] = req.body; // 前端传递的索引数组

  if (!Array.isArray(requestedIndexes) || requestedIndexes.length === 0) {
    res.status(400).json({ error: "Invalid or empty index array" });
    return;
  }
  Article.find({}, "_id")
    .exec()
    .then((list_articles) => {
      // 使用索引数组逐个查询文章，并确保返回顺序与请求一致
      const selectedArticlesPromises = requestedIndexes.map((index) => {
        return Article.findById(list_articles[index]._id, {
          title: 1,
          genre: 1,
          summary: 1,
          date: 1,
          path: 1,
        })
          .populate("genre")
          .exec(); // 根据 _id 查询每个文章
      });

      // 等待所有查询完成
      return Promise.all(selectedArticlesPromises);
    })
    .then((selectedArticles) => {
      // 创建一个 ETag（假设基于文章的 JSON 字符串计算）
      const articlesJSON = JSON.stringify(selectedArticles);
      const hash = crypto.createHash("md5");
      hash.update(articlesJSON);
      const etag = `"${hash.digest("hex")}"`;

      // 获取客户端的 If-None-Match 请求头
      const ifNoneMatch = req.headers["if-none-match"];

      // 如果请求头中的 If-None-Match 与当前计算的 ETag 匹配，则返回 304 Not Modified
      if (ifNoneMatch === etag) {
        return res.status(304).end();
      }

      // 设置 ETag 响应头，暴露给前端
      res.setHeader("ETag", etag);
      res.setHeader("Access-Control-Expose-Headers", "ETag"); // 允许前端访问 ETag 响应头
      // 返回选中的文章数据
      res.json(selectedArticles);
    })
    .catch((err) => {
      return next(err);
    });
};

// 获取指定种类的文章的摘要部分数据
export const summary_list_data = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // const currentPage = req.body.currentPage; // 前端传递的当前页码
  // const pageSize = req.body.pageSize; // 前端传递的每页数量
  const selectedGenreID = req.body.selectedGenreID; // 前端传递的当前类别

  // 计算跳过的记录数
  // const skip = (currentPage - 1) * pageSize;
  let query = {};
  if (selectedGenreID !== "All") {
    query = { genre: selectedGenreID }; // 如果选择了特定类别
  }

  Article.find(query, "summary date")
    .sort({ date: -1 }) // 按照 date 字段倒序排列 (-1 表示降序)
    // .skip(skip) // 跳过前面 skip 条数据
    // .limit(pageSize) // 限制返回 pageSize 条数据
    .exec()
    .then((list_summary) => {
      // 获取总数
      return res.json(list_summary);
    })
    .catch((err) => {
      return next(err);
    });
};

// 获取单个文章详细数据
export const article_detail_data = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Article.findById(req.params.id)
    .populate("author")
    .populate("genre")
    .exec()
    .then((article) => {
      if (!article) {
        const err = new Error("Article not found");
        return next(err);
      }
      res.json(article);
    })
    .catch((err) => {
      return next(err);
    });
};

// 文章创建时所需数据 (GET)
export const article_create_get = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.all([Author.find().exec(), Genre.find().exec()])
    .then(([authors, genres]) => {
      res.json({
        authors,
        genres,
      });
    })
    .catch(next);
};

// 文章创建 (POST)
export const article_create_post = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.single("pic")(req, res, (err: any) => {
    if (err) {
      console.error("Upload Error:", err);
      return next(err); // 处理文件上传错误
    }

    // 确保 req.body.genre 是一个数组
    if (!(req.body.genres instanceof Array)) {
      req.body.genres =
        typeof req.body.genres === "undefined" ? [] : [req.body.genres];
    }
    // 执行字段验证
    const validationChain = [
      body("title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must not be empty.")
        .escape(),
      body("author")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Author must not be empty.")
        .escape(),
      body("summary")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Summary must not be empty.")
        .escape(),
      body("text")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Text must not be empty."),
      body("date")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Date must not be empty.")
        .escape(),
      body("genres.*").escape(),
    ];

    // 同步执行验证
    Promise.all(validationChain.map((validator) => validator.run(req)))
      .then(() => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          // 如果有验证错误，渲染创建文章表单并显示错误信息
          res.status(400).json(errors.array());
          return;
        }

        // 如果没有验证错误，创建新的文章
        const article = new Article({
          title: req.body.title,
          author: req.body.author,
          summary: req.body.summary,
          text: req.body.text,
          date: req.body.date,
          genre: req.body.genres,
          path: req.file ? `/photos/${req.file.filename}` : undefined,
        });
        // 保存文章并重定向到文章详情页面
        article
          .save()
          .then(() => {
            // 发送 WebSocket 消息
            sendToClients("有新文章发布了！");
            return res.status(201).json("success"); // 在这里发送重定向响应
          })
          .catch((err) => {
            res.status(500).json("文章保存出错");
            return next(err); // 如果保存出错，传递给下一个中间件处理
          });
      })
      .catch((err) => {
        res.status(500).json("验证出错");
        return next(err);
      });
  });
};

// 删除文章 (POST)
export const article_delete_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.id;
    if (!articleId) {
      return res.status(400).json("文章 ID 未提供");
    }

    // 先查询文章信息
    const articleToDelete = await Article.findById(articleId).exec();

    if (!articleToDelete) {
      return res.status(404).json("未找到要删除的文章");
    }

    // 检查文章是否有 path 属性
    if (articleToDelete.path) {
      // 构建文件的完整路径
      const filePath = path.join(
        __dirname,
        "../public",
        articleToDelete.path.slice(1)
      ); // 去除路径前面的斜杠

      // 删除文件
      fs.unlink(filePath, (err) => {
        if (err) {
          // 如果文件不存在，直接返回成功
          if (err.code === "ENOENT") {
            console.log("文件不存在，无需删除");
            return res.status(200).json("文件不存在，无需删除");
          } else {
            // 其他错误，返回错误信息
            console.error("删除文件时出错:", err);
            return res.status(500).json("删除文件时出错");
          }
        } else {
          // 文件删除成功
          console.log("文件删除成功");
          return res.status(200).json("文件删除成功");
        }
      });
    }

    // 删除文章
    await Article.findByIdAndDelete(articleId).exec();

    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
// 更新文章
export const article_update_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 上传文件处理
    upload.single("pic")(req, res, async (err: any) => {
      if (err) return next(err); // 处理上传错误
      // 验证和清理字段
      await body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .run(req);
      await body("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .run(req);
      await body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .run(req);
      await body("genres.*").escape().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      // 提取公共部分
      const commonArticleData = {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        text: req.body.text,
        date: req.body.date,
        genre: req.body.genres || [],
        _id: req.params.id, // 使用现有的 ID
      };
      // 根据 req.body.path 的值决定 path 的取值
      let articlePath;
      if (req.file) {
        articlePath = `/photos/${req.file.filename}`;
      } else if (req.body.pic !== "") {
        articlePath = req.body.pic;
      } else {
        articlePath = undefined;
      }
      // 查询文章的旧信息
      const oldArticle = await Article.findById(req.params.id);
      if (!oldArticle) {
        return res.status(404).json("文章未找到");
      }
      if (req.body.pic === "" && oldArticle.path) {
        const filePath = path.join(
          __dirname,
          "../public",
          oldArticle.path.slice(1) // 去除路径前面的斜杠
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json("删除文件时出错");
          } else {
            console.log("文件删除成功");
          }
        });
      }
      // 更新文章
      const thearticle = await Article.findByIdAndUpdate(
        req.params.id,
        {
          ...commonArticleData,
          // 明确指定如果 articlePath 为 undefined，将 path 字段设置为 null
          // 否则为undefined时会缓存原先的路径
          path: articlePath || null,
        },
        { new: true }
      );

      if (!thearticle) {
        res.status(404).json("文章更新失败");
        return;
      } else {
        // 发送 WebSocket 消息
        sendToClients("有新文章更新了！");
        res.status(200).json("success");
      }
    });
  } catch (err) {
    next(err); // 捕获任何其他错误
  }
};

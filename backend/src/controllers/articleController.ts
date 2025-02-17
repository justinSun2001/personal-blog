import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import Article, { IArticle } from "../models/article";
import Author, { IAuthor }from "../models/author";
import Genre, {IGenre} from "../models/genre";


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

// 首页处理函数
export const index = (req: Request, res: Response, next: NextFunction): void => {
  // 使用 Promise.all 代替 async.parallel
  Promise.all([
    Article.countDocuments({}),
    Author.countDocuments({}),
    Genre.countDocuments({})
  ])
    .then((results) => {
      // 结果数组对应顺序：[article_count, author_count, genre_count]
      const [article_count, author_count, genre_count] = results;

      // 渲染视图并传递数据
      res.render('index', {
        title: 'Local Library Home',
        error: null,
        data: {
          article_count,
          author_count,
          genre_count
        }
      });
    })
    .catch((err) => {
      // 如果有错误发生，渲染视图并传递错误信息
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: {}
      });
    });
};
// 首页数据
export const indexData = (req: Request, res: Response, next: NextFunction) => {
  Promise.all([
    Article.countDocuments().exec(),
    Author.countDocuments().exec(),
    Genre.countDocuments().exec(),
  ])
    .then(([articleCount, authorCount, genreCount]) => {
      res.json({ article_count: articleCount, author_count: authorCount, genre_count: genreCount });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// 获取文章列表
export const article_list = (req: Request, res: Response, next: NextFunction) => {
  Article.find({}, "title author")
    .populate("author")
    .exec()
    .then((articles) => res.render("article_list", { title: "Article List", article_list: articles }))
    .catch(next);
};
// Page JSON data
export const article_list_data = (req: Request, res: Response, next: NextFunction): void => {
  Article.find({}, '_id')
    .exec()
    .then((list_articles) => {
      res.json(list_articles);
    })
    .catch((err) => {
      return next(err);
    });
};

// 获取文章详情
export const article_detail = (req: Request, res: Response, next: NextFunction) => {
  Article.findById(req.params.id)
    .populate("author")
    .populate("genre")
    .exec()
    .then((article) => {
      if (!article) {
        return next(new Error("Article not found"));
      }
      res.render("article_detail", { title: article.title, article });
    })
    .catch(next);
};
// Get detail page JSON data
export const article_detail_data = (req: Request, res: Response, next: NextFunction): void => {
  Article.findById(req.params.id)
    .populate('author')
    .populate('genre')
    .exec()
    .then((article) => {
      if (!article) {
        const err = new Error('Article not found');
        return next(err);
      }
      res.json({ article });
    })
    .catch((err) => {
      return next(err);
    });
};
// 文章创建表单 (GET)
export const article_create_get = (req: Request, res: Response, next: NextFunction) => {
  Promise.all([Author.find().exec(), Genre.find().exec()])
    .then(([authors, genres]) => {
      res.render("article_create_form", { title: "Create Article", authors, genres });
    })
    .catch(next);
};

// 文章创建 (POST)
export const article_create_post = (req: Request, res: Response, next: NextFunction): void => {
  upload.single("pics")(req, res, (err: any) => {
    if (err) return next(err); // 处理上传错误
    if (!(req.body.genre instanceof Array)) {
      req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    body("title").trim().isLength({ min: 1 }).withMessage("Title must not be empty.").escape()(req, res, next);
    body("author").trim().isLength({ min: 1 }).withMessage("Author must not be empty.").escape()(req, res, next);
    body("summary").trim().isLength({ min: 1 }).withMessage("Summary must not be empty.").escape()(req, res, next);
    body("text").trim().isLength({ min: 1 }).withMessage("Text must not be empty.").escape()(req, res, next);
    body("date").trim().isLength({ min: 1 }).withMessage("Date must not be empty.").escape()(req, res, next);
    body("genre.*").escape()(req, res, next);

    const errors = validationResult(req);
    const article = new Article({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      text: req.body.text,
      date: req.body.date,
      genre: req.body.genre,
      path: req.file ? `/photos/${req.file.filename}` : undefined,
    });

    if (!errors.isEmpty()) {
      Promise.all([Author.find().exec(), Genre.find().exec()])
        .then(([authors, genres]) => {
          genres.forEach((genre) => {
            if (article.genre.some((articleGenre: any) => articleGenre._id.equals(genre._id))) {
              genre.checked = true;
            }
          });
          res.render("article_create_form", { title: "Create Article", authors, genres, errors: errors.array() });
        })
        .catch(next);
    } else {
      article
        .save()
        .then(() => res.redirect(article.url))
        .catch(next);
    }
  });
};

// 删除文章 (GET)
export const article_delete_get = (req: Request, res: Response, next: NextFunction) => {
  Article.findById(req.params.id)
    .populate("author")
    .populate("genre")
    .exec()
    .then((article) => {
      if (!article) {
        return res.redirect("/catalog/articles");
      }
      res.render("article_delete", { title: "Delete Article", article });
    })
    .catch(next);
};

// 删除文章 (POST)
export const article_delete_post = (req: Request, res: Response, next: NextFunction) => {
  Article.findByIdAndDelete(req.body.id)
    .exec()
    .then(() => res.redirect("/catalog/articles"))
    .catch(next);
};

// 更新文章 (GET)
export const article_update_get = (req: Request, res: Response, next: NextFunction): void => {
    // Get article, authors, and genres for the form
    const articlePromise = Article.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec();

    const authorsPromise = Author.find().exec();
    const genresPromise = Genre.find().exec();

    Promise.all([articlePromise, authorsPromise, genresPromise])
        .then(([article, authors, genres]) => {
            if (!article) {
                const err = new Error('Article not found') as any;
                err.status = 404;
                return next(err);
            }

            // Mark selected genres as checked
            genres.forEach((genre) => {
                if (article.genre.some((articleGenre) => articleGenre._id.toString() === genre._id.toString())) {
                    genre.checked = true;
                }
            });

            res.render('article_form', {
                title: 'Update Article',
                authors,
                genres,
                article
            });
        })
        .catch(next); // Pass any error to the next middleware
};

// 导出一个异步函数，用于更新文章
export const article_update_post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 上传文件处理
    upload.single('pics')(req, res, async (err: any) => {
      if (err) return next(err);  // 处理上传错误

      // 将 genre 转换为数组，如果它不是一个数组
      if (!(req.body.genre instanceof Array)) {
        req.body.genre = req.body.genre ? [req.body.genre] : [];
      }

      // 验证和清理字段
      await body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape().run(req);
      await body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape().run(req);
      await body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape().run(req);
      await body('genre.*').escape().run(req);

      const errors = validationResult(req);

      // 创建或更新文章对象
      const article = new Article({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        text: req.body.text,
        date: req.body.date,
        genre: req.body.genre || [],
        path: req.file ? `/photos/${req.file.filename}` : undefined,
        _id: req.params.id // 使用现有的 ID
      });

      if (!errors.isEmpty()) {
        // 如果存在验证错误，获取作者和类别数据并重新渲染表单
        const [authors, genres] = await Promise.all([Author.find().exec(), Genre.find().exec()]);

        // 标记选中的 genres
        genres.forEach((genre) => {
          if (article.genre.some((articleGenre: any) => articleGenre._id.equals(genre._id))) {
            genre.checked = true;
          }
        });

        return res.render('article_form', {
          title: 'Update Article',
          authors,
          genres,
          article,
          errors: errors.array()
        });
      }

      // 数据有效，更新文章
      const thearticle = await Article.findByIdAndUpdate(req.params.id, article, { new: true });

      if (!thearticle) {
        return res.status(404).send('Article not found');
      }

      // 成功更新 - 重定向到详情页面
      res.redirect(thearticle.url);
    });
  } catch (err) {
    next(err);  // 捕获任何其他错误
  }
};
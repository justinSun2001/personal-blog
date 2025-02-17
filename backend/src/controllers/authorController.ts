import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Author, { IAuthor } from '../models/author';
import Article, { IArticle } from '../models/article';

// Display list of all Authors.
export const author_list = (req: Request, res: Response, next: NextFunction): void => {
    Author.find()
        .sort([['family_name', 'ascending']])
        .then((list_authors) => {
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        })
        .catch(next);
};

// Display detail page for a specific Author.
export const author_detail = (req: Request, res: Response, next: NextFunction): void => {
    Promise.all([
        Author.findById(req.params.id).exec(),
        Article.find({ author: req.params.id }, 'title summary').exec(),
    ])
        .then(([author, authors_articles]) => {
            if (!author) {
                const error = new Error('Author not found');
                (error as any).status = 404;
                throw error;
            }
            if(!authors_articles){
                authors_articles = [];
            }
            res.render('author_detail', { title: 'Author Detail', author, author_articles: authors_articles });
        })
        .catch(next);
};

// Display Author create form on GET.
export const author_create_get = (req: Request, res: Response, next: NextFunction): void => {
    res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
export const author_create_post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 验证字段
      await body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.').run(req);
      await body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.').run(req);
      await body('date_of_birth').optional({ checkFalsy: true }).isISO8601().toDate().run(req);
      await body('date_of_death').optional({ checkFalsy: true }).isISO8601().toDate().run(req);
  
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
        return res.render('author_form', { title: 'Create Author', author, errors: errors.array() });
      }
  
      // 保存 author
      const savedAuthor = await author.save();
  
      // 成功保存，重定向到该 author 的 URL
      res.redirect(savedAuthor.url);
    } catch (err) {
      // 捕获并传递任何错误到错误处理中间件
      next(err);
    }
  };
  

// Display Author delete form on GET.
export const author_delete_get = (req: Request, res: Response, next: NextFunction): void => {
    Promise.all([
        Author.findById(req.params.id).exec(),
        Article.find({ author: req.params.id }).exec(),
    ])
        .then(([author, author_articles]) => {
            if (!author) {
                return res.redirect('/catalog/authors');
            }
            res.render('author_delete', { title: 'Delete Author', author, author_articles });
        })
        .catch(next);
};

// Handle Author delete on POST.
export const author_delete_post = (req: Request, res: Response, next: NextFunction): void => {
    Promise.all([
        Author.findById(req.body.authorid).exec(),
        Article.find({ author: req.body.authorid }).exec(),
    ])
        .then(([author, author_articles]) => {
            if (!author) {
                const error = new Error('Author not found');
                (error as any).status = 404;
                throw error;
            }
            if (author_articles.length > 0) {
                res.render('author_delete', { title: 'Delete Author', author, author_articles });
                return Promise.resolve(null);
            }
            return Author.findByIdAndDelete(req.body.authorid).exec();
        })
        .then(() => res.redirect('/catalog/authors'))
        .catch(next);
};

// Display Author update form on GET.
export const author_update_get = (req: Request, res: Response, next: NextFunction): void => {
    Author.findById(req.params.id).exec()
        .then((author) => {
            if (!author) {
                const error = new Error('Author not found');
                (error as any).status = 404;
                throw error;
            }
            res.render('author_form', { title: 'Update Author', author });
        })
        .catch(next);
};

// Handle Author update on POST.
export const author_update_post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 验证字段
      await body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.').run(req);
      await body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.').run(req);
      await body('date_of_birth').optional({ checkFalsy: true }).isISO8601().toDate().run(req);
      await body('date_of_death').optional({ checkFalsy: true }).isISO8601().toDate().run(req);
  
      // 获取验证结果
      const errors = validationResult(req);
  
      // 创建更新后的 author 对象
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        // 如果验证失败，重新渲染表单并返回错误信息
        return res.render('author_form', { title: 'Update Author', author, errors: errors.array() });
      }
  
      // 更新 author
      const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, author, { new: true }).exec();
  
      if (!updatedAuthor) {
        // 如果没有找到 author，返回 404 错误
        const error = new Error('Author not found');
        (error as any).status = 404;
        throw error;
      }
  
      // 成功更新，重定向到该 author 的 URL
      res.redirect(updatedAuthor.url);
    } catch (err) {
      // 捕获并传递任何错误到错误处理中间件
      next(err);
    }
  };

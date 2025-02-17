import { Request, Response, NextFunction } from 'express';
import Genre, { IGenre } from '../models/genre';
import Article from '../models/article';
import { body, validationResult } from 'express-validator';

// List all genres
export const genre_list = (req: Request, res: Response, next: NextFunction): void => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec()
    .then((listGenres: IGenre[]) => {
      if (!listGenres) {
        return res.status(404).json({ message: 'Genre not found' });
      }
      res.render('genre_list', { title: 'Genre List', list_genres: listGenres });
    })
    .catch((err: any) => next(err));
};

// Genre detail page
export const genre_detail = (req: Request, res: Response, next: NextFunction): void => {
  Promise.all([
    Genre.findById(req.params.id).exec(),
    Article.find({ 'genre': req.params.id }).exec()
  ])
    .then(([genre, genreArticles]) => {
      if (!genre) {
        const error = new Error('Genre not found') as any;
        error.status = 404;
        return next(error);
      }
      if(!genreArticles){
        return res.status(404).json({ message: 'No articles found for this genre' });
      }
      res.render('genre_detail', { title: 'Genre Detail', genre:genre, genre_articles:genreArticles });
    })
    .catch((err: any) => next(err));
};
// Display Genre create form on GET.
export const genre_create_get = (req: Request, res: Response, next: NextFunction): void => {
  res.render('genre_form', { title: 'Create Genre'});
};
// Genre creation form submission on POST
export const genre_create_post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 验证字段
    await body('name', 'Genre name must contain at least 2 characters').trim().isLength({ min: 2 }).escape().run(req);
    
    // 获取验证结果
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      return res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array() });
    }

    // 如果没有验证错误，检查是否已有相同名称的 genre
    const foundGenre = await Genre.findOne({ 'name': req.body.name }).exec();

    if (foundGenre) {
      // 如果已存在该 genre，重定向到它的 URL
      return res.redirect(foundGenre.url);
    }

    // 如果没有找到，保存新的 genre
    const savedGenre = await genre.save();

    if (savedGenre && savedGenre.url) {
      // 成功保存，重定向到该 genre 的 URL
      return res.redirect(savedGenre.url);
    }

    // 如果保存后没有 URL，抛出错误
    throw new Error('Saved genre has no URL');
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};

// Genre delete form on GET
export const genre_delete_get = (req: Request, res: Response, next: NextFunction): void => {
  Promise.all([
    Genre.findById(req.params.id).exec(),
    Article.find({ 'genre': req.params.id }).exec()
  ])
    .then(([genre, genreArticles]) => {
      if (!genre) {
        return res.redirect('/catalog/genres');
      }
      res.render('genre_delete', { title: 'Delete Genre', genre, genreArticles });
    })
    .catch((err: any) => next(err));
};

// Handle Genre delete on POST
export const genre_delete_post = (req: Request, res: Response, next: NextFunction): void => {
  Promise.all([
    Genre.findById(req.params.id).exec(),
    Article.find({ 'genre': req.params.id }).exec()
  ])
    .then(([genre, genreArticles]) => {
      // 如果 genre 为 null，返回 404 错误
      if (!genre) {
        const error = new Error('Genre not found') as any;
        error.status = 404;
        throw error;
      }

      // 如果有相关文章，返回删除页面
      if (genreArticles.length > 0) {
        res.render('genre_delete', { title: 'Delete Genre', genre, genreArticles });
        return Promise.resolve(null);
      } else {
        // 如果没有相关文章，删除该 Genre
        return Genre.findByIdAndDelete(req.params.id).exec();
      }
    })
    .then(() => res.redirect('/catalog/genres'))
    .catch((err: any) => next(err));
};



// Genre update form on GET
export const genre_update_get = (req: Request, res: Response, next: NextFunction): void => {
  Genre.findById(req.params.id).exec()
    .then((genre) => {
      if (!genre) {
        const error = new Error('Genre not found') as any;
        error.status = 404;
        return next(error);
      }
      res.render('genre_form', { title: 'Update Genre', genre });
    })
    .catch((err: any) => next(err));
};

// 导出一个异步函数，用于更新 genre
export const genre_update_post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 验证字段
    await body('name', 'Genre name must contain at least 2 characters').trim().isLength({ min: 2 }).escape().run(req);
    
    // 获取验证结果
    const errors = validationResult(req);

    // 创建一个新的 genre 对象
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // 如果验证失败，重新渲染表单并返回错误信息
      return res.render('genre_form', { title: 'Update Genre', genre, errors: errors.array() });
    }

    // 更新 genre
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, { new: true }).exec();

    if (!updatedGenre) {
      // 如果找不到该 Genre，返回 404 错误
      const error = new Error('Genre not found');
      (error as any).status = 404;
      return next(error);
    }

    // 成功更新，重定向到该 genre 的 URL
    res.redirect(updatedGenre.url);
  } catch (err) {
    // 捕获并传递任何错误到错误处理中间件
    next(err);
  }
};
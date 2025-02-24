// 定义 Author 接口
export interface Author {
  _id: string;
  first_name: string;
  family_name: string;
  date_of_birth: string;
  date_of_death: string;
  __v: number;
}
// 定义 Genre 接口
export interface Genre {
  _id: string;
  name: string;
  checked: boolean;
  __v: number;
}
// 定义 Article 接口
export interface Article {
  _id: string;
  title: string;
  author: Author;
  summary: string;
  text: string;
  date: string;
  path: string;
  genre: Genre[];
  __v: number;
}
// 这是整个返回数据的接口
export interface ArticleData {
  article: Article;
}

// 定义 UseArticle 接口
export interface UseArticle {
  title: string;
  summary: string;
  date: string;
  path: string;
  genre: Genre[];
  id: string;
}

interface Item {
  _id: string;
}
export type ItemArray = Item[];

export interface ArticleList {
  article_count: number;
  author_count: number;
  genre_count: number;
}

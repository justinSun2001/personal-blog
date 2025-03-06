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
// 定义 Article 接口
export interface myArticle {
  _id: string;
  title: string;
  summary: string;
  date: string;
  genre: Genre[];
  path: string;
}
// 定义 mySummary 接口
export interface mySummary {
  _id: string;
  summary: string;
}
// 定义 ArticleList 接口
export interface ArticleList {
  article_count: number;
  author_count: number;
  genre_count: number;
}

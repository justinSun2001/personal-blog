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
  date: string;
}
// 定义 myGenre 接口
export interface myGenre {
  _id: string;
  name: string;
  checked?: boolean;
  __v?: number;
}
// 定义 ArticleList 接口
export interface ArticleList {
  article_count: number;
  author_count: number;
  genre_count: number;
}
// 定义表单数据的类型
export interface FormData {
  id?: number;
  型号1: string;
  型号2: string;
  标识: string;
  版号: string;
  片号: string;
  检验批号: string;
  生产批号: string;
  备注: string;
  目检合格数: string;
  筛选单状态: string;
  收费状态: string;
  是否合检: string;
}
export interface picResponseType {
  code: number;
  message: string;
  data: {
    url: string;
    ocrData: FormData;
    time: number;
  };
}

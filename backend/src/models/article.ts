import mongoose, { Document, Schema, Types, Model } from 'mongoose';

// 定义 Article 文档接口
export interface IArticle extends Document {
  _id: Types.ObjectId;  // _id is an ObjectId by default
  title: string;
  author: Types.ObjectId; // 这里的 author 是一个 ObjectId 类型，引用了 'Author' 模型
  summary: string;
  text: string;
  date: string;
  path?: string;
  genre: Types.ObjectId[]; // genre 是一个 ObjectId 数组，引用了 'Genre' 模型
  url: string; // 虚拟属性
}

// 创建 Schema
const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  path: { type: String },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
});

// 虚拟属性 'url'
ArticleSchema.virtual('url').get(function(this: IArticle) {
  return '/catalog/article/' + this._id;
});

// 导出模型
const Article:Model<IArticle> = mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

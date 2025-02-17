import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// 定义 Genre 文档接口
export interface IGenre extends Document {
  _id: Types.ObjectId;  // _id is an ObjectId by default
  name: string;
  checked: boolean;
  url: string; // 虚拟属性
}

// 创建 Schema
const GenreSchema = new Schema<IGenre>({
  name: { type: String, required: true, minLength: 2, maxLength: 100 },
  checked: { type: Boolean, default: false },  // Set default value to false
});

// 虚拟属性 'url'：藏书副本 URL
GenreSchema.virtual('url').get(function (this: IGenre) {
  return '/catalog/genre/' + this._id;
});

// 导出 Genre 模型
const Genre: Model<IGenre> = mongoose.model<IGenre>('Genre', GenreSchema);

export default Genre;

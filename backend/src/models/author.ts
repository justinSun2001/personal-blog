import mongoose, { Document, Schema, Model, Types } from "mongoose";

// 定义 Author 文档接口
export interface IAuthor extends Document {
  _id: Types.ObjectId; // _id is an ObjectId by default
  first_name: string;
  family_name: string;
  date_of_birth?: Date;
  date_of_death?: Date;
  name: string; // 虚拟属性
  lifespan: Date | undefined; // 虚拟属性
  url: string; // 虚拟属性
}

// 创建 Schema
const AuthorSchema = new Schema<IAuthor>({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// 虚拟属性 'name'：表示作者全名
AuthorSchema.virtual("name").get(function (this: IAuthor) {
  return this.family_name + ", " + this.first_name;
});

// 虚拟属性 'lifespan'：作者寿命
AuthorSchema.virtual("lifespan").get(function (this: IAuthor) {
  return this.date_of_birth;
});

// 虚拟属性 'url'：作者 URL
AuthorSchema.virtual("url").get(function (this: IAuthor) {
  return "/catalog/author/" + this._id;
});

// 导出 Author 模型
const Author: Model<IAuthor> = mongoose.model<IAuthor>("Author", AuthorSchema);

export default Author;

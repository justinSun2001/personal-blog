import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  password: string;
  email: string;
  userName?: string;
}

const UserSchema = new Schema<IUser>({
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  userName: { type: String },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

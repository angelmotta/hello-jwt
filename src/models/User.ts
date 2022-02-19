import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;
  encryptPassword(password: string): string;
  isValidPassword(givenPasswd: string): boolean;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    min: 4,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    requiredPaths: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.methods.encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

userSchema.methods.isValidPassword = function (givenPasswd: string): boolean {
  return bcrypt.compareSync(givenPasswd, this.password);
}

export default model<IUser>('User', userSchema);
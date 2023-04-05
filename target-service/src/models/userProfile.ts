import { Schema } from "mongoose";

export interface IUserProfile {
  _id: string;
  email: string;
}

export const userProfileSchema = new Schema<IUserProfile>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

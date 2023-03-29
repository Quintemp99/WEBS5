import mongoose, { Schema, Document } from "mongoose";
import { IImage, imageSchema } from "./image.model";

interface IUser {
  id: string;
  name: string;
}

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export interface IParticipant {
  user: IUser;
  image: IImage;
  score: number;
}

export const participantSchema = new Schema<IParticipant>({
  user: userSchema,
  image: imageSchema,
  score: {
    type: Number,
  },
});

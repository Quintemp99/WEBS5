import { Schema } from "mongoose";

export interface IImage {
  data: Buffer;
  immagaId: string;
}

export const imageSchema = new Schema<IImage>({
  data: {
    type: Buffer,
    required: true,
  },
  immagaId: {
    type: String,
    required: true,
  },
});

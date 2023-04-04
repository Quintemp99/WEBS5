import mongoose, { Schema } from "mongoose";
import { TProfile } from "../types/profile.type";

const profileSchema = new Schema<TProfile>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model<TProfile>("profile", profileSchema);
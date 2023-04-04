import mongoose, { Schema } from "mongoose";

export interface IUserProfile {
  id: string;
  name: string;
}

const userSchema = new Schema<IUserProfile>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUserProfile>("UserProfile", userSchema);

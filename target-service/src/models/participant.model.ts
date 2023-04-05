import { Schema } from "mongoose";
import { IImage, imageSchema } from "./image.model";
import { IUserProfile, userProfileSchema } from "./userProfile";

export interface IParticipant {
  _id?: string;
  user: IUserProfile;
  image: IImage;
  score: number;
}

export const participantSchema = new Schema<IParticipant>({
  user: userProfileSchema,
  image: imageSchema,
  score: {
    type: Number,
  },
});

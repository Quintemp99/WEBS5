import mongoose, { Schema } from "mongoose";
import { TImage, TLocation, TParticipant, TTarget, TUser } from "../types/profile.type";
import { TProfile } from "../types/profile.type";



const locationSchema = new Schema<TLocation>({
  _id: {
    type: String,
    required: true,
  },
  long: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
});

export const imageSchema = new Schema<TImage>({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  immagaId: {
    type: String,
    required: true,
  },
});

export const userSchema = new Schema<TUser>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});


export const participantSchema = new Schema<TParticipant>({
  _id: {
    type: String,
    required: true,
  },
  user: userSchema,
  image: imageSchema,
  score: {
    type: Number,
  },
});

const targetSchema = new Schema<TTarget>({
    _id: {
      type: String,
      required: true,
    } ,
    user: userSchema,
    image: imageSchema,
    location: locationSchema,
    participants: [participantSchema],
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
);

const profileSchema = new Schema<TProfile>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  targets: [targetSchema]
});

export default mongoose.model<TProfile>("profile", profileSchema);
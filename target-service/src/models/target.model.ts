import mongoose, { Schema, Document } from "mongoose";

interface IUser {
  id: string;
  name: string;
}

interface IParticipant {
  user: IUser;
  image: IImage;
  score: number;
}

interface IImage {
  data: Buffer;
  immagaId: string;
}

interface ILocation {
  long: number;
  lat: number;
}

export interface ITarget extends Document {
  image: IImage;
  location: ILocation;
  participant: IParticipant[];
}

const imageSchema = new Schema<IImage>({
  data: {
    type: Buffer,
    required: true,
  },
  immagaId: {
    type: String,
    required: true,
  },
});

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

const participantSchema = new Schema<IParticipant>({
  user: userSchema,
  image: imageSchema,
  score: {
    type: Number,
  },
});

const locationSchema = new Schema<ILocation>({
  long: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
});

const targetSchema = new Schema<ITarget>({
  image: imageSchema,
  location: locationSchema,
  participant: [participantSchema],
});

targetSchema.virtual("bestUser").get(function () {
  let bestScore = Infinity;
  let bestUser = null;

  this.participant.forEach((participant) => {
    if (participant.score < bestScore) {
      bestScore = participant.score;
      bestUser = participant.user;
    }
  });

  return bestUser;
});

export default mongoose.model<ITarget>("Target", targetSchema);

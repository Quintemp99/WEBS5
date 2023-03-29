import mongoose, { Schema, Document } from "mongoose";
import { IImage, imageSchema } from "./image.model";
import { IParticipant, participantSchema } from "./participant.model";

const opts = { toJSON: { virtuals: true } };

interface ILocation {
  long: number;
  lat: number;
}

export interface ITarget extends Document {
  image: IImage;
  location: ILocation;
  participant: IParticipant[];
  created_at: Date;
}

const locationSchema = new Schema<ILocation>({
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

const targetSchema = new Schema<ITarget>(
  {
    image: imageSchema,
    location: locationSchema,
    participant: [participantSchema],
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);

targetSchema.virtual("bestParticipant").get(function () {
  let bestScore = Infinity;
  let bestParticipant = null;

  if (!this.participant) {
    return null;
  }
  this.participant.forEach((participant) => {
    if (participant.score < bestScore) {
      bestScore = participant.score;
      bestParticipant = participant;
    }
  });
  return bestParticipant;
});

export default mongoose.model<ITarget>("Target", targetSchema);

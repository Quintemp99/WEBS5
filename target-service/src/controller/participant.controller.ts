import dotenv from "dotenv";
import ImmagaApi from "../services/ImmagaApi.service";
import Target from "../models/target.model";
import { TParticipant } from "../types/participant.type";
import { Request, Response } from "express";
import { publishParticipant } from "../services/publicher.service";

dotenv.config();

async function createParticipant(
  result: TParticipant,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const target = await Target.findById(result.targetId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const created_at = new Date(target!.created_at);
  const now = new Date();
  const diff = Math.abs(now.getTime() - created_at.getTime());
  const diffHours = Math.ceil(diff / (1000 * 60 * 60));

  if (diffHours > 24) {
    throw new Error("Target is older than 24 hours, and can no longer be used");
  }

  const user = {
    _id: result.user._id,
    email: result.user.email,
  };

  const image = {
    data: result.image.data,
    immagaId: data.result.upload_id,
  };

  const score = await compareTargetParticipant(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    target!.image.immagaId,
    data.result.upload_id
  );

  const participant = {
    user,
    image,
    score,
  };

  const updatedTarget = await Target.findByIdAndUpdate(
    result.targetId,
    { $push: { participant } },
    { new: true }
  );
  //TODO: ben je dom ofzo? hier is de target met de participant erin
  if(updatedTarget){
    publishParticipant(updatedTarget)
  }
  return updatedTarget;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function compareTargetParticipant(target: any, participant: any) {
  if (!target || !participant) {
    throw new Error("Target or participant not specified");
  }

  const data = await ImmagaApi.compareImages(target, participant);
  return data.result.distance;
}

async function getParticipantImage(req: Request, res: Response): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    const participant = target?.participant.find(
      (p) => p.user._id === req.params.userId
    );
    const { image } = participant ?? {};
    if (image?.data) {
      res.set("Content-Type", "image/jpeg");
      res.send(Buffer.from(image.data));
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error occurred while fetching image");
  }
}

export default {
  createParticipant,
  compareTargetParticipant,
  getParticipantImage,
};

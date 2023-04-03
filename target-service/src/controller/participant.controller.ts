import dotenv from "dotenv";
import ImmagaApi from "../services/ImmagaApi.service";
import Target, { ITarget } from "../models/target.model";

dotenv.config();

async function createParticipant(req: any, data: any): Promise<any> {
  const target = await Target.findById(req.params.id);

  const created_at = new Date(target!.created_at);
  const now = new Date();
  const diff = Math.abs(now.getTime() - created_at.getTime());
  const diffHours = Math.ceil(diff / (1000 * 60 * 60));
  if (diffHours > 24) {
    throw new Error("Target is older than 24 hours, and can no longer be used");
  }

  const user = {
    id: "123",
    name: "test",
  };

  const image = {
    data: req.files.image.data,
    immagaId: data.result.upload_id,
  };

  const score = await compareTargetParticipant(
    target!.image.immagaId,
    data.result.upload_id
  );

  const participant = {
    user,
    image,
    score,
  };

  const updatedTarget = await Target.findByIdAndUpdate(
    req.params.id,
    { $push: { participant } },
    { new: true }
  );
  return updatedTarget;
}

async function compareTargetParticipant(target: any, participant: any) {
  if (!target || !participant) {
    throw new Error("Target or participant not specified");
  }

  const data = await ImmagaApi.compareImages(target, participant);
  return data.result.distance;
}

async function getParticipantImage(req: any, res: any): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    const participant = target?.participant.find(
      (p) => p.user.id === req.params.userId
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

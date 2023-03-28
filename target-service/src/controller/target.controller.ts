import dotenv from "dotenv";
import FormData from "form-data";
import ImmagaApi from "../services/ImmagaApi.service";
import Target, { ITarget } from "../models/target.model";

dotenv.config();

async function uploadTarget(req: any, res: any): Promise<void> {
  try {
    const data = await uploadImage(req);
    const target = await createTarget(req, data);
    res.send(target);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
}

async function uploadParticipant(req: any, res: any): Promise<void> {
  try {
    const data = await uploadImage(req);
    const participant = await createParticipant(req, data);
    res.send(participant);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

async function uploadImage(req: any): Promise<any> {
  if (!req.files?.image) {
    throw new Error("No image specified");
  }

  const formData = new FormData();
  formData.append("image", req.files.image.data, "uploaded_image.jpg");

  const data = await ImmagaApi.uploadImage(formData);
  return data;
}

async function createTarget(req: any, data: any): Promise<any> {
  const target = {
    image: {
      data: req.files.image.data,
      immagaId: data.result.upload_id,
    },
    location: {
      long: 0,
      lat: 0,
    },
  };
  const savedTarget = await Target.create(target);
  return savedTarget;
}

async function createParticipant(req: any, data: any): Promise<any> {
  const target = await Target.findById(req.params.id);

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

async function getBestParticipant(req: any, res: any): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    const bestParticipant = target?.participant.reduce((prev, current) =>
      prev.score < current.score ? prev : current
    );
    const returnParticipant = {
      user: bestParticipant?.user,
      score: bestParticipant?.score,
    };
    res.send(returnParticipant);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

async function getParticipantImage(req: any, res: any): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    const participant = target?.participant.find(
      (p) => p.user.id === req.params.userId
    );
    if (participant?.image && participant?.image.data) {
      res.set("Content-Type", "image/jpeg");
      res.send(Buffer.from(participant.image.data));
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export default {
  uploadTarget,
  uploadParticipant,
  getBestParticipant,
  getParticipantImage,
};

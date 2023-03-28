import dotenv from "dotenv";
import FormData from "form-data";
import ImmagaApi from "../services/ImmagaApi.service";
import Target, { ITarget } from "../models/target.model";

dotenv.config();

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

async function getAllTargets(req: any, res: any): Promise<void> {
  try {
    const targets = await Target.find({}, [
      "_id",
      "location",
      "participant._id",
      "participant.score",
      "participant.user",
      "bestParticipant",
    ]);
    res.send(targets);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

async function getTargetImage(req: any, res: any): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    const image = target?.image.data;
    if (image) {
      res.set("Content-Type", "image/jpeg");
      res.send(Buffer.from(image));
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error occurred while fetching image");
  }
}

export default {
  createTarget,
  getAllTargets,
  getTargetImage,
};

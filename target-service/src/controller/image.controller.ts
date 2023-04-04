import dotenv from "dotenv";
import ImmagaApi from "../services/ImmagaApi.service";
import TargetController from "../controller/target.controller";
import ParticipantController from "../controller/participant.controller";
import { TTarget } from "../types/target.type";
import { Response } from "express";
import { TParticipant } from "../types/participant.type";
dotenv.config();

async function uploadTarget(result: TTarget, res: Response): Promise<void> {
  try {
    const data = await uploadImage(result);
    const target = await TargetController.createTarget(result, data);
    res.send(target);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
}

async function uploadParticipant(
  result: TParticipant,
  res: Response
): Promise<void> {
  try {
    const data = await uploadImage(result);
    const participant = await ParticipantController.createParticipant(
      result,
      data
    );
    res.send(participant);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Server error occurred while uploading image. Target is older than 24 hours, and can no longer be used"
      );
  }
}

async function uploadImage(result: TTarget | TParticipant): Promise<FormData> {
  if (!result.image) {
    throw new Error("No image specified");
  }

  const formData = new FormData();
  const image = new Blob([result.image.data]);
  formData.append("image", image, "uploaded_image.jpg");

  const data = await ImmagaApi.uploadImage(formData);
  return data;
}

export default {
  uploadTarget,
  uploadParticipant,
};

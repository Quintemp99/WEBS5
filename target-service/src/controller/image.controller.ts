import dotenv from "dotenv";
import FormData from "form-data";
import ImmagaApi from "../services/ImmagaApi.service";
import TargetController from "../controller/target.controller";
import ParticipantController from "../controller/participant.controller";

dotenv.config();

async function uploadTarget(req: any, res: any): Promise<void> {
  try {
    const data = await uploadImage(req);
    const target = await TargetController.createTarget(req, data);
    res.send(target);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
}

async function uploadParticipant(req: any, res: any): Promise<void> {
  try {
    const data = await uploadImage(req);
    const participant = await ParticipantController.createParticipant(
      req,
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

async function uploadImage(req: any): Promise<any> {
  if (!req.files?.image) {
    throw new Error("No image specified");
  }

  const formData = new FormData();
  formData.append("image", req.files.image.data, "uploaded_image.jpg");

  const data = await ImmagaApi.uploadImage(formData);
  return data;
}

export default {
  uploadTarget,
  uploadParticipant,
};

import dotenv from "dotenv";
import FormData from "form-data";
import ImmagaApi from "../services/ImmagaApi.service";
import Target, { ITarget } from "../models/target.model";

dotenv.config();

async function UploadTarget(req: any, res: any) {
  UploadImage(req, res).then((data) => {
    res.send(CreateTarget(req, data));
  });
}

async function UploadParticipant(req: any, res: any) {
  await UploadImage(req, res).then((data) => {
    res.send(CreateParticipant(req, data));
  });
}

async function UploadImage(req: any, res: any) {
  let formData = new FormData();
  if (!req.files.image) {
    res.writeHead(300, { "Content-type": "text/javascript" });
    res.end(JSON.stringify({ status: "failed", error: "no image specified" }));
    return;
  }
  formData.append("image", req.files.image.data, "uploaded_image.jpg");
  return await ImmagaApi.UploadImage(formData).then((data: any) => {
    return data;
  });
}

function CreateTarget(req: any, data: any): any {
  const target = new Target({
    image: {
      data: req.files.image.data,
      immagaId: data.result.upload_id,
    },
    location: {
      long: 0,
      lat: 0,
    },
  });
  target.save().then((data: any) => {
    return data;
  });
}

async function CreateParticipant(req: any, data: any): Promise<any> {
  const target = await Target.findById(req.params.id);

  const user = {
    id: "123",
    name: "test",
  };

  const image = {
    data: req.files.image.data,
    immagaId: data.result.upload_id,
  };

  const participant = {
    user: user,
    image: image,
    score: await CompareTargetParticipant(
      target!.image.immagaId,
      data.result.upload_id
    ).then((data) => {
      return data;
    }),
  };

  Target.findByIdAndUpdate(
    req.params.id,
    { $push: { participant: participant } },
    { new: true }
  ).then((data) => {
    return data;
  });
}

async function CompareTargetParticipant(target: any, participant: any) {
  if (target && participant) {
    return ImmagaApi.CompareImages(target, participant).then((data: any) => {
      return data.result.distance;
    });
  }
}

function CompareImages(req: any, res: any) {
  const ImageTarget = req.query.ImageTarget;
  const ImageParticipant = req.query.ImageParticipant;
  if (!ImageTarget || !ImageParticipant) {
  }
  ImmagaApi.CompareImages(ImageTarget, ImageParticipant).then((data: any) => {
    res.send(data);
  });
}

export default { UploadTarget, UploadParticipant, CompareImages };

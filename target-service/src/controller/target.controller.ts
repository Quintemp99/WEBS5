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
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const startIndex = (page - 1) * limit;

  try {
    const targets = await Target.find({}, [
      "_id",
      "location",
      "participant._id",
      "participant.score",
      "participant.user",
      "bestParticipant",
    ])
      .skip(startIndex)
      .limit(limit)
      .exec();

    const totalCount = await Target.countDocuments();

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalPageItems: targets.length,
      totalItems: totalCount,
    };

    res.send({
      pagination,
      data: targets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error occurred while fetching targets");
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

async function findTargetParticipantByUser(req: any, res: any): Promise<void> {
  const target = await Target.findById(req.params.id);
  const participant = target?.participant.find(
    (p: any) => p.user.id === req.query.userId
  );
  if (participant) {
    res.send(participant);
  } else {
    res.status(404).send("Participant not found");
  }
}

export default {
  createTarget,
  getAllTargets,
  getTargetImage,
  findTargetParticipantByUser,
};

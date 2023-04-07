import dotenv from "dotenv";
import Target, { ITarget } from "../models/target.model";
import { TTarget } from "../types/target.type";
import { Request, Response } from "express";
import { publishDeleteParticipant, publishDeleteTarget, publishTarget } from "../services/publicher.service";

dotenv.config();

const TARGET_COLUMNS = [
  "_id",
  "user",
  "location",
  "image.immagaId",
  "participant._id",
  "participant.score",
  "participant.user",
  "participant.image.immagaId",
  "bestParticipant",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createTarget(result: TTarget, data: any): Promise<ITarget> {
  const target = <ITarget>{
    user: {
      _id: result.user._id,
      email: result.user.email,
    },
    image: {
      data: result.image.data,
      immagaId: data.result.upload_id,
    },
    location: {
      long: result.long,
      lat: result.lat,
    },
  };
  //TODO: HIER HEB JE JE DIKKE TARGET NEEF
  const newTarget = await Target.create(target);
  await publishTarget(newTarget)
  return newTarget
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAllTargets(req: any, res: any): Promise<void> {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const startIndex = (page - 1) * limit;

  try {
    const targets = await Target.find({}, TARGET_COLUMNS)
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

async function getTargetImage(req: Request, res: Response): Promise<void> {
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

async function getTarget(req: Request, res: Response): Promise<void> {
  try {
    if (req.query.userId) {
      const target = await Target.findById(req.params.id);
      const participant = target?.participant.find(
        (p) => p.user._id === req.query.userId
      );
      if (target && participant) {
        target.participant = [participant];
        res.send(target);
      } else {
        res.status(404).send("Target and participant not found");
      }
    } else if (req.query.long && req.query.lat) {
      const target = await Target.find(
        {
          "location.long": req.query.long,
          "location.lat": req.query.lat,
        },
        TARGET_COLUMNS
      );
      if (target.length > 0) {
        res.send(target);
      } else {
        res.status(404).send("Target not found");
      }
    } else if (req.params.id) {
      const target = await Target.findById(req.params.id, TARGET_COLUMNS);
      if (target) {
        res.send(target);
      } else {
        res.status(404).send("Target not found");
      }
    } else {
      res.status(400).send("Invalid query parameters");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function deleteTarget(req: Request, res: Response): Promise<void> {
  try {
    const target = await Target.findById(req.params.id);
    if (target) {
      publishDeleteTarget(target);
      await Target.findByIdAndDelete(req.params.id);
      res.send("Target deleted");
    } else {
      res.status(404).send("Target not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function deleteParticipantFromTarget(
  req: Request,
  res: Response
): Promise<void> {
  const target = await Target.findById(req.params.id);
  if(target){
    Target.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          participant: { _id: req.params.participantId },
        },
      }
    )
      .then((result) => {
        publishDeleteParticipant(target, req.params.participantId)
        console.log(result);
        res.send("Participant deleted");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal server error");
      });
  }
}

export default {
  createTarget,
  getAllTargets,
  getTargetImage,
  getTarget,
  deleteTarget,
  deleteParticipantFromTarget,
};

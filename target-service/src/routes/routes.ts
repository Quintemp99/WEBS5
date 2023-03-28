import { TRoutesInput } from "../types/routes";
import ImmagaApi from "../services/ImmagaApi.service";
import TargetController from "../controller/target.controller";
import Target, { ITarget } from "../models/target.model";

export default ({ app }: TRoutesInput) => {
  app.post("/createTarget", async (req: any, res: any) => {
    TargetController.uploadTarget(req, res);
  });

  app.post("/createParticipant/:id", async (req: any, res: any) => {
    TargetController.uploadParticipant(req, res);
  });

  app.get("/bestParticipant/:id", async (req: any, res: any) => {
    TargetController.getBestParticipant(req, res);
  });

  app.get("/getParticipantImage/:id/:userId", async (req: any, res: any) => {
    TargetController.getParticipantImage(req, res);
  });
};

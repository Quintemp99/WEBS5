import { TRoutesInput } from "../types/routes";
import ImmagaApi from "../services/ImmagaApi.service";
import TargetController from "../controller/target.controller";
import Target, { ITarget } from "../models/target.model";

export default ({ app }: TRoutesInput) => {
  // app.post("/uploadImage", async (req: any, res: any) => {
  //   TargetController.UploadImage(req, res);
  // });
  app.get("/compareImages", async (req: any, res: any) => {
    TargetController.CompareImages(req, res);
  });

  app.post("/createTarget", async (req: any, res: any) => {
    TargetController.UploadTarget(req, res);
  });

  app.post("/createParticipant/:id", async (req: any, res: any) => {
    TargetController.UploadParticipant(req, res);
  });
};

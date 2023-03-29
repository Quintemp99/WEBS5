import { TRoutesInput } from "../types/routes";
import ImageController from "../controller/image.controller";
import TargetController from "../controller/target.controller";
import ParticipantController from "../controller/participant.controller";

export default ({ app }: TRoutesInput) => {
  app.post("/createTarget", async (req: any, res: any) => {
    ImageController.uploadTarget(req, res);
  });

  app.get("/getAllTargets", async (req: any, res: any) => {
    TargetController.getAllTargets(req, res);
  });

  app.post("/createParticipant/:id", async (req: any, res: any) => {
    ImageController.uploadParticipant(req, res);
  });

  app.get("/getParticipantImage/:id/:userId", async (req: any, res: any) => {
    ParticipantController.getParticipantImage(req, res);
  });

  app.get("/getTargetImage/:id", async (req: any, res: any) => {
    TargetController.getTargetImage(req, res);
  });

  app.get("/getTarget/:id?", async (req: any, res: any) => {
    TargetController.getTarget(req, res);
  });
};

import { TRoutesInput } from "../types/routes";
import ImageController from "../controller/image.controller";
import TargetController from "../controller/target.controller";
import ParticipantController from "../controller/participant.controller";

export default ({ app }: TRoutesInput) => {
  app.post("/target", (req, res) => {
    ImageController.uploadTarget(req, res);
  });

  app.get("/target", (req, res) => {
    TargetController.getAllTargets(req, res);
  });

  app.post("/participant/:id", (req, res) => {
    ImageController.uploadParticipant(req, res);
  });

  app.get("/participant/:id/:userId/image", (req, res) => {
    ParticipantController.getParticipantImage(req, res);
  });

  app.get("/target/:id/image", (req, res) => {
    TargetController.getTargetImage(req, res);
  });

  app.get("/target/:id?", (req, res) => {
    TargetController.getTarget(req, res);
  });

  app.delete("/target/:id", (req, res) => {
    TargetController.deleteTarget(req, res);
  });

  app.delete("/target/:id/:participantId", (req, res) => {
    TargetController.deleteParticipantFromTarget(req, res);
  });
};

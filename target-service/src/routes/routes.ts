import { TRoutesInput } from "../types/routes";
import ImageController from "../controller/image.controller";
import TargetController from "../controller/target.controller";
import ParticipantController from "../controller/participant.controller";
import TargetValidation from "../validation/target.validation";
import ParticipantValidation from "../validation/participant.validation";
import { TTarget } from "../types/target.type";
import { TParticipant } from "../types/participant.type";
import { passportMiddleware } from "../middleware/auth.middleware";

export default ({ app }: TRoutesInput) => {
  app.post("/", passportMiddleware, (req, res) => {
    try {
      const result = TargetValidation.validateTarget(req);
      ImageController.uploadTarget(<TTarget>result, res);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

  app.get("/", passportMiddleware, (req, res) => {
    TargetController.getAllTargets(req, res);
  });

  app.post("/participant/:id", passportMiddleware, (req, res) => {
    try {
      const result = ParticipantValidation.validateParticipant(req);
      ImageController.uploadParticipant(<TParticipant>result, res);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

  app.get("/participant/:id/:userId/image", passportMiddleware, (req, res) => {
    ParticipantController.getParticipantImage(req, res);
  });

  app.get("/:id/image", passportMiddleware, (req, res) => {
    TargetController.getTargetImage(req, res);
  });

  app.get("/:id?", passportMiddleware, (req, res) => {
    TargetController.getTarget(req, res);
  });

  app.delete("/:id", passportMiddleware, (req, res) => {
    TargetController.deleteTarget(req, res);
  });

  app.delete("/:id/:participantId", passportMiddleware, (req, res) => {
    TargetController.deleteParticipantFromTarget(req, res);
  });
};

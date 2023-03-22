import { TRoutesInput } from "../types/routes";
import ImmagaApi from "../services/ImmagaApi.service";
import TargetController from "../controller/target.controller";

export default ({ app }: TRoutesInput) => {
  app.post("/uploadImage", async (req: any, res: any) => {
    TargetController.UploadImage(req, res);
  });
  app.get("/compareImages", async (req: any, res: any) => {
    TargetController.CompareImages(req, res);
  });
};

import dotenv from "dotenv";
import FormData from "form-data";
import ImmagaApi from "../services/ImmagaApi.service";

dotenv.config();

async function UploadImage(req: any, res: any) {
  let data = new FormData();
  if (!req.files.image) {
    res.writeHead(300, { "Content-type": "text/javascript" });
    res.end(JSON.stringify({ status: "failed", error: "no image specified" }));
    return;
  }
  data.append("image", req.files.image.data, "target_image.jpg");
  await ImmagaApi.UploadImage(data).then((data) => {
    res.send(data);
  });
}

function CompareImages(req: any, res: any) {
  const ImageTarget = req.query.ImageTarget;
  const ImageContender = req.query.ImageContender;
  if (!ImageTarget || !ImageContender) {
  }
  ImmagaApi.CompareImages(ImageTarget, ImageContender).then((data) => {
    res.send(data);
  });
}

export default { UploadImage, CompareImages };

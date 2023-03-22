import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";

const API_ENDPOINT = "https://api.imagga.com/v2";
const CATEGORIZER = "general_v3"; // The default general purpose categorizer
const INDEX_NAME = "similarity_webs";

const upload_endpoint = `${API_ENDPOINT}/uploads`;
const compare_endpoint = `${API_ENDPOINT}/images-similarity/categories/${CATEGORIZER}`;
const tickets_endpoint = `${API_ENDPOINT}/tickets`;

export default class ImmagaApi {
  constructor() {
    dotenv.config();
  }

  static async UploadImage(data: FormData): Promise<any> {
    const response = await axios
      .post(upload_endpoint, data, {
        auth: {
          username: process.env.IMMAGA_API_KEY!,
          password: process.env.IMMAGA_API_SECRET!,
        },
        headers: data.getHeaders(),
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return response;
  }

  static async CompareImages(
    ImageTarget: String,
    ImageContender: String
  ): Promise<any> {
    const response = await axios
      .get(compare_endpoint, {
        auth: {
          username: process.env.IMMAGA_API_KEY!,
          password: process.env.IMMAGA_API_SECRET!,
        },
        params: {
          image_upload_id: ImageTarget,
          image2_upload_id: ImageContender,
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return response;
  }
}

import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const API_ENDPOINT = "https://api.imagga.com/v2";
const CATEGORIZER = "general_v3"; // The default general purpose categorizer

const UPLOAD_ENDPOINT = `${API_ENDPOINT}/uploads`;
const COMPARE_ENDPOINT = `${API_ENDPOINT}/images-similarity/categories/${CATEGORIZER}`;

export default class ImmagaApi {
  static async uploadImage(data: FormData): Promise<any> {
    try {
      const response = await axios.post(UPLOAD_ENDPOINT, data, {
        auth: {
          username: process.env.IMMAGA_API_KEY!,
          password: process.env.IMMAGA_API_SECRET!,
        },
        headers: data.getHeaders(),
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async compareImages(
    ImageTarget: string,
    ImageContender: string
  ): Promise<any> {
    try {
      const response = await axios.get(COMPARE_ENDPOINT, {
        auth: {
          username: process.env.IMMAGA_API_KEY!,
          password: process.env.IMMAGA_API_SECRET!,
        },
        params: {
          image_upload_id: ImageTarget,
          image2_upload_id: ImageContender,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

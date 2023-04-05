import dotenv from "dotenv";

dotenv.config();

const API_ENDPOINT = "https://api.imagga.com/v2";
const CATEGORIZER = "general_v3"; // The default general purpose categorizer

const UPLOAD_ENDPOINT = `${API_ENDPOINT}/uploads`;
const COMPARE_ENDPOINT = `${API_ENDPOINT}/images-similarity/categories/${CATEGORIZER}`;

export default class ImmagaApi {
  static async uploadImage(data: FormData): Promise<any> {
    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.IMMAGA_API_KEY}:${process.env.IMMAGA_API_SECRET}`
          )}`,
        },
        body: data,
      });
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
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
      const response = await fetch(
        `${COMPARE_ENDPOINT}?image_upload_id=${ImageTarget}&image2_upload_id=${ImageContender}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.IMMAGA_API_KEY}:${process.env.IMMAGA_API_SECRET}`
            )}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

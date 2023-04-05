export type TTarget = {
  user: {
    _id: string;
    email: string;
  };
  image: {
    name: string;
    data: Buffer;
    size: number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
  };
  long: number;
  lat: number;
};

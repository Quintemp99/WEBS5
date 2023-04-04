export type TParticipant = {
  targetId: string;
  image: {
    name: string;
    data: {
      type: string;
      data: number[];
    };
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

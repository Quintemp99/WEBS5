interface IImaggaClientOptions {
  apiKey: string;
  apiSecret: string;
  apiUrl: string;
}

interface IImage {
  id: string;
  url: string;
  metadata: {
    [key: string]: string;
  };
}

interface ISearchImageResult {
  image: IImage;
  score: number;
}

interface ISimilarImagesResult {
  results: ISearchImageResult[];
}

export type {
  IImaggaClientOptions,
  IImage,
  ISearchImageResult,
  ISimilarImagesResult,
};

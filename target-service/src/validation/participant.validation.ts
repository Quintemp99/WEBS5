import { z } from "zod";

const MAX_FILE_SIZE = 1500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type ValidatePayload = z.infer<typeof participantSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateParticipant(req: any) {
  const payload: ValidatePayload = {
    user: req.user,
    targetId: req.params.id,
    image: req.files.image,
    long: req.body.long,
    lat: req.body.lat,
  };

  const parseParticipantSchema = (props: ValidatePayload) => {
    return participantSchema.parse(props);
  };

  return parseParticipantSchema(payload);
}

const participantSchema = z.object({
  user: z.any(),
  targetId: z.string({
    required_error: "target id is required",
    invalid_type_error: "target id must be a string",
  }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  long: z
    .number({
      required_error: "long is required",
      invalid_type_error: "long must be a number",
    })
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= -180 && n <= 180, "long must be between -180 and 180"),
  lat: z
    .number({
      required_error: "lat is required",
      invalid_type_error: "lat must be a number",
    })
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= -90 && n <= 90, "long must be between -90 and 90"),
});

export default {
  validateParticipant,
};

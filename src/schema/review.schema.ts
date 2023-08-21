import { z } from "zod";
import { ObjectId } from "bson";

export const reviewObject = z.object({
  product_id: z.string().refine((value) => {
    try {
      new ObjectId(value);
      return true;
    } catch (error) {
      return false;
    }
  }, "Invalid ObjectId"),
  username: z.string({ required_error: "username not defined" }),
  title: z.string({ required_error: "title not defined" }),
  comment: z.string({ required_error: "comment is not defined" }),
  rating: z.number({ required_error: "rating is not defined" }),
});

export type ReqReviewObject = z.infer<typeof reviewObject>;

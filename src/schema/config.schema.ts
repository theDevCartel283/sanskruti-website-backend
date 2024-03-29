import z from "zod";

// Social
export const social = z.object({
  media: z.string(),
  Image: z.string(),
  imageName: z.string(),
});

export const socialId = z.object({
  id: z.string(),
});

export const setSocial = socialId.merge(social);

export type ReqSetSocial = z.infer<typeof social>;
export type ReqUpdateSocial = z.infer<typeof setSocial>;

// PayZapp
export const payment = z.object({
  merchant_id: z.string().nullish(),
  working_key: z.string().nullish(),
  access_code: z.string().nullish(),
});

export type ReqConfigPayment = z.infer<typeof payment>;

// Auth
export const authSchema = z.object({
  secret: z.string(),
  clientId: z.string(),
});

export type ReqConfigAuth = z.infer<typeof authSchema>;

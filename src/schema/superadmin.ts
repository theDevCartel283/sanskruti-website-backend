import z from 'zod';

// schema
export const BanEmail = z.object({
  email: z.string().email(),
});

// type
export type ReqBanEmail = z.infer<typeof BanEmail>;

import z from 'zod';
import { userEmailPwd } from './user.schema';

// schema
export const Admin = userEmailPwd.merge(
  z.object({
    role: z.enum(['ADMIN', 'SUPERADMIN']),
  })
);

// types
export type ReqAdmin = z.infer<typeof Admin>;

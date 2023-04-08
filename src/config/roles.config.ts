import { env } from './env';

const user_secret = env.USER_ROLE;
const admin_secret = env.ADMIN_ROLE;
const superadmin_secret = env.SUPERADMIN_ROLE;

export const Roles = {
  USER: user_secret,
  ADMIN: admin_secret,
  SUPERADMIN: superadmin_secret,
};

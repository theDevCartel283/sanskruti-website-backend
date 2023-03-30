const user_secret = process.env.USER_ROLE;
const admin_secret = process.env.ADMIN_ROLE;
const superadmin_secret = process.env.SUPERADMIN_ROLE;

if (!user_secret || !admin_secret || !superadmin_secret)
  throw new Error('role secrets not defined');

export const Roles = {
  USER: user_secret,
  ADMIN: admin_secret,
  SUPERADMIN: superadmin_secret,
};

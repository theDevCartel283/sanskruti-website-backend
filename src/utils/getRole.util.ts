import { env } from '../config/env';

const user_secret = env.USER_ROLE;
const admin_secret = env.ADMIN_ROLE;
const superadmin_secret = env.SUPERADMIN_ROLE;

const getRole = (
  roleSecret: string
): 'USER' | 'ADMIN' | 'SUPERADMIN' | undefined => {
  if (roleSecret === user_secret) return 'USER';
  if (roleSecret === admin_secret) return 'ADMIN';
  if (roleSecret === superadmin_secret) return 'SUPERADMIN';
  return undefined;
};

export default getRole;

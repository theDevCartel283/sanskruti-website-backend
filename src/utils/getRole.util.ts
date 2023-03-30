const user_secret = process.env.USER_ROLE;
const admin_secret = process.env.ADMIN_ROLE;
const superadmin_secret = process.env.SUPERADMIN_ROLE;

if (!user_secret || !admin_secret || !superadmin_secret)
  throw new Error('role secrets not defined');

const getRole = (
  roleSecret: string
): 'USER' | 'ADMIN' | 'SUPERADMIN' | undefined => {
  if (roleSecret === user_secret) return 'USER';
  if (roleSecret === admin_secret) return 'ADMIN';
  if (roleSecret === superadmin_secret) return 'SUPERADMIN';
  return undefined;
};

export default getRole;

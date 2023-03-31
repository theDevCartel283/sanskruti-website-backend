import handleRegister from './register.user.controller';
import handleAuthentication from './login.user.controller';

// Protected
import handleGetUser from './getuser.user.controller';
import handleLogout from './logout.user.controller';
import handleDelete from './delete.user.controller';

export {
  handleRegister,
  handleAuthentication,

  // Protected
  handleGetUser,
  handleLogout,
  handleDelete,
};

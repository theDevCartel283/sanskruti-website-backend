import handleRegister from './register.user.controller';
import handleAuthentication from './login.user.controller';

// Protected
import handleGetUser from './getuser.user.contoller';
import handleLogout from './logout.user.contoller';
import handleDelete from './delete.user.contoller';

export {
  handleRegister,
  handleAuthentication,

  // Protected
  handleGetUser,
  handleLogout,
  handleDelete,
};

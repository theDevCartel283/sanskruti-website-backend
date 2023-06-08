import { handleRegister } from "./register.user.controller";
import { handleAuthentication } from "./login.user.controller";

// Protected
import handleGetUser from "./getuser.user.controller";
import { handleLogout } from "./logout.user.controller";
import handleUpdatePassword from "./updatePassword.user.controller";
import handleUpdateUser from "./updateUser.user.controller";
import { handleDelete } from "./delete.user.controller";
import { addAddress } from "./addAddress.user.controller";
import { updateAddress } from "./updateAddress.user.controller";
import { handleDeleteAddress } from "./deleteAddress.user.controller";
import { getAllAddress } from "./allAddress.user.controller";
import { handleVerifyEmail } from "./verifyEmail.user.controller";

export {
  handleRegister,
  handleAuthentication,

  // Protected
  handleGetUser,
  handleLogout,
  handleUpdatePassword,
  handleUpdateUser,
  handleDelete,
  addAddress,
  updateAddress,
  handleDeleteAddress,
  getAllAddress,
  handleVerifyEmail,
};

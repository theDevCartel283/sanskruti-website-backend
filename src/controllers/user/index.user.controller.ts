import { handleRegister } from "./register.user.controller";
import { handleAuthentication } from "./login.user.controller";

// Protected
import handleGetUser from "./getuser.user.controller";
import { handleLogout } from "./logout.user.controller";
import handleUpdatePassword from "./updatePassword.user.controller";
import handleUpdateUser from "./updateUser.user.controller";
import {
  handleDeleteForEmail,
  handleDeleteForNumber,
} from "./delete.user.controller";
import { addAddress } from "./addAddress.user.controller";
import { updateAddress } from "./updateAddress.user.controller";
import { getAllAddress } from "./allAddress.user.controller";

export {
  handleRegister,
  handleAuthentication,

  // Protected
  handleGetUser,
  handleLogout,
  handleUpdatePassword,
  handleUpdateUser,
  handleDeleteForEmail,
  handleDeleteForNumber,
  addAddress,
  updateAddress,
  getAllAddress,
};

import handleCreateAdmin from "./createAdmin.superadmin.controller";
import handleBanUserAndEditRole from "./banUserAndDefineRole.superadmin.controller";
import handleGetBannedUser from "./getBannedUser.superadmin.controller";
import handleUnbanUser from "./unbanUser.superadmin.controller";

export {
  handleCreateAdmin,

  // Ban User Operations
  handleBanUserAndEditRole,
  handleGetBannedUser,
  handleUnbanUser,
};

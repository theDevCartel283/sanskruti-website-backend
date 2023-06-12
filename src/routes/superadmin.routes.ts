import express from "express";
import * as superadminController from "../controllers/superadmin/index.superadmin.controller";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { Admin } from "../schema/admin.schema";
import { BanEmail } from "../schema/superadmin";
import { BanAndRoleDetails } from "../schema/user.schema";

const router = express.Router();

router.post(
  "/newAdmin",
  validateResources(blankSchema, Admin, blankSchema),
  superadminController.handleCreateAdmin
);

router.put(
  "/banAndEditUser",
  validateResources(blankSchema, BanAndRoleDetails, blankSchema),
  superadminController.handleBanUserAndEditRole
);

router.post(
  "/unbanUser",
  validateResources(blankSchema, BanEmail, blankSchema),
  superadminController.handleUnbanUser
);

router.get("/getBannnedUser", superadminController.handleGetBannedUser);

export default router;

import express from "express";
import * as superadminController from "../controllers/superadmin/index.superadmin.controller";
import * as configController from "../controllers/config/index.config.controller";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { Admin } from "../schema/admin.schema";
import { BanEmail } from "../schema/superadmin";
import { BanAndRoleDetails } from "../schema/user.schema";
import { setSocial, social, socialId } from "../schema/config.schema";

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

// Config
router
  .route("/social")
  .get(configController.handleGetSocialConfig)
  .post(
    validateResources(blankSchema, social, blankSchema),
    configController.handleSetSocialConfig
  )
  .put(
    validateResources(blankSchema, setSocial, blankSchema),
    configController.handleUpdateSocialConfig
  )
  .delete(
    validateResources(blankSchema, blankSchema, socialId),
    configController.handleDeleteSocialConfig
  );

export default router;

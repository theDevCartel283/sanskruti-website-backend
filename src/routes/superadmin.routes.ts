import express from "express";
import * as superadminController from "../controllers/superadmin/index.superadmin.controller";
import * as configController from "../controllers/config/index.config.controller";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { Admin } from "../schema/admin.schema";
import { BanEmail } from "../schema/superadmin";
import { BanAndRoleDetails } from "../schema/user.schema";
import { payment, setSocial, social, socialId } from "../schema/config.schema";

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
  .route("/config/social")
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

// PayZApp
router
  .route("/config/payZaap")
  .get(configController.handleGetPayZApp)
  .post(
    validateResources(blankSchema, payment, blankSchema),
    configController.handleSetPayZApp
  )
  .delete(configController.handleDeletePayZApp);

// Payment Status
router.get(
  "/config/paymentStatus/payZapp/start",
  configController.handleStartPayZapp
);
router.get(
  "/config/paymentStatus/payZapp/stop",
  configController.handleStopPayZapp
);
router.get(
  "/config/paymentStatus/cashondelivery/start",
  configController.handleStartCashOnDelivery
);
router.get(
  "/config/paymentStatus/cashondelivery/stop",
  configController.handleStopCashOnDelivery
);

export default router;

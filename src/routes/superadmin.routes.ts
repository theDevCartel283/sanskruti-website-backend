import express from "express";
import * as superadminController from "../controllers/superadmin/index.superadmin.controller";
import * as configController from "../controllers/config/index.config.controller";
import validateResources from "../middleware/validateResources";
import { blankSchema } from "../schema/blank.schema";
import { Admin } from "../schema/admin.schema";
import { BanEmail } from "../schema/superadmin";
import { BanAndRoleDetails } from "../schema/user.schema";
import {
  authSchema,
  payment,
  setSocial,
  social,
  socialId,
} from "../schema/config.schema";
import { z } from "zod";

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
  .route("/config/payZapp")
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

// google analytics
router
  .route("/config/analytics/google")
  .get(configController.handleGetGoogleAnalytics)
  .post(
    validateResources(blankSchema, z.object({ code: z.string() }), blankSchema),
    configController.handleSetGoogleAnalytics
  )
  .delete(configController.handleDeleteGoogleAnalytics);

// auth
router.get("/config/auth", configController.handleGetAuthStatus);

router.get("/config/auth/google/start", configController.handleStartGoogleAuth);
router.get("/config/auth/google/stop", configController.handleStopGoogleAuth);
router
  .route("/config/auth/google")
  .get(configController.handleGetGoogleAuth)
  .post(
    validateResources(blankSchema, authSchema, blankSchema),
    configController.handleSetGoogleAuth
  )
  .delete(configController.handleClearGoogleAuth);

router.get(
  "/config/auth/facebook/start",
  configController.handleStartFacebookAuth
);
router.get(
  "/config/auth/facebook/stop",
  configController.handleStopFacebookAuth
);
router
  .route("/config/auth/facebook")
  .get(configController.handleGetFacebookAuth)
  .post(
    validateResources(blankSchema, authSchema, blankSchema),
    configController.handleSetFacebookAuth
  )
  .delete(configController.handleClearFacebookAuth);

router
  .route("/config/whatsappNumber")
  .get(configController.handleGetWhatsappNumber)
  .post(
    validateResources(
      blankSchema,
      z.object({ number: z.number() }),
      blankSchema
    ),
    configController.handleSetWhatsappNumber
  )
  .delete(configController.handleDeleteWhatsappNumber);

export default router;

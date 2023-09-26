import {
  handleGetSocialConfig,
  handleSetSocialConfig,
  handleUpdateSocialConfig,
  handleDeleteSocialConfig,
  GetAllSocialConfig,
} from "./social.config.controller";

import {
  handleGetPayZApp,
  handleSetPayZApp,
  handleDeletePayZApp,
} from "./payzapp.config.controller";

import {
  getPaymentStatus,
  handleStartCashOnDelivery,
  handleStartPayZapp,
  handleStopCashOnDelivery,
  handleStopPayZapp,
} from "./paymentType.config.controller";

import {
  handleSetGoogleAnalytics,
  handleGetGoogleAnalytics,
  handleDeleteGoogleAnalytics,
} from "./analytics.config.controller";

import {
  handleGetAuthStatus,
  handleGetGoogleAuth,
  handleSetGoogleAuth,
  handleClearGoogleAuth,
  handleStartGoogleAuth,
  handleStopGoogleAuth,
  handleGetFacebookAuth,
  handleSetFacebookAuth,
  handleClearFacebookAuth,
  handleStartFacebookAuth,
  handleStopFacebookAuth,
} from "./auth.config.controllers";

export {
  // Social
  handleGetSocialConfig,
  handleSetSocialConfig,
  handleUpdateSocialConfig,
  handleDeleteSocialConfig,
  GetAllSocialConfig,

  // PayZApp
  handleGetPayZApp,
  handleSetPayZApp,
  handleDeletePayZApp,

  // Payment Status
  getPaymentStatus,
  handleStartCashOnDelivery,
  handleStartPayZapp,
  handleStopCashOnDelivery,
  handleStopPayZapp,

  // Google analytics
  handleSetGoogleAnalytics,
  handleGetGoogleAnalytics,
  handleDeleteGoogleAnalytics,

  // Auth
  handleGetAuthStatus,
  // Google Auth
  handleGetGoogleAuth,
  handleSetGoogleAuth,
  handleClearGoogleAuth,
  handleStartGoogleAuth,
  handleStopGoogleAuth,
  // Facebook Auth
  handleGetFacebookAuth,
  handleSetFacebookAuth,
  handleClearFacebookAuth,
  handleStartFacebookAuth,
  handleStopFacebookAuth,
};

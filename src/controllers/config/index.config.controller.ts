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
};

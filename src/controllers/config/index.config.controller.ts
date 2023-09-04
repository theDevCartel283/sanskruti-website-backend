import {
  handleGetSocialConfig,
  handleSetSocialConfig,
  handleUpdateSocialConfig,
  handleDeleteSocialConfig,
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

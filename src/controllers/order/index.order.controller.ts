import handlePlaceOrder from "./create.order.controller";
import handleGetAllOrders from "./getAll.order.controller";
import handleGetOrder from "./get.order.controller";

import getOrder from "./getOrders.controller";
import GetOrderDetails from "./getOrderDetails.controller";
import handleCancellationRequest from "./requestCancel.order.contoller";
import handleUpdateOrderFromAdmin from "./update.order.controller";

export {
  handlePlaceOrder,
  handleGetAllOrders,
  handleGetOrder,
  getOrder,
  GetOrderDetails,
  handleCancellationRequest,
  handleUpdateOrderFromAdmin,
};

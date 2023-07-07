import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqAddressObject } from "../../schema/user.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import { v4 as uuidV4 } from "uuid";
import logger from "../../utils/logger.utils";

export const addAddress = async (
  req: Request<{}, {}, TokenPayload & ReqAddressObject>,
  res: Response
) => {
  const {
    userUniqueIdentity,
    provider,
    fullName,
    contactNo,
    pincode,
    nearBy,
    landmark,
    city,
    state,
  } = req.body;

  var user = await UserModel.findById(userUniqueIdentity);
  if (!user) {
    return res.status(401).json({
      message: "user not found",
      type: "error",
      isAuthenticated: false,
    }); // U
  }

  let isExist = false;
  user?.address.forEach((i: any) => {
    if (
      i.fullName === fullName &&
      i.contactNo === contactNo &&
      i.pincode === pincode &&
      i.nearBy === nearBy &&
      i.landmark === landmark &&
      i.city === city &&
      i.state === state
    ) {
      isExist = true;
    }
  });

  if (isExist) {
    return res.status(409).json({
      message: "address already exist",
      type: "warning",
    });
  }

  try {
    const newAddressObj = {
      id: uuidV4(),
      fullName,
      contactNo,
      pincode,
      nearBy,
      landmark,
      city,
      state,
    };
    user.address.push(newAddressObj);

    const updatedUser = await user.save({ validateBeforeSave: false });
    return res.status(201).json({
      type: "success",
      message: "new address added",
      address: updatedUser.address,
    });
  } catch (error) {
    logger.error("add address error " + error);
    res.status(500).json({
      type: "error",
      message: "something went wrong",
    });
  }
};

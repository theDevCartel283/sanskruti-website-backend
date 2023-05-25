import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { ReqAddressObject } from "../../schema/user.schema";
import { TokenPayload } from "../../utils/jwt.utils";

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

  var user: any = {};
  if (provider === "Email" || provider === "google") {
    user = await UserModel.findOne({ email: userUniqueIdentity });
  } else {
    user = await UserModel.findOne({ Mobile_No: userUniqueIdentity });
  }

  let isExist: boolean = false;
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
    res.status(409).json({
      message: "address already exist",
    });
  } else {
    try {
      const newAddressObj = {
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
      res.status(201).json({
        type: "success",
        updatedUser,
      });
    } catch (error) {
      res.status(502).json({
        error,
      });
    }
  }
};

import { Request, Response } from "express";
import UserModel from "../../model/user.model";
import { TokenPayload } from "../../utils/jwt.utils";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

export const handleDeleteAddress = async (
  req: Request<{}, {}, TokenPayload, { id: string }>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;
  const { id } = req.query;

  var user = await getUserFromEmailOrNumber(userUniqueIdentity);
  if (!user) {
    return res.status(401).json({
      message: "user not found",
      type: "error",
      isAuthenticated: false,
    }); // Unauthorized
  }

  const newAddressArray = user.address.filter((address) => address.id !== id);

  const updateAddress = await UserModel.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        address: newAddressArray,
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    type: "success",
    message: "Address deleted successfully",
    address: updateAddress?.address,
  });
};

import UserModel from "../../model/user.model";

export const getUserFromEmailOrNumber = async (
  emailOrNumber: string | number
) => {
  if (typeof emailOrNumber === "number") {
    return await UserModel.findOne({ Mobile_No: emailOrNumber });
  }

  if (typeof emailOrNumber === "string") {
    return await UserModel.findOne({ email: emailOrNumber });
  }
};

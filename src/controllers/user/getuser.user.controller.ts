import { TokenPayload } from "../../utils/jwt.utils";
import { Response } from "express";
import { VerifyRequest } from "../../middleware/verifyJwt";
import UserModel from "../../model/user.model";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";

// Protected Routes Controller
// Get User Details
export const handleGetUser = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const { provider, userUniqueIdentity } = req.body;

  // email doesn't exist in jwt token
  if (!userUniqueIdentity) return res.status(404).send("user not found");
  const user = await getUserFromEmailOrNumber(userUniqueIdentity);
  // username doesn't exist in db
  if (!user) {
    return res.status(401).json({
      message: "user not found",
      type: "error",
      isAuthenticated: false,
    }); // U
  }

  const userTrimmend = {
    username: user.username,
    email: user.email,
    address: user.address,
    Mobile_No: user.Mobile_No,
    dob: user.dob,
  };

  res.status(200).json(userTrimmend);
};

export default handleGetUser;

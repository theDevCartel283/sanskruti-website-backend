import { TokenPayload } from "../../utils/jwt.utils";
import { Response } from "express";
import { VerifyRequest } from "../../middleware/verifyJwt";
import { getUserFromEmailOrNumber } from "../../utils/user/getUserFromEmailOrNumber";
import getRole from "../../utils/getRole.util";

// Protected Routes Controller
// Get User Details
export const handleGetUser = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const { userUniqueIdentity, userRole } = req.body;

  // email doesn't exist in jwt token
  if (!userUniqueIdentity) return res.status(404).send("user not found");
  const user = await getUserFromEmailOrNumber(userUniqueIdentity);
  // username doesn't exist in db
  if (!user) {
    return res.status(401).json({
      message: "user not found",
      type: "error",
      isAuthenticated: false,
    }); // Unauthorized
  }

  const role = getRole(userRole);

  const userTrimmend = {
    username: user.username,
    email: user.email,
    email_verified: user.email_verified,
    address: user.address,
    Mobile_No: user.Mobile_No,
    Mobile_No_verified: user.Mobile_No_verified,
    dob: user.dob,
    provider: user.provider,
    role,
  };

  res.status(200).json(userTrimmend);
};

export default handleGetUser;

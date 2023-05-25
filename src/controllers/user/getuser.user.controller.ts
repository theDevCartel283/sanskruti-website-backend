import { TokenPayload } from "../../utils/jwt.utils";
import { Response } from "express";
import { VerifyRequest } from "../../middleware/verifyJwt";
import UserModel from "../../model/user.model";

// Protected Routes Controller
// Get User Details
export const handleGetUser = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const { provider, userUniqueIdentity } = req.body;
  console.log(req.body);

  // email doesn't exist in jwt token
  if (!userUniqueIdentity) return res.status(404).send("user not found");

  if (provider === "Email" || provider === "google") {
    const user = await UserModel.findOne({ email: userUniqueIdentity });
    // username doesn't exist in db
    if (!user) return res.status(404).send("user not found");

    const userTrimmend = {
      name: user.username,
      email: user.email,
      provider: user.provider,
    };

    res.status(200).send(userTrimmend);
  } else {
    const user = await UserModel.findOne({ Mobile_No: userUniqueIdentity });
    // username doesn't exist in db
    if (!user) return res.status(404).send("user not found");

    const userTrimmend = {
      name: user.username,
      Mobile_No: user.Mobile_No,
      provider: user.provider,
    };

    res.status(200).send(userTrimmend);
  }
};

export default handleGetUser;

import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { ReqBanEmail } from "../../schema/superadmin";
import UserModel from "../../model/user.model";
import { ReqBanAndRole } from "../../schema/user.schema";

// Ban User
const handleBanUserAndEditRole = async (
  req: Request<{}, {}, ReqBanAndRole>,
  res: Response
) => {
  try {
    // create new banned user
    const id = req.query.id;
    const user = await UserModel.findOne({
      _id: id,
    });

    if (user) {
      await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            role: req.body.role,
            is_Banned_User: req.body.is_Banned_User,
          },
        }
      );
      res.status(201).json({
        message: `user updated`,
        type: "success",
      });
    }
  } catch (err: any) {
    logger.error(`user banning error\n${err}`);
    res.status(502).json({ message: "something went wrong", type: "info" }); // Bad Gateway
  }
};

export default handleBanUserAndEditRole;

import { Request, Response } from 'express';
import logger from '../../utils/logger.utils';
import { ReqBanEmail } from '../../schema/superadmin';
import BannedEmailModel from '../../model/bannedEmail.model';

// UnBan User
const handleUnbanUser = async (
  req: Request<{}, {}, ReqBanEmail>,
  res: Response
) => {
  try {
    // unban user
    const unbannedUser = await BannedEmailModel.findByIdAndDelete({
      email: req.body.email,
    });

    logger.info(`user email:${req.body.email} was successfully unbanned`);
    res.status(201).json({
      message: `user email:${req.body.email} was successfully unbanned`,
      type: 'success',
    });
  } catch (err: any) {
    logger.error(`user unbanning error\n${err}`);
    res.status(502).json({ message: 'something went wrong', type: 'info' }); // Bad Gateway
  }
};

export default handleUnbanUser;

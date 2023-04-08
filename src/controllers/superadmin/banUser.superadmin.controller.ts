import { Request, Response } from 'express';
import logger from '../../utils/logger.utils';
import { ReqBanEmail } from '../../schema/superadmin';
import BannedEmailModel from '../../model/bannedEmail';

// Register
const handleBanUser = async (
  req: Request<{}, {}, ReqBanEmail>,
  res: Response
) => {
  try {
    // create new banned user
    const newBannedUser = new BannedEmailModel({
      email: req.body.email,
    });

    // save banned user
    const bannedUser = await newBannedUser.save();
    logger.info(`user email:${bannedUser.email} was successfully banned`);
    res.status(201).json({
      message: `user email:${bannedUser.email} was successfully banned`,
      type: 'success',
    });
  } catch (err: any) {
    logger.error(`user banning error\n${err}`);
    res.status(502).json({ message: 'something went wrong', type: 'info' }); // Bad Gateway
  }
};

export default handleBanUser;

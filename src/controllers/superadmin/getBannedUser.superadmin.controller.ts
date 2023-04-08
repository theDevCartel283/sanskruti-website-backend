import { Request, Response } from 'express';
import BannedEmailModel from '../../model/bannedEmail';
import logger from '../../utils/logger.utils';

// Register
const handleBanUser = async (req: Request, res: Response) => {
  try {
    // fetch banned users
    const bannedUserList = await BannedEmailModel.find();

    res.status(200).json(bannedUserList);
  } catch (err: any) {
    logger.error(`fetch user banning error\n${err}`);
    res.status(502).json({ message: 'something went wrong', type: 'info' }); // Bad Gateway
  }
};

export default handleBanUser;

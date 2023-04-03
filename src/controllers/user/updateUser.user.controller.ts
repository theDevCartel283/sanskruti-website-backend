import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqUserDetails } from '../../schema/user.schema';
import { TokenPayload } from '../../utils/jwt.utils';

// Update user
export const handleUpdateUser = async (
  req: Request<{}, {}, ReqUserDetails & TokenPayload>,
  res: Response
) => {
  const { email } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'something went wrong', type: 'info' }); // Unauthorized

  try {
    // update user in db
    await UserModel.findOneAndUpdate(
      { email: foundUser.email },
      {
        name: req.body.name,
        dob: req.body.dob,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
      }
    );

    res.status(200).json({
      message: `user ${foundUser.name} was successfully updated`,
      type: 'success',
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: 'something went wrong', type: 'info' });
  }
};

export default handleUpdateUser;

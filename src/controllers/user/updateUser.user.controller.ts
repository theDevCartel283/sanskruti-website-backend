import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqUserDetails } from '../../schema/user.schema';
import { TokenPayload } from '../../utils/jwt.utils';

// Update user
export const handleUpdateUser = async (
  req: Request<{}, {}, ReqUserDetails & TokenPayload>,
  res: Response
) => {
  const { username } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ username: username });
  if (!foundUser)
    return res.status(401).send({ message: 'username is incorrect' }); // Unauthorized

  try {
    // update user in db
    await UserModel.findOneAndUpdate(
      { username: foundUser.username },
      {
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
      }
    );

    res.status(200).send({
      message: `user ${foundUser.username} was successfully updated`,
    });
  } catch (err: any) {
    console.log(err);
    res.sendStatus(500);
  }
};

export default handleUpdateUser;

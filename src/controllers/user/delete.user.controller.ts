import { Request, Response } from 'express';
import UserModel from '../../model/user.model';
import { ReqEmailPwd } from '../../schema/user.schema';
import bcrypt from 'bcrypt';

// Delete
const handleDelete = async (
  req: Request<{}, {}, ReqEmailPwd>,
  res: Response
) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email: email });

  // check if user doesn't exists
  if (!foundUser) return res.sendStatus(200); // Ok, As we are going delete the user anyway

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    try {
      // delete user
      const user = await UserModel.findOneAndDelete({ email: foundUser.email });
      res.status(200).send({
        message: `user ${foundUser.name} was successfully deleted`,
      });
    } catch (err: any) {
      console.log(err);
      res.status(502).send(err); // Bad Gateway
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
};

export default handleDelete;

import { Response } from 'express';
import { VerifyRequest } from '../../middleware/verifyJwt';
import UserModel from '../../model/user.model';
import { TokenPayload } from '../../utils/jwt.utils';

// Logout User
const handleLogout = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const username = req.body.username;

  // username doesn't exist in jwt token
  if (!username) return res.send(200).send('logged out');

  const user = await UserModel.findOneAndUpdate(
    { username: username },
    { refreshToken: 'null' }
  );

  // username doesn't exist in db
  if (!user) return res.send(200).send('user not found');

  // clear cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).send(`user ${user.username} was successfully logged out`);
};

export default handleLogout;

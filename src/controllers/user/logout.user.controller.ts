import { Response } from 'express';
import { VerifyRequest } from '../../middleware/verifyJwt';
import UserModel from '../../model/user.model';
import { TokenPayload } from '../../utils/jwt.utils';

// Logout User
const handleLogout = async (
  req: VerifyRequest<null, TokenPayload, null>,
  res: Response
) => {
  const { email } = req.body;

  // username doesn't exist in jwt token
  if (!email)
    return res.send(200).json({ message: 'logged out', type: 'success' });

  const user = await UserModel.findOneAndUpdate(
    { email: email },
    { refreshToken: 'null' }
  );

  // username doesn't exist in db
  if (!user)
    return res.send(200).json({ message: 'logged out', type: 'success' });

  // clear cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: `user ${user.name} was successfully logged out`,
    type: 'success',
  });
};

export default handleLogout;

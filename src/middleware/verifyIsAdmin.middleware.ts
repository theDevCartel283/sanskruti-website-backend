import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt.utils';
import getRole from '../utils/getRole.util';

export const verifyIsAdmin = (
  req: Request<{}, {}, TokenPayload>,
  res: Response,
  next: NextFunction
) => {
  const role = getRole(req.body.userRole);

  if (role === 'USER' || role === undefined) {
    return res.sendStatus(403); // Forbidden
  }

  // user is admin or super admin
  next();
};

export const verifyIsSuperAdmin = (
  req: Request<{}, {}, TokenPayload>,
  res: Response,
  next: NextFunction
) => {
  const role = getRole(req.body.userRole);

  if (role === 'USER' || role === 'ADMIN' || role === undefined) {
    return res.sendStatus(403); // Forbidden
  }

  // user is super admin
  next();
};

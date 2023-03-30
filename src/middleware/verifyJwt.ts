import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type VerifyRequest<TParams, TBody, TQuery> = Request<
  TParams,
  {},
  TBody,
  TQuery
>;

const verifyAccessJwt = (req: Request, res: Response, next: NextFunction) => {
  const header = (req.headers['authorization'] ||
    req.headers['Authorization']) as string;
  if (!header?.startsWith('Bearer '))
    return res.status(401).send({ message: 'access token not found' }); // Unauthorized

  // get access token
  const token = header.split(' ')[1];

  // verify token
  const access_public = process.env.ACCESS_TOKEN_PUBLIC;
  if (!access_public) {
    console.log('access token public key undefined');
    return res.sendStatus(500);
  }
  jwt.verify(token, access_public, (err, decoded: any) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.body.username = decoded.username;
    req.body.userRole = decoded.userRole;
    next();
  });
};

export default verifyAccessJwt;

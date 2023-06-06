import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";

export type VerifyRequest<TParams, TBody, TQuery> = Request<
  TParams,
  {},
  TBody,
  TQuery
>;

const verifyAccessJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.cookies;
  if (!cookie?.accessToken)
    return res
      .status(401)
      .json({ message: "something went wrong", type: "info" });
  const accessToken: string = cookie.accessToken;

  const { valid, decoded, expired } = verifyJwt(
    accessToken,
    "ACCESS_TOKEN_PUBLIC"
  );

  if (valid && decoded && !expired) {
    //   const isBanned = await checkBanned(decoded.userUniqueIdentity);
    //   if (isBanned)
    //     return res.status(401).send({ message: 'Unauthorized', type: 'warning' });

    req.body.userUniqueIdentity = decoded.userUniqueIdentity;
    req.body.userRole = decoded.userRole;
    return next();
  }

  return res.status(401).send({ message: "Unauthorized", type: "warning" });
};

export default verifyAccessJwt;

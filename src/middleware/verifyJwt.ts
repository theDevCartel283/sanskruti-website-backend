import { Request, Response, NextFunction } from "express";
import { tokenRefreshForEmail, verifyJwt } from "../utils/jwt.utils";

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
  // get access Token

  const header = (req.headers["authorization"] ||
    req.headers["Authorization"]) as string;
  if (!header?.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "access token not found", type: "warning" }); // Unauthorized

  const accessToken = header.split(" ")[1];

  // get refresh Token
  const cookie = req.cookies;
  if (!cookie?.jwt)
    return res
      .status(401)
      .json({ message: "request cookie empty", type: "warning" });
  const refreshToken: string = cookie.jwt;

  // Case 1: accessToken doesn't exist refresh token exists
  if (!accessToken && refreshToken) {
    const { valid, newAccessToken, email, Mobile_NO, provider, role } =
      await tokenRefreshForEmail(refreshToken);

    if (!valid || !newAccessToken || !email || !Mobile_NO || !provider || !role)
      return res.status(401).send({ message: "Unauthorized", type: "warning" });

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    if (provider === "Email") {
      req.body.userUniqueIdentity = email;
    } else {
      req.body.userUniqueIdentity = Mobile_NO;
    }
    req.body.provider = provider;
    req.body.userRole = role;
    return next();
  }

  const { valid, decoded, expired } = verifyJwt(
    accessToken,
    "ACCESS_TOKEN_PUBLIC"
  );

  // Case 2: Valid accessToken JWT
  if (valid && decoded && !expired) {
    req.body.userUniqueIdentity = decoded.userUniqueIdentity;
    req.body.provider = decoded.provider;
    req.body.userRole = decoded.userRole;
    return next();
  }

  // Case 3: accessToken valid but expired
  if (expired && refreshToken) {
    const { valid, newAccessToken, email, Mobile_NO, provider, role } =
      await tokenRefreshForEmail(refreshToken);

    if (!valid || !newAccessToken || !email || !Mobile_NO || !provider || !role)
      return res.status(401).send({ message: "Unauthorized", type: "warning" });

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    if (provider === "Email") {
      req.body.userUniqueIdentity = email;
    } else {
      req.body.userUniqueIdentity = Mobile_NO;
    }
    req.body.provider = provider;
    req.body.userRole = role;
    return next();
  }

  // All test fail
  return res.status(401).send({ message: "Unauthorized", type: "warning" });
};

export default verifyAccessJwt;

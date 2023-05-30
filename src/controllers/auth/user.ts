import { Request, Response, NextFunction } from "express";
export const myProfile = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.status(200).json({
      type: "success",
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.status(200).json({
      success: false,
      isAuthenticated: false,
      user: req.user,
    });
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      res.clearCookie("connect.sid");
      res.clearCookie("jwt");
      res.status(200).json({
        message: "logged out Google oauth 2.0 successfully",
      });
    }
  });
};

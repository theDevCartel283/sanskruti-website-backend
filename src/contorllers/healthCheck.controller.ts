import { Request, Response } from 'express';

export const HealthCheck = (req: Request, res: Response) => {
  res.sendStatus(200);
};

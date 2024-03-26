import { NextFunction, Request, Response } from "express";
import { logger } from "firebase-functions/v1";

// @ts-ignore
export const checkAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const message = "Unauthorized";

  if (!token || !token.startsWith("Bearer ") || !validateToken(token)) {
    logger.error(message);

    return res.status(401).json({ message });
  }

  next();
};

const validateToken = (token: string) => {
  const accessToken = token.split(" ")[1];
  try {
    // TODO: Verify the JWT token
    return true;
  } catch (error) {
    return false;
  }
};

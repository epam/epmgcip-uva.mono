import {type NextFunction, type Request, type Response} from "express";
import {logger} from "firebase-functions/v1";

export const checkAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const message = "Unauthorized";

  if (!token || !token.startsWith("Bearer ") || !validateToken(token)) {
    logger.error(message);

    return res.status(401).json({message});
  }

  next();
};

const validateToken = (token: string) => {
  const accessToken = token.split(" ")[1];
  try {
    // TODO: Verify the JWT token
    return accessToken && true;
  } catch (error) {
    return false;
  }
};

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { handleZodError } from '../utils/errorUtils';
import { HttpCustomError } from '../utils/errorUtils';


export const errorMiddleware = (
  error: HttpCustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const errorMsg = handleZodError(error);

    res.status(400).json({ error: errorMsg })
  } else {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    res.status(status).json({ error: message });
  }
};



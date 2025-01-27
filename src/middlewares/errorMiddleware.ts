import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { handleZodError } from '../utils/errorUtils';


export class HttpCustomError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


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
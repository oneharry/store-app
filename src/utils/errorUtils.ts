import { ZodError } from 'zod';

export class HttpCustomError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


// Extracts and returns the first validation error for request inputs
export const handleZodError = (err: ZodError): string => {
  const firstError = err.errors[0];
  return firstError?.message;
};
import { ZodError } from 'zod';

export const handleZodError = (err: ZodError): string => {
  const firstError = err.errors[0];
  return firstError.message;
};
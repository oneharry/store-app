import { z } from 'zod';

export const RegisterUserSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100, 'Username should not exceed 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['admin', 'user', 'manager'], { errorMap: () => ({ message: 'Invalid role' }) }),
    avatar: z.string().optional()
})

export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const CreateProductSchema = z.object({
    name: z.string().min(1, 'Name is required').trim(),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be a positive number'),
    quantity: z.number().int().min(1, 'Quantity must be a positive integer'),
});

export const UpdateProductSchema = z.object({
    name: z.string().min(1, 'Name is required').trim().optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().min(0, 'Price must be a positive number').optional(),
    quantity: z.number().int().min(1, 'Quantity must be a positive integer').optional()
});
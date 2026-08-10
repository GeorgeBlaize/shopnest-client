import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').optional().or(z.literal('')),
  avatarUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const addressSchema = z.object({
  label: z.string().trim().min(2, 'Label is required'),
  line1: z.string().trim().min(5, 'Address is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  postalCode: z.string().trim().min(2, 'Postal code is required'),
  country: z.string().trim().min(2, 'Country is required'),
  phone: z.string().trim().min(6, 'Enter a valid phone number'),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Select a rating').max(5),
  comment: z.string().trim().min(5, 'Comment must be at least 5 characters').max(500),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

const numericString = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((val) => !Number.isNaN(Number(val)), { message: 'Must be a number' });

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  shortDesc: z.string().trim().min(10, 'Short description must be at least 10 characters').max(200),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  price: numericString('Price is required').refine((val) => Number(val) > 0, { message: 'Price must be greater than 0' }),
  compareAtPrice: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (!Number.isNaN(Number(val)) && Number(val) > 0), { message: 'Must be a positive number' }),
  stock: numericString('Stock is required').refine((val) => Number.isInteger(Number(val)) && Number(val) >= 0, {
    message: 'Stock must be a whole number, 0 or more',
  }),
  categoryId: z.string().min(1, 'Select a category'),
  images: z.string().trim().min(1, 'Provide at least one image URL'),
  isFeatured: z.boolean().optional(),
  specs: z.string().trim().optional(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  imageUrl: z.string().trim().url('Enter a valid image URL'),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const blogSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(200),
  content: z.string().trim().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().trim().url('Enter a valid image URL'),
  authorName: z.string().trim().min(2, 'Author name is required'),
  published: z.boolean().optional(),
});
export type BlogInput = z.infer<typeof blogSchema>;

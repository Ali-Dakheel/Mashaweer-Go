import { z } from 'zod'

// Lenient datetime parser - accepts any string and tries to parse it
const lenientDatetime = z.string().transform((val) => {
  try {
    new Date(val)
    return val
  } catch {
    return null
  }
}).nullable()

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().min(0),
  cpr: z.string(),
  phone_number: z.string(),
  password: z.string(),
  Role: z.string(),
})

export type User = z.infer<typeof userSchema>

export const agencySchema = z.object({
  id: z.string().uuid(),
  agency_name: z.string(),
  cr_number: z.string().nullable(),
  location: z.string().nullable(),
  contact: z.string().nullable(),
  status: z.enum(['pending', 'active', 'inactive']).nullable().catch(null),
  rating_avg: z.number().nullable(),
  logo_url: z.string().nullable(),
  created_at: lenientDatetime,
  user_id: z.number().nullable(),
})

export type Agency = z.infer<typeof agencySchema>

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  agency_id: z.string().uuid().nullable(),
  type: z.string().nullable(),
  agency_name: z.string().nullable(),
  brand: z.string().nullable(),
  vehicle_name: z.string().nullable(),
  year: z.number().nullable(),
  plate_no: z.string().nullable(),
  image_url: z.string().nullable(),
  description: z.string().nullable(),
  price_per_day: z.number().nullable(),
  available: z.boolean().nullable(),
  created_at: lenientDatetime,
  discount_percent: z.number().nullable(),
  offer_active: z.boolean().catch(false),
  final_price: z.number().nullable(),
  insurance: z.number().catch(0),
  category: z.enum(['car', 'bus', 'marin', 'scooter', 'motorcycle', 'bikes']).catch('car'),
  rating_avg: z.number().catch(0),
  rating_count: z.number().catch(0),
})

export type Vehicle = z.infer<typeof vehicleSchema>

export const ratingSchema = z.object({
  id: z.number(),
  vehicle_id: z.string().uuid().nullable(),
  ratings: z.number().nullable(),
  comments: z.string().nullable(),
  created_at: lenientDatetime,
  updated_at: lenientDatetime,
  user_id: z.number().nullable(),
  user_name: z.string().nullable().optional(),
  vehicle_name: z.string().nullable().optional(),
})

export type Rating = z.infer<typeof ratingSchema>

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

// Form validation schemas
export const createUserFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  cpr: z.string().min(1, 'CPR is required').min(5, 'CPR must be at least 5 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required').min(7, 'Phone number must be at least 7 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user', 'agency']),
})

export type CreateUserFormData = z.infer<typeof createUserFormSchema>

export const editUserFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required').min(7, 'Phone number must be at least 7 digits'),
  cpr: z.string().min(1, 'CPR is required').min(5, 'CPR must be at least 5 characters'),
  role: z.enum(['admin', 'user', 'agency']),
})

export type EditUserFormData = z.infer<typeof editUserFormSchema>

export const createAgencyFormSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required').min(2, 'Name must be at least 2 characters'),
  crNumber: z.string().min(1, 'CR number is required'),
  location: z.string().min(1, 'Location is required'),
  contact: z.string().min(1, 'Contact info is required'),
})

export type CreateAgencyFormData = z.infer<typeof createAgencyFormSchema>

export const editAgencyFormSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required').min(2, 'Name must be at least 2 characters'),
  location: z.string().min(1, 'Location is required'),
  contact: z.string().min(1, 'Contact info is required'),
  status: z.enum(['pending', 'active', 'inactive']),
})

export type EditAgencyFormData = z.infer<typeof editAgencyFormSchema>

export const createVehicleFormSchema = z.object({
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['car', 'bus', 'motorcycle', 'scooter', 'bikes', 'marin']),
  pricePerDay: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Price must be a positive number'),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  discountPercent: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, 'Discount must be between 0-100').optional(),
  insurance: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Insurance must be a positive number').optional(),
})

export type CreateVehicleFormData = z.infer<typeof createVehicleFormSchema>

export const editVehicleFormSchema = z.object({
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['car', 'bus', 'motorcycle', 'scooter', 'bikes', 'marin']),
  description: z.string().optional(),
  pricePerDay: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Price must be a positive number'),
  discountPercent: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, 'Discount must be between 0-100'),
  insurance: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Insurance must be a positive number'),
  available: z.boolean(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export type EditVehicleFormData = z.infer<typeof editVehicleFormSchema>

export const createRatingFormSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required').uuid('Invalid vehicle ID'),
  userId: z.string().min(1, 'User ID is required').refine((val) => !isNaN(parseInt(val)), 'User ID must be a number'),
  rating: z.string().refine((val) => ['1', '2', '3', '4', '5'].includes(val), 'Rating must be between 1-5'),
  comments: z.string().optional(),
})

export type CreateRatingFormData = z.infer<typeof createRatingFormSchema>

// Authentication Schemas
export const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

export const userLoginResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  Role: z.string(),
})

export type UserLoginResponse = z.infer<typeof userLoginResponseSchema>
'use server'

import { revalidatePath, redirect } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase-server'
import { userSchema, agencySchema, vehicleSchema, ratingSchema, loginFormSchema } from '@/lib/schemas'
import { createSessionCookie, deleteSessionCookie } from '@/lib/auth'

// ============================================================================
// AUTHENTICATION
// ============================================================================

export async function loginUser(email: string, password: string) {
  try {
    // Validate input
    const validationResult = loginFormSchema.safeParse({ email, password })
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message || 'Invalid input',
      }
    }

    // Fetch user from database
    const { data: users, error: fetchError } = await supabase
      .from('Users')
      .select('id, name, email, password, "Role"')
      .eq('email', email)
      .single()

    if (fetchError || !users) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Check if user is admin
    if (users.Role !== 'Admin') {
      console.log(users.Role)
      return {
        success: false,
        error: 'Only admin users can access this application',
      }
    }

    // Verify password using bcryptjs (password is hashed by database trigger)
    const passwordMatch = await bcrypt.compare(password, users.password)
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Create session cookie with user data
    await createSessionCookie({
      id: users.id,
      name: users.name,
      email: users.email,
      Role: users.Role,
    })

    return {
      success: true,
      message: 'Login successful',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An error occurred during login',
    }
  }
}

export async function logoutUser() {
  try {
    // Delete session cookie
    await deleteSessionCookie()

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: 'An error occurred during logout',
    }
  }
}

// ============================================================================
// METRICS QUERY
// ============================================================================

export async function fetchMetrics() {
  try {
    const [usersRes, agenciesRes, vehiclesRes, pendingRes] = await Promise.all([
      supabase.from('Users').select('id', { count: 'exact', head: true }),
      supabase.from('agencies').select('id', { count: 'exact', head: true }),
      supabase.from('vehicles').select('id', { count: 'exact', head: true }),
      supabase.from('agencies').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    return {
      totalUsers: usersRes.count ?? 0,
      totalAgencies: agenciesRes.count ?? 0,
      totalVehicles: vehiclesRes.count ?? 0,
      pendingAgencies: pendingRes.count ?? 0,
    }
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    throw new Error('Failed to fetch metrics')
  }
}

export async function fetchUsersForDropdown() {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('id, name')
      .order('name')

    if (error) throw new Error(error.message)
    return { success: true, data: data ?? [] }
  } catch (error) {
    return { success: false, error: String(error), data: [] }
  }
}

export async function fetchVehiclesForDropdown() {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, vehicle_name')
      .order('vehicle_name')

    if (error) throw new Error(error.message)
    return { success: true, data: data ?? [] }
  } catch (error) {
    return { success: false, error: String(error), data: [] }
  }
}

// ============================================================================
// USER MUTATIONS
// ============================================================================

export async function updateUserRole(
  userId: number,
  newRole: string
) {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ Role: newRole })
      .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/users')
    revalidatePath('/')
    return { success: true, message: 'User role updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateUserContact(
  userId: number,
  email: string,
  phoneNumber: string
) {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ email, phone_number: phoneNumber })
      .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/users')
    revalidatePath('/')
    return { success: true, message: 'User contact updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteUser(userId: number) {
  try {
    const { error } = await supabase
      .from('Users')
      .delete()
      .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/users')
    revalidatePath('/')
    return { success: true, message: 'User deleted successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// AGENCY MUTATIONS
// ============================================================================

export async function updateAgencyStatus(
  agencyId: string,
  status: 'pending' | 'active' | 'inactive'
) {
  try {
    const { error } = await supabase
      .from('agencies')
      .update({ status })
      .eq('id', agencyId)

    if (error) throw new Error(error.message)
    revalidatePath('/agencies')
    revalidatePath('/')
    return { success: true, message: `Agency status updated to ${status}` }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateAgencyContact(
  agencyId: string,
  agencyName: string,
  location: string,
  contact: string
) {
  try {
    const { error } = await supabase
      .from('agencies')
      .update({ agency_name: agencyName, location, contact })
      .eq('id', agencyId)

    if (error) throw new Error(error.message)
    revalidatePath('/agencies')
    revalidatePath('/')
    return { success: true, message: 'Agency contact information updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteAgency(agencyId: string) {
  try {
    const { error } = await supabase
      .from('agencies')
      .delete()
      .eq('id', agencyId)

    if (error) throw new Error(error.message)
    revalidatePath('/agencies')
    revalidatePath('/')
    return { success: true, message: 'Agency deleted successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// VEHICLE MUTATIONS
// ============================================================================

export async function updateVehicleAvailability(
  vehicleId: string,
  available: boolean
) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .update({ available })
      .eq('id', vehicleId)

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: `Vehicle availability updated to ${available ? 'Available' : 'Unavailable'}` }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateVehiclePrice(
  vehicleId: string,
  pricePerDay: number,
  discountPercent: number = 0,
  insurance: number = 0
) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .update({
        price_per_day: pricePerDay,
        discount_percent: discountPercent,
        insurance
      })
      .eq('id', vehicleId)

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: 'Vehicle pricing updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateVehicleDetails(
  vehicleId: string,
  vehicleName: string,
  brand: string,
  category: string,
  description: string
) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .update({
        vehicle_name: vehicleName,
        brand,
        category,
        description
      })
      .eq('id', vehicleId)

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: 'Vehicle details updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateVehicleImage(
  vehicleId: string,
  imageUrl: string
) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .update({ image_url: imageUrl })
      .eq('id', vehicleId)

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: 'Vehicle image updated successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteVehicle(vehicleId: string) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId)

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: 'Vehicle deleted successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// RATING MUTATIONS
// ============================================================================

export async function deleteRating(ratingId: number) {
  try {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('id', ratingId)

    if (error) throw new Error(error.message)
    revalidatePath('/ratings')
    revalidatePath('/')
    return { success: true, message: 'Rating deleted successfully' }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// PAGINATION HELPER FUNCTIONS
// ============================================================================

export async function fetchUsersPage(page: number = 1, pageSize: number = 25) {
  try {
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from('Users')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)

    return {
      data: data?.map(user => userSchema.parse(user)) ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize)
    }
  } catch (error) {
    throw new Error(`Failed to fetch users: ${String(error)}`)
  }
}

export async function fetchAgenciesPage(page: number = 1, pageSize: number = 25) {
  try {
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from('agencies')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)

    return {
      data: data?.map(agency => agencySchema.parse(agency)) ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize)
    }
  } catch (error) {
    throw new Error(`Failed to fetch agencies: ${String(error)}`)
  }
}

export async function fetchVehiclesPage(page: number = 1, pageSize: number = 25) {
  try {
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)

    return {
      data: data?.map(vehicle => vehicleSchema.parse(vehicle)) ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize)
    }
  } catch (error) {
    throw new Error(`Failed to fetch vehicles: ${String(error)}`)
  }
}

export async function fetchRatingsPage(page: number = 1, pageSize: number = 25) {
  try {
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from('ratings')
      .select(`
        *,
        Users!ratings_user_id_fkey(name),
        vehicles!ratings_vehicle_id_fkey(vehicle_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)

    // Transform the data to flatten the user name and vehicle name
    const transformedData = data?.map(rating => ({
      ...rating,
      user_name: rating.Users?.name || null,
      vehicle_name: rating.vehicles?.vehicle_name || null,
      Users: undefined, // Remove the nested object
      vehicles: undefined, // Remove the nested object
    })) ?? []

    return {
      data: transformedData.map(rating => ratingSchema.parse(rating)),
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize)
    }
  } catch (error) {
    throw new Error(`Failed to fetch ratings: ${String(error)}`)
  }
}

// ============================================================================
// CREATE ACTIONS
// ============================================================================

export async function createUser(
  name: string,
  email: string,
  cpr: string,
  phoneNumber: string,
  password: string,
  role: string
) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([
        {
          name,
          email,
          cpr,
          phone_number: phoneNumber,
          password,
          Role: role,
        }
      ])
      .select()

    if (error) throw new Error(error.message)
    revalidatePath('/users')
    revalidatePath('/')
    return { success: true, message: 'User created successfully', data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createAgency(
  agencyName: string,
  crNumber: string,
  location: string,
  contact: string,
  status: 'pending' | 'active' | 'inactive' = 'pending'
) {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .insert([
        {
          agency_name: agencyName,
          cr_number: crNumber,
          location,
          contact,
          status,
          rating_avg: 0,
        }
      ])
      .select()

    if (error) throw new Error(error.message)
    revalidatePath('/agencies')
    revalidatePath('/')
    return { success: true, message: 'Agency created successfully', data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createVehicle(
  vehicleName: string,
  brand: string,
  category: string,
  pricePerDay: number,
  agencyId?: string,
  description?: string,
  imageUrl?: string,
  discountPercent?: number,
  insurance?: number
) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          vehicle_name: vehicleName,
          brand,
          category,
          price_per_day: pricePerDay,
          agency_id: agencyId || null,
          description: description || '',
          image_url: imageUrl || null,
          available: true,
          rating_avg: 0,
          rating_count: 0,
          discount_percent: discountPercent || 0,
          insurance: insurance || 50,
          offer_active: false,
        }
      ])
      .select()

    if (error) throw new Error(error.message)
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, message: 'Vehicle created successfully', data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createRating(
  vehicleId: string,
  rating: number,
  comments: string,
  userId: number
) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([
        {
          vehicle_id: vehicleId,
          ratings: rating,
          comments,
          user_id: userId,
        }
      ])
      .select()

    if (error) throw new Error(error.message)
    revalidatePath('/ratings')
    revalidatePath('/')
    return { success: true, message: 'Rating created successfully', data }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

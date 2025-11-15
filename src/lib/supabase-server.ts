import { createClient } from '@supabase/supabase-js'
import { userSchema, agencySchema, vehicleSchema, ratingSchema } from './schemas'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Query functions with Zod validation
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw new Error(error.message)
  return data.map(user => userSchema.parse(user))
}

export async function fetchAgencies() {
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data.map(agency => agencySchema.parse(agency))
}

export async function fetchVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data.map(vehicle => vehicleSchema.parse(vehicle))
}

export async function fetchRatings() {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data.map(rating => ratingSchema.parse(rating))
}

export async function fetchMetrics() {
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
}

// Mutation functions
export async function removeUser(userId: number) {
  const { error } = await supabase.from('Users').delete().eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function removeAgency(agencyId: string) {
  const { error } = await supabase.from('agencies').delete().eq('id', agencyId)
  if (error) throw new Error(error.message)
}

export async function removeVehicle(vehicleId: string) {
  const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)
  if (error) throw new Error(error.message)
}

export async function removeRating(ratingId: number) {
  const { error } = await supabase.from('ratings').delete().eq('id', ratingId)
  if (error) throw new Error(error.message)
}

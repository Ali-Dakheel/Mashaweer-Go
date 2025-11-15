export interface User {
    id: bigint
    name: string
    email: string
    cpr: string
    phone_number: string
    password: string
    Role: string
  }
  
  export interface Agency {
    id: string
    agency_name: string
    cr_number: string | null
    location: string | null
    contact: string | null
    status: 'pending' | 'active' | 'inactive' | null
    rating_avg: number | null
    logo_url: string | null
    created_at: string | null
    user_id: bigint | null
  }
  
  export interface Vehicle {
    id: string
    agency_id: string | null
    type: string | null
    agency_name: string | null
    brand: string | null
    vehicle_name: string | null
    year: number | null
    plate_no: string | null
    image_url: string | null
    description: string | null
    price_per_day: number | null
    available: boolean | null
    created_at: string | null
    discount_percent: number | null
    offer_active: boolean
    final_price: number | null
    insurance: number
    category: 'car' | 'bus' | 'marin' | 'scooter' | 'motorcycle' | 'bikes'
    rating_avg: number
    rating_count: number
  }
  
  export interface Rating {
    id: bigint
    vehicle_id: string | null
    ratings: number | null
    comments: string | null
    created_at: string
    updated_at: string | null
    user_id: bigint | null
  }
  
  export interface DashboardMetrics {
    totalUsers: number
    totalAgencies: number
    totalVehicles: number
    pendingAgencies: number
  }
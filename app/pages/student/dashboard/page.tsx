// app/student/dashboard/page.tsx
'use client'
import { BuildingLibraryIcon, MapPinIcon, UsersIcon, ClockIcon, CurrencyDollarIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../utils/supabase'

interface Hostel {
  id: string
  name: string
  address: string
  images: string[]
  gender: string
  hasMess: boolean
  distanceFromCollege: number
  curfewTime: string
  rentPerMonth: number
  roomCapacity: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    gender: '',
    hasMess: '',
    maxDistance: '',
    maxRent: '',
    minCapacity: ''
  })

  useEffect(() => {
    fetchHostels()
  }, [filters])

  const fetchHostels = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('hostels')
        .select('*')
        .eq('approved', true)

      if (filters.gender) query = query.eq('gender', filters.gender)
      if (filters.hasMess) query = query.eq('hasMess', filters.hasMess === 'true')
      if (filters.maxDistance) query = query.lte('distanceFromCollege', parseInt(filters.maxDistance))
      if (filters.maxRent) query = query.lte('rentPerMonth', parseFloat(filters.maxRent))
      if (filters.minCapacity) query = query.gte('roomCapacity', parseInt(filters.minCapacity))

      const { data, error } = await query

      if (error) throw error
      setHostels(data as Hostel[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hostels')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/pages/student/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-blue-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <select
              value={filters.gender}
              onChange={(e) => setFilters({...filters, gender: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="neutral">Gender Neutral</option>
            </select>

            <select
              value={filters.hasMess}
              onChange={(e) => setFilters({...filters, hasMess: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="">Mess Availability</option>
              <option value="true">Has Mess</option>
              <option value="false">No Mess</option>
            </select>

            <input
              type="number"
              placeholder="Max Distance (minutes)"
              value={filters.maxDistance}
              onChange={(e) => setFilters({...filters, maxDistance: e.target.value})}
              className="p-2 border rounded-md"
            />

            <input
              type="number"
              placeholder="Max Rent (₹)"
              value={filters.maxRent}
              onChange={(e) => setFilters({...filters, maxRent: e.target.value})}
              className="p-2 border rounded-md"
            />

            <input
              type="number"
              placeholder="Min Capacity"
              value={filters.minCapacity}
              onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
              className="p-2 border rounded-md"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading hostels...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-12">{error}</div>
        ) : hostels.length === 0 ? (
          <div className="text-center py-12">No hostels found matching your criteria</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <div key={hostel.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {hostel.images.length > 0 && (
                  <img
                    src={hostel.images[0]}
                    alt={hostel.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      <span>{hostel.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-blue-600" />
                      <span>{hostel.gender} • {hostel.roomCapacity} beds/room</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                      <span>Curfew: {hostel.curfewTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                      <span>₹{hostel.rentPerMonth}/month</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/student/hostel/${hostel.id}`)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
// my-app/app/pages/lender/dashboard/page.tsx
'use client'
import { PlusIcon, BuildingOfficeIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../utils/supabase'

interface Hostel {
  id: string
  name: string
  approved: boolean
  rentPerMonth: number
  roomCapacity: number
  bookings: any[]
}

export default function LenderDashboard() {
  const router = useRouter()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('hostels')
        .select('*, bookings(*)')
        .eq('lenderId', user?.id)

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
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">Lender Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/lender/hostel/new')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Hostel
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-green-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{hostels.length}</p>
                <p className="text-sm text-gray-600">Total Hostels</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  ₹{hostels.reduce((sum, hostel) => sum + hostel.rentPerMonth, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Monthly Rent</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {hostels.reduce((sum, hostel) => sum + hostel.bookings.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading your hostels...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-12">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hostels.map((hostel) => (
                  <tr key={hostel.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{hostel.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${hostel.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {hostel.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{hostel.rentPerMonth}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hostel.bookings.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/lender/hostel/${hostel.id}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
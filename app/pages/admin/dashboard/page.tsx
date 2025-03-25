// my-app/app/pages/admin/dashboard/page.tsx
'use client'
import { BuildingOfficeIcon, UserIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../utils/supabase'

interface Hostel {
  id: string
  name: string
  address: string
  rentPerMonth: number
  lender: { firstName: string, lastName: string }
}

interface Lender {
  id: string
  firstName: string
  lastName: string
  email: string
  verified: boolean
}

export default function AdminDashboard() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [lenders, setLenders] = useState<Lender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const hostelsQuery = supabase
          .from('hostels')
          .select('id, name, address, rentPerMonth, lenders(firstName, lastName)')
          .eq('approved', false)

        const lendersQuery = supabase
          .from('lenders')
          .select('id, firstName, lastName, email, verified')
          .eq('verified', false)

        const [hostelsRes, lendersRes] = await Promise.all([hostelsQuery, lendersQuery])

        if (hostelsRes.error) throw hostelsRes.error
        if (lendersRes.error) throw lendersRes.error

        setHostels(hostelsRes.data.map((hostel: any) => ({
          ...hostel,
          lender: hostel.lenders[0]
        })))
        setLenders(lendersRes.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleApproval = async (type: 'hostel' | 'lender', id: string, approve: boolean) => {
    try {
      if (type === 'hostel') {
        await supabase
          .from('hostels')
          .update({ approved: approve })
          .eq('id', id)
        setHostels(prev => prev.filter(h => h.id !== id))
      } else {
        await supabase
          .from('lenders')
          .update({ verified: approve })
          .eq('id', id)
        setLenders(prev => prev.filter(l => l.id !== id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval action failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-600 mb-8">Admin Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hostel Approvals */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
              Pending Hostel Approvals ({hostels.length})
            </h2>
            
            {loading ? (
              <div className="text-gray-500">Loading hostels...</div>
            ) : hostels.length === 0 ? (
              <div className="text-gray-500">No pending hostel approvals</div>
            ) : (
              hostels.map(hostel => (
                <div key={hostel.id} className="border-b py-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{hostel.name}</h3>
                      <p className="text-sm text-gray-600">{hostel.address}</p>
                      <p className="text-sm">₹{hostel.rentPerMonth}/month</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Owner: {hostel.lender.firstName} {hostel.lender.lastName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval('hostel', hostel.id, true)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleApproval('hostel', hostel.id, false)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Lender Verifications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-purple-600" />
              Pending Lender Verifications ({lenders.length})
            </h2>
            
            {loading ? (
              <div className="text-gray-500">Loading lenders...</div>
            ) : lenders.length === 0 ? (
              <div className="text-gray-500">No pending lender verifications</div>
            ) : (
              lenders.map(lender => (
                <div key={lender.id} className="border-b py-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{lender.firstName} {lender.lastName}</h3>
                      <p className="text-sm text-gray-600">{lender.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval('lender', lender.id, true)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleApproval('lender', lender.id, false)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
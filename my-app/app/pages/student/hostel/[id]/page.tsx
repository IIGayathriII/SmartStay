//my-app\app\pages\student\hostel\[id]\page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../../utils/supabase'
import Image from 'next/image'

export default function HostelDetails({ params }: { params: { id: string } }) {
  const [hostel, setHostel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const { data, error } = await supabase
          .from('hostels')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setHostel(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchHostel()
  }, [params.id])

  const handleBooking = async () => {
    if (!paymentProof) {
      setError('Please upload payment proof')
      return
    }
    
    try {
      setIsBooking(true)
      setError('')

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload payment proof
      const fileExt = paymentProof.name.split('.').pop()
      const fileName = ${user.id}-${Date.now()}.${fileExt}
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof)

      if (uploadError) throw uploadError

      // Create booking record
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          studentId: user.id,
          hostelId: params.id,
          paymentProof: fileName,
          status: 'pending'
        }])

      if (bookingError) throw bookingError

      router.push('/student/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading hostel details...</div>
  if (error) return <div className="text-red-600 text-center py-12">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {hostel.images.map((img: string, index: number) => (
              <div key={index} className="relative h-64">
                <Image
                  src={img}
                  alt={Hostel image ${index + 1}}
                  fill
                  className="rounded-lg object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{hostel.name}</h1>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{hostel.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>{hostel.roomCapacity} students per room</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Curfew: {hostel.curfewTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span>₹{hostel.rentPerMonth}/month</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <span>{hostel.distanceFromCollege} minutes from college</span>
              </div>
            </div>

            {/* Booking Form */}
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-4">Complete Booking</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Proof (Screenshot/Transaction Receipt)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isBooking || !paymentProof}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
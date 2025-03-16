// my-app\app\pages\lender\hostel\new\page.tsx
'use client'
import { CameraIcon, BuildingOfficeIcon, MapPinIcon, UserGroupIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../../../../../utils/supabase'

interface HostelForm {
  name: string
  address: string
  gender: string
  hasMess: boolean
  distanceFromCollege: string
  curfewTime: string
  rentPerMonth: string
  roomCapacity: string
  images: File[]
  degree360Photos: File[] // Corrected property name
}

export default function CreateHostelForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<HostelForm>({
    name: '',
    address: '',
    gender: 'male',
    hasMess: false,
    distanceFromCollege: '',
    curfewTime: '',
    rentPerMonth: '',
    roomCapacity: '',
    images: [],
    degree360Photos: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = (files: FileList | null, type: 'images' | 'degree360Photos') => {
    if (!files) return
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles] // Fixed syntax error
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name || !formData.address || 
          !formData.distanceFromCollege || !formData.rentPerMonth ||
          !formData.roomCapacity || formData.images.length === 0) {
        throw new Error('Please fill all required fields')
      }

      // Get current lender
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload images
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('hostel-images')
            .upload(`${user.id}/${Date.now()}-${file.name}`, file)
          if (error) throw error
          return data.path
        })
      )

      // Upload 360 photos
      const degree360Urls = await Promise.all(
        formData.degree360Photos.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('360-photos')
            .upload(`${user.id}/${Date.now()}-${file.name}`, file)
          if (error) throw error
          return data.path
        })
      )

      // Create hostel record
      const { error: dbError } = await supabase
        .from('hostels')
        .insert([{
          name: formData.name,
          address: formData.address,
          gender: formData.gender,
          hasMess: formData.hasMess,
          distanceFromCollege: parseInt(formData.distanceFromCollege),
          curfewTime: formData.curfewTime,
          rentPerMonth: parseFloat(formData.rentPerMonth),
          roomCapacity: parseInt(formData.roomCapacity),
          images: imageUrls,
          degree360Photos: degree360Urls,
          lenderId: user.id,
          approved: false
        }])

      if (dbError) throw dbError
      router.push('/lender/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hostel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-green-600 mb-8 flex items-center gap-2">
          <BuildingOfficeIcon className="h-8 w-8" />
          Add New Hostel
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hostel Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Allowed *
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Gender Neutral</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasMess}
                  onChange={(e) => setFormData({...formData, hasMess: e.target.checked})}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700">
                  Has Mess Facility
                </label>
              </div>
            </div>

            {/* Numeric Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance from College (minutes) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.distanceFromCollege}
                  onChange={(e) => setFormData({...formData, distanceFromCollege: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curfew Time
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={formData.curfewTime}
                  onChange={(e) => setFormData({...formData, curfewTime: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Per Month (₹) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.rentPerMonth}
                  onChange={(e) => setFormData({...formData, rentPerMonth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Capacity *
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.roomCapacity}
                  onChange={(e) => setFormData({...formData, roomCapacity: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hostel Images * (Minimum 3 photos)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files, 'images')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.images.length} images selected
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                360° Photos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files, 'degree360Photos')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.degree360Photos.length} 360° photos selected
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Create Hostel Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
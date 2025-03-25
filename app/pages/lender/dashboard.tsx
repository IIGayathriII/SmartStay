// pages/lender/dashboard.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../../../utils/supabase'

interface HostelCardProps {
  hostel: {
    id: string
    name: string
    address: string
    images: string[]
    rentPerMonth: number
    gender: string
    hasMess: boolean
    approved: boolean
  }
}

const HostelCard = ({ hostel }: HostelCardProps) => {
  return (
    <div className="hostel-card">
      <h3>{hostel.name}</h3>
      <p>{hostel.address}</p>
      <p>Rent: ${hostel.rentPerMonth}</p>
      <p>Gender: {hostel.gender}</p>
      <p>Mess Available: {hostel.hasMess ? 'Yes' : 'No'}</p>
      <p>Approved: {hostel.approved ? 'Yes' : 'No'}</p>
    </div>
  )
}

export default function LenderDashboard() {
  const [hostels, setHostels] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newHostel, setNewHostel] = useState({
    name: '',
    address: '',
    images: [] as string[],
    gender: 'Gender Neutral',
    hasMess: false,
    distanceFromCollege: 0,
    curfewTime: '',
    rentPerMonth: 0,
    roomCapacity: 1
  })

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('hostels')
      .select('*')
      .eq('lenderId', user?.id)
    setHostels(data || [])
  }

  const handleCreateHostel = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in to create a hostel')
        return
      }

      const { error } = await supabase
        .from('hostels')
        .insert([{ 
          ...newHostel,
          lenderId: user.id,
          degree360Photos: [],
          images: []
        }])

      if (error) throw error

      fetchHostels()
      setShowForm(false)
      setNewHostel({
        name: '',
        address: '',
        images: [],
        gender: 'Gender Neutral',
        hasMess: false,
        distanceFromCollege: 0,
        curfewTime: '',
        rentPerMonth: 0,
        roomCapacity: 1
      })

    } catch (error) {
      console.error('Error creating hostel:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setNewHostel(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Hostel
      </button>
      
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl mb-4">Add New Hostel</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Hostel Name"
              value={newHostel.name}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newHostel.address}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <select
              name="gender"
              value={newHostel.gender}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Gender Neutral</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasMess"
                checked={newHostel.hasMess}
                onChange={handleInputChange}
              />
              Mess Available
            </label>
            <input
              type="number"
              name="distanceFromCollege"
              placeholder="Distance from College (minutes)"
              value={newHostel.distanceFromCollege}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="curfewTime"
              placeholder="Curfew Time (e.g., 10:00 PM)"
              value={newHostel.curfewTime}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="rentPerMonth"
              placeholder="Rent Per Month"
              value={newHostel.rentPerMonth}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="roomCapacity"
              placeholder="Room Capacity"
              value={newHostel.roomCapacity}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          </div>
          <button 
            onClick={handleCreateHostel}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Hostel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map(hostel => (
          <HostelCard key={hostel.id} hostel={hostel} />
        ))}
      </div>
    </div>
  )
}
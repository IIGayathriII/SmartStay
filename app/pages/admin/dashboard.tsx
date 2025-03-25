import { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabase'

interface Hostel {
  id: string
  name: string
  approved: boolean
  // Add other required properties
}

export default function AdminDashboard() {
  const [hostels, setHostels] = useState<Hostel[]>([])

  useEffect(() => {
    fetchPendingHostels()
  }, [])

  const fetchPendingHostels = async () => {
    const { data } = await supabase
      .from('hostels')
      .select('*')
      .eq('approved', false)
    
    if (data) setHostels(data as Hostel[])
  }

  const approveHostel = async (hostelId: string) => {
    await supabase
      .from('hostels')
      .update({ approved: true })
      .eq('id', hostelId)
    
    fetchPendingHostels()
  }

  return (
    <div>
      {hostels.map(hostel => (
        <div key={hostel.id}>
          <h2>{hostel.name}</h2>
          <button onClick={() => approveHostel(hostel.id)}>Approve</button>
        </div>
      ))}
    </div>
  )
}
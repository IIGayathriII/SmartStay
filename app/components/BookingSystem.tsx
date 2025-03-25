import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function BookingSystem({ hostelId }: { hostelId: string }) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null)

  const handleBooking = async () => {
    // Get user properly
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !paymentProof) return
    
    // Upload payment proof
    const { data: fileData, error: fileError } = await supabase.storage
      .from('payment-proofs')
      .upload(`${user.id}/${Date.now()}`, paymentProof)

    if (fileError) return
    
    // Create booking
    const { error } = await supabase
      .from('bookings')
      .insert([{
        student_id: user.id,
        hostel_id: hostelId,
        payment_proof: fileData.path,
        status: 'pending'
      }])

    if (!error) alert('Booking request sent!')
  }

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
        required
      />
      <button onClick={handleBooking} disabled={!paymentProof}>
        Book Now
      </button>
    </div>
  )
}
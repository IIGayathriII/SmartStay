import { useState } from 'react'
import { supabase } from '../../../utils/supabase'
import { useRouter } from 'next/router'

export default function LenderProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Update the user retrieval
const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('lenders')
      .insert([{ 
        id: user?.id,
        ...formData,
        created_at: new Date()
      }])

    if (!error) router.push('/lender/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form fields */}
    </form>
  )
}
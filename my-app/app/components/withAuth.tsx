// components/withAuth.tsx
import { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabase'

export const withAuth = (WrappedComponent: any, role: string) => {
  return (props: any) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/auth/${role}`)
          return
        }

        // Check user role
        const { data } = await supabase
          .from(role)
          .select('*')
          .eq('id', user.id)
          .single()

        if (!data) {
          router.push('/')
          return
        }

        if (role === 'student' || role === 'admin') {
          if (!data.inviteCodeUsed) {
            router.push(`/${role}/invite`)
            return
          }
        }

        setLoading(false)
      }

      checkAuth()
    }, [])

    return loading ? <div>Loading...</div> : <WrappedComponent {...props} />
  }
}

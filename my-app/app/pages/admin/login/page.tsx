// my-app/app/pages/admin/login/page.tsx
'use client'
import { Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {Label} from '../../../components/ui/label'
import { supabase } from '../../../../utils/supabase'
import { Button } from '../../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input' // Assuming you have an Input component

export default function StudentLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      const { data: admin } = await supabase
        .from('admin')
        .select('*')
        .eq('id', data.user?.id)
        .single()

      if (!admin) {
        await supabase.auth.signOut()
        throw new Error('No student account found with these credentials')
      }

      router.push(admin.inviteCodeUsed ? '/pages/admin/dashboard' : '/pages/admin/invite')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Administrator Login</CardTitle>
          <CardDescription className="text-center">Access your administrator account</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="administrator@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm">
            <a
              href="/pages/admin/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="/pages/admin/signup"
              className="text-primary hover:underline"
            >
              Create account
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
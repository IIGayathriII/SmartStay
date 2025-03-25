// app/student/invite/page.tsx
'use client'
import { Key } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../../../../utils/supabase'
import { Button } from '../../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

export default function InvitePage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const verifyCode = async () => {
    if (!code) {
      setError('Please enter an invite code')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      if (code !== process.env.NEXT_PUBLIC_STUDENT_INVITE_CODE) {
        throw new Error('Invalid invite code')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error: updateError } = await supabase
        .from('students')
        .update({ inviteCodeUsed: true })
        .eq('id', user.id)

      if (updateError) throw updateError

      router.push('/student/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify invite code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Key className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Enter Invite Code
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your student organization's invite code to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Invite Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  className="pl-10 uppercase"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <Button 
              onClick={verifyCode}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <a
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
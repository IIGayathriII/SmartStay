'use client'
import { useForm } from 'react-hook-form'
import { Building2, Lock, User, Hash, Phone, MapPin, File, QrCode } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../utils/supabase'
import { Button } from '../../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
//import { Separator } from '../../../components/ui/separator'
import { useImageUpload } from '../../../components/hooks/use-image-upload'
import { useState } from 'react'
import { Label } from '../../../components/ui/label'
export default function LenderSignup() {
  const router = useRouter()
  const [identificationFile, setIdentificationFile] = useState<File | null>(null)
  const [gpayQrFile, setGpayQrFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: ''
    }
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')

    try {
      if (!identificationFile || !gpayQrFile) {
        throw new Error('Please upload all required documents')
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: 'lender',
            username: data.username
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Upload files
      const userId = authData.user.id
      const identificationPath = `lenders/${userId}/identification/${Date.now()}`
      const gpayQrPath = `lenders/${userId}/gpay-qr/${Date.now()}`

      const [identificationUpload, gpayQrUpload] = await Promise.all([
        supabase.storage.from('documents').upload(identificationPath, identificationFile),
        supabase.storage.from('documents').upload(gpayQrPath, gpayQrFile)
      ])

      if (identificationUpload.error) throw identificationUpload.error
      if (gpayQrUpload.error) throw gpayQrUpload.error

      // Create lender record
      const { error: dbError } = await supabase.from('lenders').insert([{
        id: userId,
        ...data,
        proofOfIdentification: identificationUpload.data.path,
        gpayQrCode: gpayQrUpload.data.path
      }])

      if (dbError) throw dbError

      router.push('/lender/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Lender Registration</CardTitle>
          <CardDescription className="text-center">
            Create your hostel management account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="mb-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="iambatman" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="b@man.com" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Identification Document</Label>
                    <FileUpload
                      accept=".pdf,.jpg,.png"
                      onFileUploaded={setIdentificationFile}
                      icon={<File className="h-4 w-4" />}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GPay QR Code</Label>
                    <FileUpload
                      accept=".jpg,.png"
                      onFileUploaded={setGpayQrFile}
                      icon={<QrCode className="h-4 w-4" />}
                    />
                  </div>

                  <FormField
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <textarea
                              {...field}
                              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                              placeholder="Enter full address"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href="/pages/lender/login"
              className="text-primary hover:underline"
            >
              Login here
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function FileUpload({ accept, onFileUploaded, icon }: any) {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove
  } = useImageUpload({
    onUpload: (url: string) => onFileUploaded(url)
  })

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {!previewUrl ? (
        <div
          onClick={handleThumbnailClick}
          className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
        >
          <div className="rounded-full bg-background p-2 shadow-sm">
            {icon}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="group relative h-24 overflow-hidden rounded-lg border">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 bg-black/50">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleThumbnailClick}
                className="h-8 w-8 p-0"
              >
                ↗
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          </div>
          {fileName && (
            <div className="mt-1 text-xs text-muted-foreground truncate">
              {fileName}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { loginUser } from "@/app/actions"
import { Loader2 } from 'lucide-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    console.log('[LoginForm] Starting login attempt...')

    try {
      const result = await loginUser(email, password)

      console.log('[LoginForm] Login result:', result)

      if (!result.success) {
        setError(result.error || 'Login failed')
        toast({
          title: 'Login Failed',
          description: result.error || 'An error occurred',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Successful login
      console.log('[LoginForm] Login successful!')
      toast({
        title: 'Success',
        description: 'You have been logged in successfully',
      })

      router.push('/')
      router.refresh() 
    } catch (err) {
      console.error('[LoginForm] Error:', err)
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Admin Login
        </h1>
        <p className="text-sm text-gray-600">
          Enter your credentials to access the admin dashboard
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </Field>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              {error}
            </div>
          )}

          <Field>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <FieldDescription className="text-center text-xs mt-4 text-gray-500">
              Admin accounts only. Contact your administrator for access.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

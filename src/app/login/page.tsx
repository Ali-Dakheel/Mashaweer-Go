import { LoginForm } from "@/components/login-form"
import Image from 'next/image'

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-0 bg-background rounded-2xl shadow-lg border overflow-hidden">
          {/* Left side - Login Form */}
          <div className="p-8 md:p-12 flex items-center">
            <LoginForm />
          </div>
          
          {/* Right side - Logo and Branding */}
          <div className="hidden md:flex flex-col items-center justify-center bg-muted/50 p-12 relative border-l">
            {/* Decorative grid pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            {/* Logo and content */}
            <div className="relative z-10 text-center space-y-6">
              <div className="mb-8 bg-background rounded-2xl p-10 inline-block shadow-sm border">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={160}
                  className="opacity-90"
                  priority
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  Access your admin dashboard to manage your Mashaweer efficiently and securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

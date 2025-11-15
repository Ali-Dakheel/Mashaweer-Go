import { toast as sonarToast } from 'sonner'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      if (options.variant === 'destructive') {
        sonarToast.error(options.title, {
          description: options.description,
        })
      } else {
        sonarToast.success(options.title, {
          description: options.description,
        })
      }
    },
  }
}

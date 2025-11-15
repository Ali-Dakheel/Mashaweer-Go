import { Users, Building2, Car, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsDisplayProps {
  metrics: {
    totalUsers: number
    totalAgencies: number
    totalVehicles: number
    pendingAgencies: number
  }
}

export function AdminMetricsDisplay({ metrics }: MetricsDisplayProps) {
  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Agencies',
      value: metrics.totalAgencies,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Vehicles',
      value: metrics.totalVehicles,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Approval',
      value: metrics.pendingAgencies,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">Active items</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

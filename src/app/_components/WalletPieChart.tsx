'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

interface WalletPieChartProps {
  data: { name: string; value: number }[]
}

export function WalletPieChart({ data }: WalletPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 h-full">
        <CardHeader>
          <CardTitle>Alokasi Dana</CardTitle>
          <CardDescription>Persentase dana berdasarkan dompet</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          Belum ada data saldo di dompet Anda.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Alokasi Dana</CardTitle>
        <CardDescription>Persentase dana berdasarkan dompet aktif</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

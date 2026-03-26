'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface OrderStatusData {
  name: string
  value: number
  color: string
}

interface OrdersStatusChartProps {
  data: OrderStatusData[]
  total: number
}

export function OrdersStatusChart({ data, total }: OrdersStatusChartProps) {
  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Aucune commande pour le moment
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
                fontSize: '13px',
              }}
              formatter={(value: number, name: string) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold text-foreground">{total}</span>
          <span className="text-[11px] text-muted-foreground">commandes</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[12px] text-muted-foreground">
              {entry.name}{' '}
              <span className="font-medium text-foreground">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

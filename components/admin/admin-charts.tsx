'use client'

import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const FRENCH_MONTHS: Record<string, string> = {
  '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
  '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-')
  return `${FRENCH_MONTHS[month] ?? month} ${year?.slice(2)}`
}

// --- Member Growth Chart ---

type MemberGrowthData = { month: string; free: number; premium: number; business: number }

export function MemberGrowthChart({ data }: { data: MemberGrowthData[] }) {
  const formatted = data.map((d) => ({ ...d, month: formatMonth(d.month) }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))',
          }}
        />
        <Legend />
        <Bar dataKey="free" name="Free" stackId="a" fill="#9ca3af" radius={[0, 0, 0, 0]} />
        <Bar dataKey="premium" name="Premium" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
        <Bar dataKey="business" name="Business" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// --- Revenue Chart ---

type RevenueData = { month: string; revenue: number }

export function RevenueChart({ data }: { data: RevenueData[] }) {
  const formatted = data.map((d) => ({ ...d, month: formatMonth(d.month) }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))',
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenus']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenus"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

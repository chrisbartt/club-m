import Link from 'next/link'

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  iconBg?: string
  iconColor?: string
  trend?: { value: string; positive: boolean }
  href?: string
}

export function KpiCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  trend,
  href,
}: KpiCardProps) {
  const content = (
    <>
      {/* Top-right icon */}
      {icon && (
        <div
          className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full ${iconBg ?? ''}`}
        >
          <div className={iconColor ?? ''}>{icon}</div>
        </div>
      )}

      {/* Label */}
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      {/* Value */}
      <p className="mt-1 text-[28px] font-bold leading-tight text-white">{value}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>
      )}

      {/* Trend badge */}
      {trend && (
        <div
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            trend.positive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {trend.positive ? '↗' : '↘'} {trend.value}
        </div>
      )}
    </>
  )

  const baseClasses =
    'relative rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5'

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} block transition-colors hover:border-white/[0.12] hover:bg-[#1e1e2a]`}
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClasses}>{content}</div>
}

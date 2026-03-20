import React from 'react'
import { RiskType } from '@/types'
import { IconRenderer } from '@/components/icons'
import { useLongPress } from '@/hooks/useLongPress'
import { cn } from '@/lib/utils'
import { getRiskWeightStyles } from '@/lib/risk-utils'

interface RiskButtonProps {
  risk: RiskType
  count: number
  onTap: (risk: RiskType) => void
  onLongPressRisk: (risk: RiskType) => void
}

export function RiskButton({ risk, count, onTap, onLongPressRisk }: RiskButtonProps) {
  const handlers = useLongPress(
    () => onLongPressRisk(risk),
    () => onTap(risk),
    { delay: 600 },
  )

  const styles = getRiskWeightStyles(risk.baseWeight, count > 0)

  return (
    <button
      {...handlers}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 min-h-[100px] rounded-2xl border-2 shadow-sm transition-all duration-100 ease-out select-none outline-none touch-manipulation',
        styles,
        'active:scale-95 active:brightness-95',
        count > 0 && 'ring-2 ring-offset-2 ring-slate-300',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <IconRenderer name={risk.iconName} className="w-10 h-10 mb-2 text-current" />
      <span className="font-bold text-sm text-center leading-tight">{risk.name}</span>

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
          {count}
        </span>
      )}
    </button>
  )
}

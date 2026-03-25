import React, { useRef } from 'react'
import { RiskType } from '@/types'
import { IconRenderer } from '@/components/icons'
import { useLongPress } from '@/hooks/useLongPress'
import { cn } from '@/lib/utils'
import { getRiskWeightStyles } from '@/lib/risk-utils'

interface RiskButtonProps {
  risk: RiskType
  count: number
  onAdd: (risk: RiskType) => void
  onRemove: (risk: RiskType) => void
  onLongPressRisk: (risk: RiskType) => void
}

export function RiskButton({ risk, count, onAdd, onRemove, onLongPressRisk }: RiskButtonProps) {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleTap = () => {
    if (clickTimeout.current !== null) {
      // Double tap detected -> Register risk
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      onAdd(risk)
    } else {
      // Single tap detected -> Wait to confirm it's not a double tap, then remove if exists
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null
        if (count > 0) {
          onRemove(risk)
        }
      }, 250) // 250ms delay to differentiate single and double tap
    }
  }

  const handlers = useLongPress(() => onLongPressRisk(risk), handleTap, { delay: 600 })

  const styles = getRiskWeightStyles(risk.baseWeight, count > 0)

  return (
    <button
      {...handlers}
      className={cn(
        'relative flex flex-col items-center justify-center p-2 min-h-[76px] rounded-xl border-2 shadow-sm transition-all duration-100 ease-out select-none outline-none touch-manipulation',
        styles,
        'active:scale-95 active:brightness-95',
        count > 0 && 'ring-1 ring-offset-1 ring-slate-300',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <IconRenderer name={risk.iconName} className="w-7 h-7 mb-1 text-current" />
      <span className="font-bold text-[11px] text-center leading-tight line-clamp-2">
        {risk.name}
      </span>

      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
          {count}
        </span>
      )}
    </button>
  )
}

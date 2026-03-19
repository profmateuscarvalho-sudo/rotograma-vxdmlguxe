import React from 'react'
import { RiskType } from '@/types'
import { IconRenderer } from '@/components/icons'
import { useLongPress } from '@/hooks/useLongPress'
import { cn } from '@/lib/utils'

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

  return (
    <button
      {...handlers}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 min-h-[100px] rounded-2xl bg-white border-2 border-slate-200 shadow-sm transition-all duration-100 ease-out select-none outline-none touch-manipulation',
        'active:scale-95 active:bg-slate-100',
        count > 0 && 'border-blue-300 bg-blue-50',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <IconRenderer
        name={risk.iconName}
        className={cn('w-10 h-10 mb-2', count > 0 ? 'text-blue-600' : 'text-slate-700')}
      />
      <span className="font-bold text-sm text-slate-800 text-center leading-tight">
        {risk.name}
      </span>

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
          {count}
        </span>
      )}
    </button>
  )
}

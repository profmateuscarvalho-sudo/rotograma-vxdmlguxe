import React from 'react'

export function RiskLevelLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 justify-center w-full print:bg-white print:border-slate-300">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="font-semibold text-slate-700">Baixo: 0-15 pts</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="font-semibold text-slate-700">Médio: 16-30 pts</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span className="font-semibold text-slate-700">Alto: 31-50 pts</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-600"></div>
        <span className="font-semibold text-slate-700">Crítico: &gt; 50 pts</span>
      </div>
    </div>
  )
}

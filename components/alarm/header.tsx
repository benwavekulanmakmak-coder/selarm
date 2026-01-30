"use client"

import { AlarmClock, Headphones, Settings } from "lucide-react"

interface HeaderProps {
  onTestSound: () => void
  onOpenSettings: () => void
}

export function Header({ onTestSound, onOpenSettings }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-3 group">
        <div className="w-11 h-11 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] grid place-items-center transition-bounce relative overflow-hidden group-hover:scale-110 group-hover:rotate-[5deg] group-hover:border-[var(--accent)] group-hover:ring-[6px] group-hover:ring-[var(--accent-soft)]">
          <AlarmClock className="w-6 h-6 text-[var(--accent)] relative z-10" />
        </div>
        <span
          className="text-2xl font-extrabold tracking-tight relative"
          style={{
            background: "linear-gradient(135deg, var(--text) 0%, var(--text-2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SELARM
        </span>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onTestSound}
          title="Test Sound"
          className="w-11 h-11 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce relative overflow-hidden hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 group"
        >
          <Headphones className="w-5 h-5 relative z-10 transition-bounce group-hover:scale-110" />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className="w-11 h-11 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce relative overflow-hidden hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 group"
        >
          <Settings className="w-5 h-5 relative z-10 transition-bounce group-hover:scale-110" />
        </button>
      </div>
    </div>
  )
}

"use client"

import { AlarmClock, Headphones, Settings } from "lucide-react"

interface HeaderProps {
  onTestSound: () => void
  onOpenSettings: () => void
}

export function Header({ onTestSound, onOpenSettings }: HeaderProps) {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <AlarmClock className="w-6 h-6" />
        </div>
        <span className="logo-text">SELARM</span>
      </div>
      <div className="header-actions">
        <button
          type="button"
          onClick={onTestSound}
          title="Test Sound"
          className="icon-btn-header"
        >
          <Headphones className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className="icon-btn-header"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

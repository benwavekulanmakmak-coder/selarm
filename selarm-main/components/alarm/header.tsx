"use client"

import { AlarmClock, Headphones, Settings, Pause, Play, Square } from "lucide-react"

interface HeaderProps {
  onTestSound: () => void
  onOpenSettings: () => void
  onPauseSound: () => void
  onStopSound: () => void
  isSoundPlaying: boolean
  isSoundPaused: boolean
}

export function Header({ 
  onTestSound, 
  onOpenSettings, 
  onPauseSound, 
  onStopSound,
  isSoundPlaying,
  isSoundPaused
}: HeaderProps) {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <AlarmClock className="w-6 h-6" />
        </div>
        <span className="logo-text">SELARM</span>
      </div>
      <div className="header-actions">
        {isSoundPlaying && (
          <>
            <button
              type="button"
              onClick={onPauseSound}
              title={isSoundPaused ? "Continue Sound" : "Pause Sound"}
              className="icon-btn-header"
            >
              {isSoundPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={onStopSound}
              title="Stop Sound"
              className="icon-btn-header"
            >
              <Square className="w-5 h-5" />
            </button>
          </>
        )}
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

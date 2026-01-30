"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { Music } from "lucide-react"
import type { Sound } from "@/hooks/use-alarm-state"

interface AlarmFormProps {
  selectedTime: string
  selectedSound: string
  sounds: Record<string, Sound>
  onTimeChange: (time: string) => void
  onOpenSoundPicker: () => void
  onAddAlarm: (name: string) => void
}

export function AlarmForm({
  selectedTime,
  selectedSound,
  sounds,
  onTimeChange,
  onOpenSoundPicker,
  onAddAlarm,
}: AlarmFormProps) {
  const [alarmName, setAlarmName] = useState("")
  const [displayTime, setDisplayTime] = useState("00:00")
  const [timeDigits, setTimeDigits] = useState<string[]>([])
  const [selectionStart, setSelectionStart] = useState<number | null>(null)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Initialize display time
  useEffect(() => {
    setDisplayTime(selectedTime)
  }, [selectedTime])

  // Process key press and update time digits
  const processTimeKey = useCallback((key: string): string => {
    if (!/^[0-9]$/.test(key)) return key
    
    const newDigits = [...timeDigits, key].slice(-4) // Keep only last 4 digits
    
    if (newDigits.length === 1) {
      // First digit: 0-2
      const hour1 = parseInt(newDigits[0], 10)
      const maxHour = hour1 > 2 ? 3 : 23 // If first digit > 2, max is 23
      const hours = Math.min(maxHour, hour1 * 10)
      return `${String(hours).padStart(2, '0')}:00`
    }
    
    if (newDigits.length === 2) {
      // Second digit: depends on first digit
      const hour1 = parseInt(newDigits[0], 10)
      const hour2 = parseInt(newDigits[1], 10)
      
      if (hour1 === 0 || hour1 === 1) {
        // 00-19: any second digit 0-9
        const hours = hour1 * 10 + hour2
        return `${String(hours).padStart(2, '0')}:00`
      } else if (hour1 === 2) {
        // 20-23: second digit 0-3
        const hours = Math.min(23, 20 + hour2)
        return `${String(hours).padStart(2, '0')}:00`
      }
    }
    
    if (newDigits.length === 3) {
      // Third digit: minutes first digit 0-5
      const hour1 = parseInt(newDigits[0], 10)
      const hour2 = parseInt(newDigits[1], 10)
      const minute1 = Math.min(5, parseInt(newDigits[2], 10))
      
      let hours = 0
      if (hour1 === 0 || hour1 === 1) {
        hours = hour1 * 10 + hour2
      } else if (hour1 === 2) {
        hours = Math.min(23, 20 + hour2)
      }
      
      return `${String(hours).padStart(2, '0')}:${minute1}0`
    }
    
    if (newDigits.length === 4) {
      // Fourth digit: minutes second digit 0-9
      const hour1 = parseInt(newDigits[0], 10)
      const hour2 = parseInt(newDigits[1], 10)
      const minute1 = Math.min(5, parseInt(newDigits[2], 10))
      const minute2 = Math.min(9, parseInt(newDigits[3], 10))
      
      let hours = 0
      if (hour1 === 0 || hour1 === 1) {
        hours = hour1 * 10 + hour2
      } else if (hour1 === 2) {
        hours = Math.min(23, 20 + hour2)
      }
      
      const minutes = minute1 * 10 + minute2
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
    
    return "00:00"
  }, [timeDigits])

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const start = input.selectionStart || 0
    
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...timeDigits]
      newDigits.pop()
      setTimeDigits(newDigits)
      
      if (newDigits.length === 0) {
        setDisplayTime("00:00")
      } else {
        setDisplayTime(processTimeKey(""))
      }
      return
    }
    
    // Handle delete
    if (e.key === 'Delete') {
      e.preventDefault()
      setTimeDigits([])
      setDisplayTime("00:00")
      return
    }
    
    // Handle arrow keys for navigation
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Escape'].includes(e.key)) {
      return
    }
    
    // Handle number keys
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      const newTime = processTimeKey(e.key)
      setDisplayTime(newTime)
      
      // Update timeDigits for next key press
      const newDigits = [...timeDigits, e.key].slice(-4)
      setTimeDigits(newDigits)
      
      // Notify parent of time change if we have valid digits
      if (newDigits.length >= 2) {
        onTimeChange(newTime)
      }
    }
  }

  const handleTimeFocus = () => {
    // Save current selection
    const input = document.getElementById('time-input') as HTMLInputElement
    if (input) {
      setSelectionStart(input.selectionStart)
    }
    
    // Clear digits when focusing to start fresh
    setTimeDigits([])
  }

  const handleTimeBlur = () => {
    // If no digits were entered, keep the original time
    if (timeDigits.length === 0) {
      setDisplayTime(selectedTime)
    } else if (timeDigits.length < 2) {
      // If only partial hour entered, pad it
      const hour = parseInt(timeDigits[0] || '0', 10)
      const formatted = `${String(hour).padStart(2, '0')}:00`
      setDisplayTime(formatted)
      onTimeChange(formatted)
    }
    // If we have 2+ digits, the time is already updated
  }

  // Handle clicking on specific position in the time input
  const handleTimeClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    setSelectionStart(input.selectionStart)
  }

  const handleAddAlarm = () => {
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
    // Reset time input
    setTimeDigits([])
    setDisplayTime(selectedTime)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddAlarm()
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">NEW ALARM</span>
      </div>
      <div className="card">
        <div className="form-row">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Wake up, Workout, etc."
          />
        </div>
        <div className="form-row">
          <label className="form-label">Time</label>
          <input
            id="time-input"
            type="text"
            inputMode="numeric"
            className="form-input"
            value={displayTime}
            onKeyDown={handleTimeKeyDown}
            onFocus={handleTimeFocus}
            onBlur={handleTimeBlur}
            onClick={handleTimeClick}
            onChange={() => {}} // Controlled component, handled by onKeyDown
            placeholder="Click and type numbers"
            maxLength={5}
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              textAlign: "center",
              letterSpacing: "0.1em",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "text",
            }}
          />
          <div className="text-xs text-gray-500 mt-1 text-center">
            Type numbers: 3 → 03:00, 33 → 23:00, 335 → 23:50, 3359 → 23:59
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Sound</label>
          <button
            type="button"
            className="sound-picker-btn btn-optimized"
            onClick={onOpenSoundPicker}
          >
            <Music className="w-5 h-5" />
            <span className={`sound-picker-text ${selectedSound !== "default" ? "active" : ""}`}>
              {soundName}
            </span>
          </button>
        </div>
        <button type="button" className="btn-primary btn-optimized" onClick={handleAddAlarm}>
          ➕ ADD ALARM
        </button>
      </div>
    </div>
  )
}

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
  const [timeInput, setTimeInput] = useState("00:00")
  const [timeDigits, setTimeDigits] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Initialize display time
  useEffect(() => {
    setTimeInput(selectedTime)
  }, [selectedTime])

  const formatTimeFromDigits = useCallback((digits: string[]): string => {
    if (digits.length === 0) return "00:00"
    
    if (digits.length === 1) {
      // First digit: 0-2
      const hour1 = parseInt(digits[0], 10)
      const maxHour = hour1 > 2 ? 3 : 23
      const hours = Math.min(maxHour, hour1 * 10)
      return `${String(hours).padStart(2, '0')}:00`
    }
    
    if (digits.length === 2) {
      // Second digit: depends on first digit
      const hour1 = parseInt(digits[0], 10)
      const hour2 = parseInt(digits[1], 10)
      
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
    
    if (digits.length === 3) {
      // Third digit: minutes first digit 0-5
      const hour1 = parseInt(digits[0], 10)
      const hour2 = parseInt(digits[1], 10)
      const minute1 = Math.min(5, parseInt(digits[2], 10))
      
      let hours = 0
      if (hour1 === 0 || hour1 === 1) {
        hours = hour1 * 10 + hour2
      } else if (hour1 === 2) {
        hours = Math.min(23, 20 + hour2)
      }
      
      return `${String(hours).padStart(2, '0')}:${minute1}0`
    }
    
    if (digits.length >= 4) {
      // Fourth digit: minutes second digit 0-9
      const hour1 = parseInt(digits[0], 10)
      const hour2 = parseInt(digits[1], 10)
      const minute1 = Math.min(5, parseInt(digits[2], 10))
      const minute2 = Math.min(9, parseInt(digits[3], 10))
      
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
  }, [])

  const handleTimeFocus = () => {
    setIsEditing(true)
    setTimeDigits([])
    setTimeInput("00:00")
  }

  const handleTimeBlur = () => {
    setIsEditing(false)
    if (timeDigits.length === 0) {
      setTimeInput(selectedTime)
    } else {
      const formattedTime = formatTimeFromDigits(timeDigits)
      setTimeInput(formattedTime)
      onTimeChange(formattedTime)
    }
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation keys
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Escape'].includes(e.key)) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        const newDigits = [...timeDigits]
        newDigits.pop()
        setTimeDigits(newDigits)
        setTimeInput(formatTimeFromDigits(newDigits))
      }
      return
    }
    
    // Allow Ctrl combinations
    if (e.ctrlKey || e.metaKey) return
    
    // Only accept numbers
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      return
    }
    
    e.preventDefault()
    
    // Add digit and format
    const newDigits = [...timeDigits, e.key].slice(-4) // Keep only last 4 digits
    setTimeDigits(newDigits)
    
    const formattedTime = formatTimeFromDigits(newDigits)
    setTimeInput(formattedTime)
    
    // Update parent if we have valid input
    if (newDigits.length >= 2) {
      onTimeChange(formattedTime)
    }
  }

  const handleAddAlarm = () => {
    // Format time before adding
    if (timeDigits.length > 0) {
      const formattedTime = formatTimeFromDigits(timeDigits)
      setTimeInput(formattedTime)
      onTimeChange(formattedTime)
    }
    
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
    // Reset time input
    setTimeDigits([])
    setTimeInput(selectedTime)
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
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="form-input"
              value={timeInput}
              onFocus={handleTimeFocus}
              onBlur={handleTimeBlur}
              onKeyDown={handleTimeKeyDown}
              onChange={() => {}} // Controlled via onKeyDown
              placeholder="00:00"
              maxLength={5}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
                letterSpacing: "0.1em",
                fontSize: "16px",
                fontWeight: "600",
                padding: "16px 20px",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: "-20px",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: "12px",
              color: "var(--text-3)",
              opacity: 0.7,
            }}>
              Type numbers: 3 → 03:00, 33 → 23:00, 335 → 23:50
            </div>
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

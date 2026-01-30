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
    
    // Parse all digits
    const d = digits.map(d => parseInt(d, 10))
    
    if (digits.length === 1) {
      // Single digit: treat as first hour digit
      // If > 2, it becomes 0X (e.g., 3 -> 03:00)
      if (d[0] > 2) {
        return `0${d[0]}:00`
      }
      return `${d[0]}0:00`
    }
    
    if (digits.length === 2) {
      // Two digits: form hours
      let hours = d[0] * 10 + d[1]
      // Cap at 23
      if (hours > 23) {
        hours = 23
      }
      return `${String(hours).padStart(2, '0')}:00`
    }
    
    if (digits.length === 3) {
      // Three digits: first two are hours, third is first minute digit
      let hours = d[0] * 10 + d[1]
      if (hours > 23) hours = 23
      
      // Minutes first digit must be 0-5
      const minute1 = Math.min(5, d[2])
      return `${String(hours).padStart(2, '0')}:${minute1}0`
    }
    
    if (digits.length >= 4) {
      // Four digits: HHMM format
      let hours = d[0] * 10 + d[1]
      if (hours > 23) hours = 23
      
      // Minutes: first digit 0-5, second digit 0-9
      const minute1 = Math.min(5, d[2])
      const minute2 = d[3]
      const minutes = minute1 * 10 + minute2
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
    
    return "00:00"
  }, [])

  const handleTimeFocus = () => {
    setTimeDigits([])
    setTimeInput("00:00")
  }

  const handleTimeBlur = () => {
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
        <div className="form-row" style={{ marginBottom: "36px" }}>
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
              bottom: "-24px",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: "11px",
              color: "var(--text-3)",
              opacity: 0.7,
            }}>
              Type 4 digits: 0730 = 07:30, 1445 = 14:45
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
          ADD ALARM
        </button>
      </div>
    </div>
  )
}

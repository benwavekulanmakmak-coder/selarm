"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
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
  const [timeInput, setTimeInput] = useState(selectedTime)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Sync selectedTime prop to local state
  useEffect(() => {
    setTimeInput(selectedTime)
  }, [selectedTime])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "") // Remove non-digits
    
    // Auto-format: add colon after 2 digits
    if (value.length > 2) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4)
    }
    
    // Limit to 5 characters (HH:MM)
    value = value.slice(0, 5)
    
    setTimeInput(value)
    
    // Validate and update parent if format is correct
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      onTimeChange(value)
    }
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  const handleTimeBlur = () => {
    // Validate on blur and fix format if needed
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeInput)) {
      // Try to fix common issues
      const parts = timeInput.split(":")
      if (parts.length === 2) {
        let hours = parseInt(parts[0], 10) || 0
        let minutes = parseInt(parts[1], 10) || 0
        
        hours = Math.max(0, Math.min(23, hours))
        minutes = Math.max(0, Math.min(59, minutes))
        
        const fixed = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        setTimeInput(fixed)
        onTimeChange(fixed)
      } else {
        // Reset to selectedTime if invalid
        setTimeInput(selectedTime)
      }
    }
  }

  const handleAddAlarm = () => {
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
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
            placeholder="Wake up, Workout, etc."
          />
        </div>
        <div className="form-row">
          <label className="form-label">Time</label>
          <input
            type="text"
            className="form-input"
            value={timeInput}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            onKeyDown={handleTimeKeyDown}
            placeholder="HH:MM (e.g., 09:30)"
            pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
            maxLength={5}
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              textAlign: "center",
              letterSpacing: "0.1em",
              fontSize: "16px",
              fontWeight: "600",
            }}
          />
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


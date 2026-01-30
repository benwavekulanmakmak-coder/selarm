"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
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
  const [isEditingTime, setIsEditingTime] = useState(false)
  const timeInputRef = useRef<HTMLInputElement>(null)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Sync selectedTime prop to local state when not editing
  useEffect(() => {
    if (!isEditingTime) {
      setTimeInput(selectedTime)
    }
  }, [selectedTime, isEditingTime])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    
    // Allow empty input
    if (input === "") {
      setTimeInput("")
      setIsEditingTime(true)
      return
    }
    
    // Remove any non-digit characters
    const digits = input.replace(/[^0-9]/g, "")
    
    if (digits.length <= 4) {
      // While typing, just show digits
      setTimeInput(digits)
      setIsEditingTime(true)
    } else {
      // Auto-format when we have enough digits
      const hours = digits.slice(0, 2)
      const minutes = digits.slice(2, 4)
      
      // Validate hours (00-23)
      const validHours = Math.min(23, Math.max(0, parseInt(hours, 10)))
      const validMinutes = Math.min(59, Math.max(0, parseInt(minutes, 10)))
      
      const formatted = `${String(validHours).padStart(2, '0')}:${String(validMinutes).padStart(2, '0')}`
      setTimeInput(formatted)
      setIsEditingTime(false)
      onTimeChange(formatted)
    }
  }

  const handleTimeFocus = () => {
    setIsEditingTime(true)
    // Remove colon for editing
    if (timeInput.includes(":")) {
      setTimeInput(timeInput.replace(":", ""))
    }
  }

  const handleTimeBlur = useCallback(() => {
    setIsEditingTime(false)
    
    const currentValue = timeInput.replace(/[^0-9]/g, "")
    
    if (currentValue.length === 0) {
      // Reset to selectedTime if empty
      setTimeInput(selectedTime)
      return
    }
    
    if (currentValue.length <= 2) {
      // Only hours entered, add default minutes
      const hours = Math.min(23, Math.max(0, parseInt(currentValue, 10)))
      const formatted = `${String(hours).padStart(2, '0')}:00`
      setTimeInput(formatted)
      onTimeChange(formatted)
      return
    }
    
    if (currentValue.length === 3) {
      // Handle 3 digits (e.g., "123" -> "01:23")
      const hours = Math.min(23, Math.max(0, parseInt(currentValue[0], 10)))
      const minutes = Math.min(59, Math.max(0, parseInt(currentValue.slice(1, 3), 10)))
      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      setTimeInput(formatted)
      onTimeChange(formatted)
      return
    }
    
    if (currentValue.length >= 4) {
      // Format as HH:MM
      const hours = Math.min(23, Math.max(0, parseInt(currentValue.slice(0, 2), 10)))
      const minutes = Math.min(59, Math.max(0, parseInt(currentValue.slice(2, 4), 10)))
      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      setTimeInput(formatted)
      onTimeChange(formatted)
    }
  }, [timeInput, selectedTime, onTimeChange])

  const handleAddAlarm = () => {
    // Ensure time is formatted before adding alarm
    if (isEditingTime) {
      handleTimeBlur()
    }
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
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
            ref={timeInputRef}
            type="text"
            inputMode="numeric"
            className="form-input"
            value={timeInput}
            onChange={handleTimeChange}
            onFocus={handleTimeFocus}
            onBlur={handleTimeBlur}
            onKeyDown={handleKeyDown}
            placeholder="HHMM or HH:MM"
            maxLength={isEditingTime ? 4 : 5}
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

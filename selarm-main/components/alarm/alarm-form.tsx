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
  const [showTimePicker, setShowTimePicker] = useState(false)
  const timePickerRef = useRef<HTMLDivElement>(null)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Generate time options
  const timeOptions: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      timeOptions.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    }
  }

  // Close time picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false)
      }
    }
    if (showTimePicker) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showTimePicker])

  const handleTimeSelect = (time: string) => {
    onTimeChange(time)
    setShowTimePicker(false)
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
          <div className="time-picker-container" ref={timePickerRef}>
            <div
              className={`time-picker-display ${showTimePicker ? "open" : ""}`}
              onClick={() => setShowTimePicker(!showTimePicker)}
            >
              <span>{selectedTime}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <div className={`time-picker-dropdown ${showTimePicker ? "show" : ""}`}>
              {timeOptions.map((time) => (
                <div
                  key={time}
                  className={`time-option ${time === selectedTime ? "selected" : ""}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </div>
              ))}
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

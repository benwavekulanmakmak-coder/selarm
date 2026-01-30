"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Music, ChevronUp, ChevronDown, Plus, Clock, Tag } from "lucide-react"
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
  const [hours, setHours] = useState(() => parseInt(selectedTime.split(":")[0], 10))
  const [minutes, setMinutes] = useState(() => parseInt(selectedTime.split(":")[1], 10))
  const hoursRef = useRef<HTMLDivElement>(null)
  const minutesRef = useRef<HTMLDivElement>(null)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Sync time prop to local state
  useEffect(() => {
    const [h, m] = selectedTime.split(":").map(Number)
    setHours(h)
    setMinutes(m)
  }, [selectedTime])

  // Update parent when hours/minutes change
  useEffect(() => {
    const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    if (timeStr !== selectedTime) {
      onTimeChange(timeStr)
    }
  }, [hours, minutes, selectedTime, onTimeChange])

  const incrementHours = () => setHours((h) => (h + 1) % 24)
  const decrementHours = () => setHours((h) => (h - 1 + 24) % 24)
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60)
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60)

  // Scroll wheel support
  const handleWheelHours = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) incrementHours()
    else decrementHours()
  }

  const handleWheelMinutes = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) incrementMinutes()
    else decrementMinutes()
  }

  const handleAddAlarm = () => {
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
  }

  return (
    <div className="mb-8">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-[0_8px_40px_var(--accent-glow)]">
        {/* Time Picker - Scroll Wheels */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Set Time</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {/* Hours Wheel */}
            <div
              ref={hoursRef}
              onWheel={handleWheelHours}
              className="flex flex-col items-center select-none"
            >
              <button
                type="button"
                onClick={incrementHours}
                className="w-10 h-10 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-all duration-200 active:scale-90"
                aria-label="Increase hours"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div className="relative w-20 h-24 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[var(--surface)] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[var(--surface)] to-transparent z-10 pointer-events-none" />

                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-mono text-5xl font-bold text-[var(--text)] tabular-nums">
                    {String(hours).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={decrementHours}
                className="w-10 h-10 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-all duration-200 active:scale-90"
                aria-label="Decrease hours"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Separator */}
            <div className="flex flex-col items-center justify-center h-24 px-1">
              <span className="font-mono text-4xl font-bold text-[var(--accent)] clock-sep">:</span>
            </div>

            {/* Minutes Wheel */}
            <div
              ref={minutesRef}
              onWheel={handleWheelMinutes}
              className="flex flex-col items-center select-none"
            >
              <button
                type="button"
                onClick={incrementMinutes}
                className="w-10 h-10 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-all duration-200 active:scale-90"
                aria-label="Increase minutes"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div className="relative w-20 h-24 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[var(--surface)] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[var(--surface)] to-transparent z-10 pointer-events-none" />

                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-mono text-5xl font-bold text-[var(--text)] tabular-nums">
                    {String(minutes).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={decrementMinutes}
                className="w-10 h-10 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-all duration-200 active:scale-90"
                aria-label="Decrease minutes"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Alarm Name & Sound - Compact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Alarm Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)]">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
              placeholder="Alarm label..."
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none transition-all duration-200 placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </div>

          {/* Sound Picker */}
          <button
            type="button"
            onClick={onOpenSoundPicker}
            className="flex items-center gap-3 px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface-2)] group"
          >
            <Music className="w-4 h-4 text-[var(--text-3)] transition-colors group-hover:text-[var(--accent)]" />
            <span className="text-sm text-[var(--text-2)] flex-1 text-left truncate transition-colors group-hover:text-[var(--accent)]">
              {soundName}
            </span>
          </button>
        </div>

        {/* Add Alarm Button */}
        <button
          type="button"
          onClick={handleAddAlarm}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-semibold text-white cursor-pointer transition-all duration-300 tracking-wide hover:-translate-y-0.5 hover:shadow-[0_20px_50px_var(--accent-glow)] active:translate-y-0 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--bg-gradient-1) 100%)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Alarm</span>
        </button>
      </div>
    </div>
  )
}

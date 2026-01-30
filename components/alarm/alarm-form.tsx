"use client"

import { useState, useRef, useEffect } from "react"
import { Music, ChevronDown } from "lucide-react"
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
  const dropdownRef = useRef<HTMLDivElement>(null)

  const soundName =
    selectedSound === "default"
      ? "Default Beep"
      : sounds[selectedSound]?.name || "Default Beep"

  // Generate time options
  const timeOptions: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      timeOptions.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      )
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowTimePicker(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleAddAlarm = () => {
    onAddAlarm(alarmName.trim() || "Alarm")
    setAlarmName("")
  }

  return (
    <div className="mb-8">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-7 backdrop-blur-sm transition-bounce hover:border-[var(--accent)] hover:-translate-y-1.5 hover:shadow-2xl">
        {/* Time Picker */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-[var(--text-2)] mb-2">
            Time
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-[14px] font-mono text-base font-semibold text-[var(--text)] flex items-center justify-between cursor-pointer transition-bounce hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-lg focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            >
              <span>{selectedTime}</span>
              <ChevronDown
                className={`w-[18px] h-[18px] text-[var(--text-3)] transition-transform duration-300 ${showTimePicker ? "rotate-180 text-[var(--accent)]" : ""}`}
              />
            </button>

            {showTimePicker && (
              <div
                className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-4 z-50 flex flex-col gap-2 max-h-60 overflow-y-auto shadow-2xl backdrop-blur-xl"
                style={{ animation: "dropdownSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onTimeChange(time)
                      setShowTimePicker(false)
                    }}
                    className={`p-3 bg-[var(--bg)] border rounded-[10px] font-mono text-sm font-medium text-[var(--text-2)] cursor-pointer transition-bounce text-center hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:-translate-y-0.5 hover:scale-[1.02] ${
                      selectedTime === time
                        ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] font-bold scale-[1.03]"
                        : "border-[var(--border-subtle)]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alarm Name */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-[var(--text-2)] mb-2">
            Label
          </label>
          <input
            type="text"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
            placeholder="Alarm name..."
            className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-[14px] text-[15px] text-[var(--text)] outline-none transition-bounce placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] focus:-translate-y-0.5"
          />
        </div>

        {/* Sound Picker */}
        <div className="mb-6">
          <label className="block text-[13px] font-bold text-[var(--text-2)] mb-2">
            Sound
          </label>
          <button
            type="button"
            onClick={onOpenSoundPicker}
            className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-[14px] flex items-center gap-3 cursor-pointer transition-bounce hover:border-[var(--accent)] hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:shadow-lg group"
          >
            <Music className="w-5 h-5 text-[var(--text-3)] transition-bounce group-hover:text-[var(--accent)] group-hover:scale-110" />
            <span className="text-sm font-medium text-[var(--text-2)] flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis transition-colors group-hover:text-[var(--accent)]">
              {soundName}
            </span>
          </button>
        </div>

        {/* Add Alarm Button */}
        <button
          type="button"
          onClick={handleAddAlarm}
          className="w-full py-5 px-6 rounded-[14px] text-base font-bold text-white cursor-pointer transition-bounce tracking-wide hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--bg-gradient-1) 100%)",
            boxShadow: "0 20px 60px var(--accent-glow)",
          }}
        >
          Add Alarm
        </button>
      </div>
    </div>
  )
}

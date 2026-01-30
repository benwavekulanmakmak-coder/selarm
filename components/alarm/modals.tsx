"use client"

import React from "react"

import { X, Volume2, Upload, Check, Clock } from "lucide-react"
import type { Sound } from "@/hooks/use-alarm-state"

interface ModalOverlayProps {
  show: boolean
  onClose: () => void
  children: React.ReactNode
  allowBackdropClose?: boolean
}

function ModalOverlay({ show, onClose, children, allowBackdropClose = true }: ModalOverlayProps) {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && allowBackdropClose) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-[420px] bg-[var(--surface)] border border-[var(--border)] rounded-[28px] relative backdrop-blur-xl shadow-2xl"
        style={{ animation: "modalSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {children}
      </div>
    </div>
  )
}

interface SoundPickerModalProps {
  show: boolean
  onClose: () => void
  sounds: Record<string, Sound>
  selectedSound: string
  onSelectSound: (id: string) => void
  onDeleteSound: (id: string) => void
  onUploadSound: (file: File) => void
  onPlaySound: (id: string) => void
}

export function SoundPickerModal({
  show,
  onClose,
  sounds,
  selectedSound,
  onSelectSound,
  onDeleteSound,
  onUploadSound,
  onPlaySound,
}: SoundPickerModalProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadSound(file)
    }
    e.target.value = ""
  }

  return (
    <ModalOverlay show={show} onClose={onClose}>
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce z-10 hover:bg-[var(--surface-3)] hover:text-[var(--text)] hover:rotate-90 hover:scale-110"
      >
        <X className="w-[18px] h-[18px]" />
      </button>

      {/* Header */}
      <div className="p-7 pb-5 border-b border-[var(--border)]">
        <h2 className="text-xl font-extrabold text-[var(--text)] tracking-tight">
          Alarm Sound
        </h2>
        <p className="text-[13px] text-[var(--text-3)] font-medium mt-1.5">
          Choose or upload a custom sound
        </p>
      </div>

      {/* Sound list */}
      <div className="p-5 max-h-[360px] overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          {/* Default sound */}
          <button
            type="button"
            onClick={() => onSelectSound("default")}
            className={`flex items-center gap-4 p-4 px-5 bg-transparent border rounded-[14px] cursor-pointer w-full text-left transition-bounce ${
              selectedSound === "default"
                ? "bg-[var(--accent-soft)] border-[var(--accent)] translate-x-3"
                : "border-transparent hover:bg-[var(--surface-2)] hover:border-[var(--border)] hover:translate-x-2"
            }`}
          >
            <div
              className={`w-12 h-12 bg-[var(--bg)] rounded-xl grid place-items-center shrink-0 transition-bounce ${
                selectedSound === "default" ? "bg-[var(--accent-soft)]" : ""
              }`}
            >
              <Volume2
                className={`w-5 h-5 transition-bounce ${
                  selectedSound === "default"
                    ? "text-[var(--accent)] scale-110"
                    : "text-[var(--text-3)]"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-bold transition-colors ${
                  selectedSound === "default"
                    ? "text-[var(--accent)]"
                    : "text-[var(--text)]"
                }`}
              >
                Default Beep
              </div>
              <div className="text-xs text-[var(--text-3)] font-medium">
                Built-in • 1.5s loop
              </div>
            </div>
            {selectedSound === "default" ? (
              <Check className="w-6 h-6 text-[var(--accent)]" />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPlaySound("default")
                }}
                className="text-xs font-semibold text-[var(--accent)] p-2 hover:bg-[var(--accent-soft)] rounded-lg transition-colors"
              >
                Play
              </button>
            )}
          </button>

          {/* Custom sounds */}
          {Object.entries(sounds).map(([id, sound]) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSound(id)}
              className={`flex items-center gap-4 p-4 px-5 bg-transparent border rounded-[14px] cursor-pointer w-full text-left transition-bounce ${
                selectedSound === id
                  ? "bg-[var(--accent-soft)] border-[var(--accent)] translate-x-3"
                  : "border-transparent hover:bg-[var(--surface-2)] hover:border-[var(--border)] hover:translate-x-2"
              }`}
            >
              <div
                className={`w-12 h-12 bg-[var(--bg)] rounded-xl grid place-items-center shrink-0 transition-bounce ${
                  selectedSound === id ? "bg-[var(--accent-soft)]" : ""
                }`}
              >
                <Upload
                  className={`w-5 h-5 transition-bounce ${
                    selectedSound === id
                      ? "text-[var(--accent)] scale-110"
                      : "text-[var(--text-3)]"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-bold transition-colors ${
                    selectedSound === id
                      ? "text-[var(--accent)]"
                      : "text-[var(--text)]"
                  }`}
                >
                  {sound.name}
                </div>
                <div className="text-xs text-[var(--text-3)] font-medium">
                  Uploaded • {sound.size || "Custom"}
                </div>
              </div>
              {selectedSound === id ? (
                <Check className="w-6 h-6 text-[var(--accent)]" />
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlaySound(id)
                    }}
                    className="text-xs font-semibold text-[var(--accent)] p-2 hover:bg-[var(--accent-soft)] rounded-lg transition-colors"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSound(id)
                    }}
                    className="text-base font-semibold text-[var(--danger)] p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload button */}
      <div className="p-5 border-t border-[var(--border)]">
        <label className="w-full py-5 bg-[var(--bg)] border-2 border-dashed border-[var(--border)] rounded-[14px] flex items-center justify-center gap-3 cursor-pointer transition-bounce relative hover:border-[var(--accent)] hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:border-solid group">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="w-5 h-5 text-[var(--text-3)] transition-bounce group-hover:text-[var(--accent)] group-hover:-translate-y-0.5" />
          <span className="text-sm text-[var(--text-2)] font-semibold transition-colors group-hover:text-[var(--accent)]">
            Upload Custom Sound
          </span>
        </label>
      </div>
    </ModalOverlay>
  )
}

interface SettingsModalProps {
  show: boolean
  onClose: () => void
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export function SettingsModal({
  show,
  onClose,
  currentTheme,
  onThemeChange,
}: SettingsModalProps) {
  const themes = [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "navy", label: "Navy" },
    { id: "amber", label: "Amber" },
  ]

  return (
    <ModalOverlay show={show} onClose={onClose}>
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce z-10 hover:bg-[var(--surface-3)] hover:text-[var(--text)] hover:rotate-90 hover:scale-110"
      >
        <X className="w-[18px] h-[18px]" />
      </button>

      {/* Header */}
      <div className="p-7 pb-6 border-b border-[var(--border)]">
        <h2 className="text-xl font-extrabold text-[var(--text)] tracking-tight">
          Settings
        </h2>
      </div>

      {/* Theme selection */}
      <div className="p-7">
        <label className="text-xs font-extrabold tracking-widest uppercase text-[var(--text-3)] mb-4 block">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeChange(theme.id)}
              className={`p-5 bg-[var(--bg)] border-2 rounded-[14px] text-sm font-bold cursor-pointer transition-bounce text-center ${
                currentTheme === theme.id
                  ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] scale-[1.03] shadow-lg"
                  : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </ModalOverlay>
  )
}

interface RingModalProps {
  show: boolean
  alarmName: string
  alarmTime: string
  onSnooze: () => void
  onDismiss: () => void
}

export function RingModal({
  show,
  alarmName,
  alarmTime,
  onSnooze,
  onDismiss,
}: RingModalProps) {
  return (
    <ModalOverlay show={show} onClose={onDismiss} allowBackdropClose={false}>
      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-5 right-5 w-10 h-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce z-10 hover:bg-[var(--surface-3)] hover:text-[var(--text)] hover:rotate-90 hover:scale-110"
      >
        <X className="w-[18px] h-[18px]" />
      </button>

      <div className="p-12 pt-12 text-center">
        {/* Animated icon */}
        <div
          className="w-24 h-24 mx-auto mb-8 rounded-full grid place-items-center relative"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--bg-gradient-1) 100%)",
            animation: "ringBounce 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate",
          }}
        >
          <div
            className="absolute inset-[-12px] border-2 border-[var(--accent)] rounded-full"
            style={{ animation: "ringPulse 2s ease-out infinite" }}
          />
          <Clock
            className="w-9 h-9 text-white"
            style={{ animation: "ringIconShake 0.6s ease-in-out infinite alternate" }}
          />
        </div>

        {/* Label */}
        <div
          className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-[var(--accent)] mb-2"
          style={{ animation: "labelBlink 1.5s ease-in-out infinite" }}
        >
          Alarm
        </div>

        {/* Title */}
        <div className="text-[22px] font-extrabold text-[var(--text)] mb-2 tracking-tight">
          {alarmName}
        </div>

        {/* Time */}
        <div
          className="font-mono text-[52px] font-extrabold text-[var(--text)] mb-10 tracking-tight"
          style={{ animation: "timeGlow 2s ease-in-out infinite alternate" }}
        >
          {alarmTime}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onSnooze}
            className="flex-1 py-5 px-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-[14px] text-base font-bold text-[var(--text-2)] cursor-pointer transition-bounce hover:bg-[var(--surface-3)] hover:text-[var(--text)] hover:-translate-y-1"
          >
            SNOOZE 5M
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-5 px-6 rounded-[14px] text-base font-bold text-white cursor-pointer transition-bounce hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--bg-gradient-1) 100%)",
              boxShadow: "0 16px 40px var(--accent-glow)",
            }}
          >
            DISMISS
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

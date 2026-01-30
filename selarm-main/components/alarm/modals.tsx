"use client"

import React from "react"
import { X, Volume2, Upload, Check, Clock } from "lucide-react"
import type { Sound } from "@/hooks/use-alarm-state"

interface ModalOverlayProps {
  show: boolean
  onClose: () => void
  children?: React.ReactNode
  allowBackdropClose?: boolean
}

function ModalOverlay({ show, onClose, children, allowBackdropClose = true }: ModalOverlayProps) {
  if (!show) return null

  return (
    <div
      className={`overlay ${show ? "show" : ""}`}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && allowBackdropClose) {
          onClose()
        }
      }}
    >
      <div className="modal">{children}</div>
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
      <React.Fragment>
        <button type="button" className="modal-close" onClick={onClose}>
          <X className="w-[18px] h-[18px]" />
        </button>
        <div className="sound-panel-header">
          <div className="sound-panel-title">Select Sound</div>
          <div className="sound-panel-subtitle">Choose an alarm tone</div>
        </div>
        <div className="sound-panel-body">
          <div className="sound-list">
            <button
              type="button"
              className={`sound-item ${selectedSound === "default" ? "selected" : ""}`}
              onClick={() => onSelectSound("default")}
            >
              <div className="sound-item-icon">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="sound-item-info">
                <div className="sound-item-name">Default Beep</div>
                <div className="sound-item-meta">Built-in • 1.5s loop</div>
              </div>
              {selectedSound === "default" && (
                <Check className="sound-item-check" />
              )}
            </button>
            {Object.entries(sounds).map(([id, sound]) => (
              <button
                key={id}
                type="button"
                className={`sound-item ${selectedSound === id ? "selected" : ""}`}
                onClick={() => onSelectSound(id)}
              >
                <div className="sound-item-icon">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="sound-item-info">
                  <div className="sound-item-name">{sound.name}</div>
                  <div className="sound-item-meta">Uploaded • {sound.size || "Custom"}</div>
                </div>
                {selectedSound === id ? (
                  <Check className="sound-item-check" />
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onPlaySound(id)
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "8px",
                      }}
                    >
                      ▶
                    </button>
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onDeleteSound(id)
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "8px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="sound-panel-upload">
          <label className="upload-btn btn-optimized">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            />
            <Upload className="w-5 h-5" />
            <span>Upload Custom Sound</span>
          </label>
        </div>
      </React.Fragment>
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
      <React.Fragment>
        <button type="button" className="modal-close" onClick={onClose}>
          <X className="w-[18px] h-[18px]" />
        </button>
        <div className="settings-panel-header">
          <div className="settings-panel-title">Settings</div>
        </div>
        <div className="settings-panel-body">
          <div className="settings-group">
            <label className="settings-label">Theme</label>
            <div className="theme-grid">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-btn ${currentTheme === theme.id ? "active" : ""}`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
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
      <React.Fragment>
        <button type="button" className="modal-close" onClick={onDismiss}>
          <X className="w-[18px] h-[18px]" />
        </button>
        <div className="ring-modal-content">
          <div className="ring-icon-wrap">
            <Clock className="w-9 h-9" />
          </div>
          <div className="ring-label">Alarm</div>
          <div className="ring-title">{alarmName}</div>
          <div className="ring-time">{alarmTime}</div>
          <div className="ring-btns">
            <button type="button" className="ring-btn ring-btn-snooze btn-optimized" onClick={onSnooze}>
              SNOOZE 5M
            </button>
            <button type="button" className="ring-btn ring-btn-dismiss btn-optimized" onClick={onDismiss}>
              DISMISS
            </button>
          </div>
        </div>
      </React.Fragment>
    </ModalOverlay>
  )
}

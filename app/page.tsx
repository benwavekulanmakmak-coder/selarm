"use client"

import { useEffect, useRef, useCallback } from "react"
import { Background } from "@/components/alarm/background"
import { Header } from "@/components/alarm/header"
import { Clock } from "@/components/alarm/clock"
import { AlarmForm } from "@/components/alarm/alarm-form"
import { AlarmList } from "@/components/alarm/alarm-list"
import { Footer } from "@/components/alarm/footer"
import {
  SoundPickerModal,
  SettingsModal,
  RingModal,
} from "@/components/alarm/modals"
import {
  NotificationContainer,
  useNotifications,
} from "@/components/alarm/notifications"
import { useAlarmState, useSound, type Alarm } from "@/hooks/use-alarm-state"
import { useState } from "react"

export default function AlarmApp() {
  const {
    alarms,
    sounds,
    selectedSound,
    currentTheme,
    selectedTime,
    isLoaded,
    setSelectedSound,
    setCurrentTheme,
    setSelectedTime,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    clearAlarms,
    addSound,
    removeSound,
    addSnoozeAlarm,
  } = useAlarmState()

  const { playSound, stopSound } = useSound()
  const { notifications, showNotification } = useNotifications()

  const [showSoundPicker, setShowSoundPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null)

  const lastCheckedTime = useRef("")

  // Check alarms every second
  useEffect(() => {
    if (!isLoaded) return

    const checkAlarms = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

      // Only check once per minute
      if (currentTime === lastCheckedTime.current) return
      lastCheckedTime.current = currentTime

      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentTime) {
          setRingingAlarm(alarm)
          playSound(alarm.soundId, sounds)
          showNotification(`Alarm "${alarm.name}" is ringing!`, "warning")
        }
      })
    }

    const interval = setInterval(checkAlarms, 1000)
    return () => clearInterval(interval)
  }, [alarms, isLoaded, playSound, sounds, showNotification])

  const handleAddAlarm = useCallback(
    (name: string) => {
      const alarm = addAlarm(name)
      showNotification(`Alarm "${alarm.name}" added for ${alarm.time}`, "success")
    },
    [addAlarm, showNotification]
  )

  const handleRemoveAlarm = useCallback(
    (id: string) => {
      const alarm = alarms.find((a) => a.id === id)
      removeAlarm(id)
      showNotification(`Alarm "${alarm?.name}" deleted`, "warning")
    },
    [alarms, removeAlarm, showNotification]
  )

  const handleToggleAlarm = useCallback(
    (id: string) => {
      const alarm = alarms.find((a) => a.id === id)
      toggleAlarm(id)
      showNotification(
        `Alarm ${alarm?.enabled ? "disabled" : "enabled"}`,
        alarm?.enabled ? "warning" : "success"
      )
    },
    [alarms, toggleAlarm, showNotification]
  )

  const handleClearAlarms = useCallback(() => {
    if (alarms.length === 0) {
      showNotification("No alarms to clear", "warning")
      return
    }
    clearAlarms()
    showNotification("All alarms cleared", "success")
  }, [alarms.length, clearAlarms, showNotification])

  const handleTestSound = useCallback(() => {
    playSound(selectedSound, sounds, 5000)
    showNotification("Testing alarm sound...", "success")
  }, [playSound, selectedSound, sounds, showNotification])

  const handleSelectSound = useCallback(
    (id: string) => {
      setSelectedSound(id)
      const soundName =
        id === "default" ? "Default Beep" : sounds[id]?.name || "Default Beep"
      showNotification(`Selected sound: ${soundName}`, "success")
    },
    [setSelectedSound, sounds, showNotification]
  )

  const handleUploadSound = useCallback(
    (file: File) => {
      if (!file.type.startsWith("audio/")) {
        showNotification("Please select an audio file", "danger")
        return
      }

      const reader = new FileReader()
      reader.onload = (evt) => {
        const id = "sound_" + Date.now()
        const formatFileSize = (bytes: number) => {
          if (bytes < 1024) return bytes + " B"
          if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
          return (bytes / 1048576).toFixed(1) + " MB"
        }

        addSound(id, {
          name: file.name.replace(/\.[^/.]+$/, ""),
          data: evt.target?.result as string,
          size: formatFileSize(file.size),
        })
        showNotification("Sound uploaded successfully!", "success")
      }
      reader.onerror = () => {
        showNotification("Error uploading file", "danger")
      }
      reader.readAsDataURL(file)
    },
    [addSound, showNotification]
  )

  const handleDeleteSound = useCallback(
    (id: string) => {
      removeSound(id)
      showNotification("Sound deleted", "warning")
    },
    [removeSound, showNotification]
  )

  const handlePlaySound = useCallback(
    (id: string) => {
      playSound(id, sounds, 5000)
      showNotification("Playing sound preview...", "success")
    },
    [playSound, sounds, showNotification]
  )

  const handleSnooze = useCallback(() => {
    if (ringingAlarm) {
      addSnoozeAlarm(ringingAlarm)
      stopSound()
      setRingingAlarm(null)
      showNotification("Alarm snoozed for 5 minutes", "success")
    }
  }, [ringingAlarm, addSnoozeAlarm, stopSound, showNotification])

  const handleDismiss = useCallback(() => {
    stopSound()
    setRingingAlarm(null)
    showNotification("Alarm dismissed", "success")
  }, [stopSound, showNotification])

  const handleThemeChange = useCallback(
    (theme: string) => {
      setCurrentTheme(theme)
      showNotification(`Theme changed to ${theme}`, "success")
    },
    [setCurrentTheme, showNotification]
  )

  const handleCloseSoundPicker = useCallback(() => {
    stopSound()
    setShowSoundPicker(false)
  }, [stopSound])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Background />

      <NotificationContainer notifications={notifications} />

      <div className="relative z-10 max-w-[480px] mx-auto px-6 pt-10 pb-32">
        <Header
          onTestSound={handleTestSound}
          onOpenSettings={() => setShowSettings(true)}
        />

        <Clock />

        <AlarmForm
          selectedTime={selectedTime}
          selectedSound={selectedSound}
          sounds={sounds}
          onTimeChange={setSelectedTime}
          onOpenSoundPicker={() => setShowSoundPicker(true)}
          onAddAlarm={handleAddAlarm}
        />

        <AlarmList
          alarms={alarms}
          onToggle={handleToggleAlarm}
          onDelete={handleRemoveAlarm}
          onClearAll={handleClearAlarms}
        />
      </div>

      <Footer />

      <SoundPickerModal
        show={showSoundPicker}
        onClose={handleCloseSoundPicker}
        sounds={sounds}
        selectedSound={selectedSound}
        onSelectSound={handleSelectSound}
        onDeleteSound={handleDeleteSound}
        onUploadSound={handleUploadSound}
        onPlaySound={handlePlaySound}
      />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      <RingModal
        show={!!ringingAlarm}
        alarmName={ringingAlarm?.name || "Alarm"}
        alarmTime={ringingAlarm?.time || "00:00"}
        onSnooze={handleSnooze}
        onDismiss={handleDismiss}
      />
    </>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface Alarm {
  id: string
  name: string
  time: string
  soundId: string
  enabled: boolean
}

export interface Sound {
  name: string
  data: string
  size: string
}

interface AlarmState {
  alarms: Alarm[]
  sounds: Record<string, Sound>
  selectedSound: string
  currentTheme: string
  selectedTime: string
}

const defaultState: AlarmState = {
  alarms: [],
  sounds: {},
  selectedSound: "default",
  currentTheme: "dark",
  selectedTime: "00:00",
}

export function useAlarmState() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [sounds, setSounds] = useState<Record<string, Sound>>({})
  const [selectedSound, setSelectedSound] = useState("default")
  const [currentTheme, setCurrentTheme] = useState("dark")
  const [selectedTime, setSelectedTime] = useState("00:00")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selarmState")
    if (saved) {
      try {
        const data = JSON.parse(saved) as AlarmState
        setAlarms(data.alarms || [])
        setSounds(data.sounds || {})
        setSelectedSound(data.selectedSound || "default")
        setCurrentTheme(data.currentTheme || "dark")
        setSelectedTime(data.selectedTime || "00:00")
      } catch (e) {
        console.error("Failed to load state:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (!isLoaded) return
    const saveData: AlarmState = {
      alarms,
      sounds,
      selectedSound,
      currentTheme,
      selectedTime,
    }
    localStorage.setItem("selarmState", JSON.stringify(saveData))
  }, [alarms, sounds, selectedSound, currentTheme, selectedTime, isLoaded])

  // Apply theme
  useEffect(() => {
    if (!isLoaded) return
    document.documentElement.setAttribute("data-theme", currentTheme)
  }, [currentTheme, isLoaded])

  const addAlarm = useCallback(
    (name: string) => {
      const alarm: Alarm = {
        id: "alarm_" + Date.now(),
        name: name || "Alarm",
        time: selectedTime,
        soundId: selectedSound,
        enabled: true,
      }
      setAlarms((prev) => [...prev, alarm])
      return alarm
    },
    [selectedTime, selectedSound]
  )

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    )
  }, [])

  const clearAlarms = useCallback(() => {
    setAlarms([])
  }, [])

  const addSound = useCallback((id: string, sound: Sound) => {
    setSounds((prev) => ({ ...prev, [id]: sound }))
    setSelectedSound(id)
  }, [])

  const removeSound = useCallback(
    (id: string) => {
      setSounds((prev) => {
        const newSounds = { ...prev }
        delete newSounds[id]
        return newSounds
      })
      if (selectedSound === id) {
        setSelectedSound("default")
      }
    },
    [selectedSound]
  )

  const addSnoozeAlarm = useCallback(
    (originalAlarm: Alarm) => {
      const [h, m] = originalAlarm.time.split(":").map(Number)
      const snoozeDate = new Date()
      snoozeDate.setHours(h, m + 5, 0, 0)
      const newTime = `${String(snoozeDate.getHours()).padStart(2, "0")}:${String(snoozeDate.getMinutes()).padStart(2, "0")}`

      const alarm: Alarm = {
        id: "alarm_" + Date.now(),
        name: originalAlarm.name + " (Snoozed)",
        time: newTime,
        soundId: originalAlarm.soundId,
        enabled: true,
      }
      setAlarms((prev) => [...prev, alarm])
      return alarm
    },
    []
  )

  return {
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
  }
}

// Sound playback hook
interface AudioElement {
  source?: AudioBufferSourceNode
  audioCtx?: AudioContext
  isAudioContext: boolean
  pause?: () => void
  play?: () => Promise<void>
  paused?: boolean
  currentTime?: number
}

export function useSound() {
  const audioRef = useRef<AudioElement | HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getDefaultSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const duration = 1.5
      const sampleRate = audioCtx.sampleRate
      const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate
        const envelope = Math.exp(-t * 2) * (1 - Math.cos(2 * Math.PI * t * 2))
        const freq = 800 + Math.sin(t * Math.PI * 2) * 100
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3
      }

      return { buffer, audioCtx }
    } catch (error) {
      console.error("Error creating default sound:", error)
      return null
    }
  }, [])

  const playSound = useCallback(
    (soundId: string, sounds: Record<string, Sound>, autoStopMs?: number) => {
      stopSound()
      setIsPlaying(true)

      if (soundId === "default") {
        const soundData = getDefaultSound()
        if (!soundData) {
          setIsPlaying(false)
          return false
        }

        const { buffer, audioCtx } = soundData
        try {
          const source = audioCtx.createBufferSource()
          source.buffer = buffer
          source.loop = true
          source.connect(audioCtx.destination)

          audioRef.current = {
            source,
            audioCtx,
            isAudioContext: true,
          }

          source.start()

          if (autoStopMs) {
            setTimeout(() => {
              stopSound()
            }, autoStopMs)
          }

          return true
        } catch (error) {
          console.error("Error playing default sound:", error)
          setIsPlaying(false)
          return false
        }
      } else if (sounds[soundId]) {
        try {
          const audio = new Audio(sounds[soundId].data)
          audio.loop = true

          audio.addEventListener("canplaythrough", () => {
            audio.play().catch((error) => {
              console.error("Error playing uploaded sound:", error)
              setIsPlaying(false)
            })
          })

          audio.addEventListener("error", () => {
            setIsPlaying(false)
          })

          audioRef.current = audio

          if (autoStopMs) {
            setTimeout(() => {
              stopSound()
            }, autoStopMs)
          }

          audio.load()
          return true
        } catch (error) {
          console.error("Error creating audio element:", error)
          setIsPlaying(false)
          return false
        }
      }

      setIsPlaying(false)
      return false
    },
    [getDefaultSound]
  )

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      try {
        if ("isAudioContext" in audioRef.current && audioRef.current.isAudioContext) {
          const ctx = audioRef.current as AudioElement
          if (ctx.source) {
            ctx.source.stop()
          }
          if (ctx.audioCtx) {
            ctx.audioCtx.close()
          }
        } else {
          const audio = audioRef.current as HTMLAudioElement
          audio.pause()
          audio.currentTime = 0
        }
      } catch (error) {
        console.error("Error stopping sound:", error)
      }
      audioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  return { playSound, stopSound, isPlaying }
}

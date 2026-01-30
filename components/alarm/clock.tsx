"use client"

import { useEffect, useState, useRef } from "react"

function DigitTrack({ value, count }: { value: number; count: number }) {
  const digits = Array.from({ length: count }, (_, i) =>
    String(i).padStart(2, "0")
  )

  return (
    <div
      className="w-[84px] h-24 bg-[var(--bg)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden relative transition-bounce group hover:border-[var(--accent)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
    >
      <div
        className="absolute w-full top-0 will-change-transform transition-transform duration-500"
        style={{
          transform: `translateY(-${value * 96}px)`,
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {digits.map((digit) => (
          <div
            key={digit}
            className="font-mono text-[52px] font-extrabold text-[var(--text)] h-24 flex items-center justify-center w-full"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Clock() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [dateStr, setDateStr] = useState("")
  const lastSecond = useRef(-1)

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const currentSecond = now.getSeconds()
      if (currentSecond === lastSecond.current) return
      lastSecond.current = currentSecond

      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: currentSecond,
      })

      setDateStr(
        now
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          .toUpperCase()
      )
    }

    updateClock()
    const interval = setInterval(updateClock, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 pb-9 mb-8 relative overflow-hidden backdrop-blur-sm">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          filter: "drop-shadow(0 0 10px var(--accent))",
        }}
      />

      {/* Clock display */}
      <div className="flex items-center justify-center gap-1 mb-4">
        <DigitTrack value={time.hours} count={24} />
        <span
          className="font-mono text-[44px] font-bold text-[var(--accent)] leading-[96px] px-2 clock-sep"
          style={{ textShadow: "0 0 20px var(--accent-glow)" }}
        >
          :
        </span>
        <DigitTrack value={time.minutes} count={60} />
        <span
          className="font-mono text-[44px] font-bold text-[var(--accent)] leading-[96px] px-2 clock-sep"
          style={{ textShadow: "0 0 20px var(--accent-glow)" }}
        >
          :
        </span>
        <DigitTrack value={time.seconds} count={60} />
      </div>

      {/* Date */}
      <div className="text-center text-sm text-[var(--text-2)] font-semibold tracking-widest uppercase">
        {dateStr}
      </div>
    </div>
  )
}

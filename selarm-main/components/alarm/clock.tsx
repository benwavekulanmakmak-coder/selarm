"use client"

import { useEffect, useState, useRef } from "react"

function DigitTrack({ value, count }: { value: number; count: number }) {
  const digits = Array.from({ length: count }, (_, i) =>
    String(i).padStart(2, "0")
  )

  return (
    <div className="digit-box">
      <div
        className="digit-track"
        style={{
          transform: `translateY(-${value * 96}px)`,
        }}
      >
        {digits.map((digit) => (
          <div key={digit} className="digit-num">
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
    <div className="clock-section">
      <div className="clock-display">
        <DigitTrack value={time.hours} count={24} />
        <span className="clock-sep">:</span>
        <DigitTrack value={time.minutes} count={60} />
        <span className="clock-sep">:</span>
        <DigitTrack value={time.seconds} count={60} />
      </div>
      <div className="clock-date">{dateStr}</div>
    </div>
  )
}

"use client"

import { Clock, Power, PowerOff, Trash2 } from "lucide-react"
import type { Alarm } from "@/hooks/use-alarm-state"

interface AlarmListProps {
  alarms: Alarm[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function AlarmList({ alarms, onToggle, onDelete, onClearAll }: AlarmListProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <span
          className="text-xs font-extrabold tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--text-2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Alarms
        </span>
        {alarms.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[13px] font-bold text-[var(--accent)] bg-transparent border-none cursor-pointer py-2 px-4 rounded-[10px] transition-bounce hover:bg-[var(--accent-soft)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {alarms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
              <Clock className="w-8 h-8 text-[var(--text-3)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-3)]">
              No alarms yet
            </p>
          </div>
        ) : (
          alarms.map((alarm, index) => (
            <div
              key={alarm.id}
              className={`flex items-center gap-4 p-5 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] transition-bounce backdrop-blur-sm hover:border-[var(--accent)] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl ${
                !alarm.enabled ? "opacity-60" : ""
              }`}
              style={{
                animation: "alarmItemIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Status dot */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-bounce"
                style={{
                  background: alarm.enabled ? "var(--success)" : "var(--text-3)",
                  boxShadow: alarm.enabled ? "0 0 20px var(--success)" : "none",
                }}
              />

              {/* Alarm info */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[var(--text-2)] whitespace-nowrap overflow-hidden text-ellipsis">
                  {alarm.name}
                </div>
                <div
                  className="font-mono text-xl font-extrabold text-[var(--text)] tracking-tight transition-colors group-hover:text-[var(--accent)]"
                >
                  {alarm.time}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(alarm.id)}
                  title={alarm.enabled ? "Disable" : "Enable"}
                  className="w-10 h-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce hover:bg-[var(--surface-3)] hover:text-[var(--accent)] hover:-translate-y-0.5 hover:scale-110"
                >
                  {alarm.enabled ? (
                    <Power className="w-[18px] h-[18px]" />
                  ) : (
                    <PowerOff className="w-[18px] h-[18px]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(alarm.id)}
                  title="Delete"
                  className="w-10 h-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-3)] cursor-pointer grid place-items-center transition-bounce hover:bg-[var(--surface-3)] hover:text-[var(--danger)] hover:-translate-y-0.5 hover:scale-110"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

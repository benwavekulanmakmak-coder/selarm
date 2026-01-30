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
    <div className="section">
      <div className="section-header">
        <span className="section-title">ALARMS</span>
        {alarms.length > 0 && (
          <button type="button" className="section-action btn-optimized" onClick={onClearAll}>
            Clear All
          </button>
        )}
      </div>
      <div className="alarm-list">
        {alarms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Clock style={{ width: "60px", height: "60px" }} />
            </div>
            <div className="empty-text">No alarms yet</div>
          </div>
        ) : (
          alarms.map((alarm, index) => (
            <div
              key={alarm.id}
              className={`alarm-item ${!alarm.enabled ? "off" : ""}`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="alarm-dot"></div>
              <div className="alarm-info">
                <div className="alarm-name">{alarm.name}</div>
                <div className="alarm-time">{alarm.time}</div>
              </div>
              <div className="alarm-btns">
                <button
                  type="button"
                  className="alarm-btn"
                  onClick={() => onToggle(alarm.id)}
                  title={alarm.enabled ? "Disable" : "Enable"}
                >
                  {alarm.enabled ? (
                    <Power className="w-[18px] h-[18px]" />
                  ) : (
                    <PowerOff className="w-[18px] h-[18px]" />
                  )}
                </button>
                <button
                  type="button"
                  className="alarm-btn del"
                  onClick={() => onDelete(alarm.id)}
                  title="Delete"
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

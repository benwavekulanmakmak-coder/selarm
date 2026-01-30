"use client"

import { useState, useCallback } from "react"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export interface Notification {
  id: string
  message: string
  type: "success" | "warning" | "danger"
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (message: string, type: "success" | "warning" | "danger" = "success") => {
      const id = `notif_${Date.now()}`
      const notification: Notification = { id, message, type }
      setNotifications((prev) => [...prev, notification])

      // Auto-remove after 4 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 4000)

      return id
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, showNotification, removeNotification }
}

interface NotificationContainerProps {
  notifications: Notification[]
}

export function NotificationContainer({ notifications }: NotificationContainerProps) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2.5 w-[90%] max-w-[400px] pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-[var(--surface)] border border-[rgba(255,255,255,0.1)] rounded-2xl py-4 px-5 flex items-center gap-3.5 shadow-2xl pointer-events-auto backdrop-blur-xl"
          style={{ animation: "notificationSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          {notification.type === "success" && (
            <CheckCircle className="w-6 h-6 text-[var(--success)] shrink-0" />
          )}
          {notification.type === "warning" && (
            <AlertTriangle className="w-6 h-6 text-[var(--warning)] shrink-0" />
          )}
          {notification.type === "danger" && (
            <XCircle className="w-6 h-6 text-[var(--danger)] shrink-0" />
          )}
          <div className="flex-1 text-sm font-medium text-[var(--text)] leading-snug">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  )
}

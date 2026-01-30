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

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 5000)

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
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          {notification.type === "success" && (
            <CheckCircle className="notification-icon" />
          )}
          {notification.type === "warning" && (
            <AlertTriangle className="notification-icon warning" />
          )}
          {notification.type === "danger" && (
            <XCircle className="notification-icon danger" />
          )}
          <div className="notification-content">{notification.message}</div>
        </div>
      ))}
    </div>
  )
}

"use client"

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t border-[var(--border)] py-4 px-6 text-center z-[100] bg-[var(--bg)]/85">
      <p className="text-[13px] font-medium text-[var(--text-2)] tracking-wide">
        <span className="text-[var(--text)] font-semibold">Made by</span>{" "}
        <span className="text-[var(--accent)] font-bold">Selarm</span>
        {" • "}
        <span className="text-[var(--info)] font-semibold">Modern Alarm Clock</span>
      </p>
    </div>
  )
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTimePickerTheme } from "../theme/timePickerProvider";
import type { TimePickerColorKey } from "../theme/timePickerTypes";
import { parseTimeStr, timeToMinutes } from "../lib/dateUtils";
import { Input } from "./Input";

export type TimeSelectionDetail = {
  /** 24-hour clock hours (0-23) */
  hours24: number;
  /** 12-hour clock hours (1-12) */
  hours12: number;
  /** Minutes (0-59) */
  minutes: number;
  /** Period for 12-hour clocks */
  period: "AM" | "PM";
  /** The Date object representing the selected time (includes today’s date unless a prior value provided) */
  date: Date;
  /** Human-readable formatted time string based on the current format prop */
  formatted: string;
};

export interface TimePickerProps {
  value: Date | null;
  /**
   * Called when the time changes. The first argument is the Date (or null when cleared),
   * and the second optional argument includes hours/minutes/period and a formatted string.
   */
  onChange: (date: Date | null, detail?: TimeSelectionDetail | null) => void;
  color?: TimePickerColorKey;
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "filled" | "standard";
  placeholder?: string;
  format?: "12h" | "24h";
  minuteStep?: number;
  minTime?: string; // HH:mm
  maxTime?: string; // HH:mm
  disabledTimes?: (h: number, m: number) => boolean;
  inline?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  showNow?: boolean;
  fullWidth?: boolean;
  label?: string;
  floatingLabel?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function formatDisplayTime(date: Date, mode: "12h" | "24h") {
  const h = date.getHours();
  const m = date.getMinutes();
  if (mode === "24h") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const am = h < 12;
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

export function TimePicker({
  value,
  onChange,
  color = "primary",
  size = "medium",
  variant = "outlined",
  placeholder = "Select time",
  format = "24h",
  minuteStep = 5,
  minTime,
  maxTime,
  disabledTimes,
  inline = false,
  disabled = false,
  clearable = true,
  showNow = true,
  fullWidth,
  label,
  floatingLabel,
  error,
  helperText,
  required,
  className,
  style
}: TimePickerProps) {
  const theme = useTimePickerTheme();
  const c = theme.colors[color];
  const s = theme.sizes[size];
  const [open, setOpen] = useState<boolean>(inline);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inline) return;
    function handleDoc(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, [open, inline]);

  const display = useMemo(() => (value ? formatDisplayTime(value, format) : ""), [value, format]);
  const buildDetail = (d: Date): TimeSelectionDetail => {
    const h24 = d.getHours();
    const mins = d.getMinutes();
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return {
      hours24: h24,
      hours12: h12,
      minutes: mins,
      period,
      date: d,
      formatted: formatDisplayTime(d, format)
    };
  };

  const panelStyle: React.CSSProperties = {
    position: inline ? "relative" : "absolute",
    top: inline ? undefined : "calc(100% + 6px)",
    left: 0,
    zIndex: theme.zIndex,
    background: theme.surface.background,
    border: `1px solid ${theme.surface.border}`,
    boxShadow: theme.shadow,
    borderRadius: theme.radius,
    overflow: "hidden"
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: s.padding,
    background: theme.surface.headerBackground,
    color: theme.surface.headerText,
    borderBottom: `1px solid ${theme.surface.border}`,
    fontFamily: theme.fontFamily
  };

  const listStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    padding: s.padding,
    fontFamily: theme.fontFamily
  };

  const colStyle: React.CSSProperties = {
    maxHeight: 200,
    overflowY: "auto" as const,
    border: `1px solid ${theme.surface.border}`,
    borderRadius: 6
  };

  const itemStyle: React.CSSProperties = {
    padding: "0 10px",
    height: s.itemHeight,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: s.fontSize
  };

  const timeIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const hours = useMemo(() => (format === "24h" ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => (i + 1))), [format]);
  const minutes = useMemo(() => Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) => i * minuteStep), [minuteStep]);
  const selectedH = value ? value.getHours() : null;
  const selectedM = value ? value.getMinutes() : null;

  const minParsed = minTime ? parseTimeStr(minTime) : null;
  const maxParsed = maxTime ? parseTimeStr(maxTime) : null;
  const minMinutes = minParsed ? timeToMinutes(minParsed.h, minParsed.m) : null;
  const maxMinutes = maxParsed ? timeToMinutes(maxParsed.h, maxParsed.m) : null;

  const isDisabled = (h: number, m: number) => {
    if (typeof disabledTimes === "function" && disabledTimes(h, m)) return true;
    const mins = timeToMinutes(h, m);
    if (minMinutes !== null && mins < minMinutes) return true;
    if (maxMinutes !== null && mins > maxMinutes) return true;
    return false;
  };

  const pick = (h: number, m: number) => {
    if (isDisabled(h, m)) return;
    const base = value ? new Date(value) : new Date();
    if (format === "12h") {
      // h in 1..12; preserve AM/PM based on current value if exists, else default to AM unless h==12
      const currentH = value ? value.getHours() : 0;
      const isPM = currentH >= 12;
      const hr = (h % 12) + (isPM ? 12 : 0);
      base.setHours(hr, m, 0, 0);
    } else {
      base.setHours(h, m, 0, 0);
    }
    onChange(base, buildDetail(base));
    if (!inline) setOpen(false);
  };

  const renderHourLabel = (h: number) => (format === "24h" ? String(h).padStart(2, "0") : String(h));

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", display: inline ? "inline-block" : "inline-flex", ...style }}>
      {!inline && (
        <Input
          ref={inputRef as any}
          value={display}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          readOnly
          placeholder={placeholder}
          variant={variant}
          color={color}
          size={size}
          fullWidth={fullWidth}
          label={label}
          floatingLabel={floatingLabel}
          error={!!error}
          helperText={helperText}
          required={required}
          endAdornment={timeIcon}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="time-picker-panel"
          disabled={disabled}
        />
      )}
      {(open || inline) && (
        <div id="time-picker-panel" role="dialog" aria-label="Time picker" style={panelStyle}>
          <div style={headerStyle}>
            <div style={{ fontWeight: 600 }}>{value ? formatDisplayTime(value, format) : "Select time"}</div>
            {(clearable || showNow) && (
              <div style={{ display: "flex", gap: 8 }}>
                {clearable && (
                  <button type="button" onClick={() => onChange(null, null)} style={{ border: "none", background: "transparent", color: theme.surface.mutedText, cursor: "pointer" }}>Clear</button>
                )}
                {showNow && (
                  <button type="button" onClick={() => { const now = new Date(); onChange(now, buildDetail(now)); }} style={{ border: `1px solid ${c.border}`, background: c.main, color: "#fff", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Now</button>
                )}
              </div>
            )}
          </div>
          <div style={listStyle}>
            <div style={colStyle}>
              {hours.map((h) => {
                let actualH = h;
                if (format === "12h") {
                  // For disabled checks, convert to 24h using current period if value present; else assume AM
                  const currentH = value ? value.getHours() : 0;
                  const isPM = currentH >= 12;
                  actualH = (h % 12) + (isPM ? 12 : 0);
                  if (h === 12 && !isPM) actualH = 0;
                }
                const disabledCell = minutes.every((m) => isDisabled(actualH, m));
                const selected = selectedH === actualH;
                return (
                  <div
                    key={h}
                    aria-disabled={disabledCell}
                    aria-pressed={selected}
                    style={{ ...itemStyle, color: disabledCell ? `${theme.surface.mutedText}88` : theme.surface.headerText, background: selected ? `${c.main}22` : "transparent" }}
                      onClick={() => {
                      if (disabledCell) return;
                      const m = selectedM ?? 0;
                      pick(actualH, m);
                    }}
                    onMouseEnter={(e) => { if (!selected && !disabledCell) (e.currentTarget as HTMLDivElement).style.background = `${c.main}14`; }}
                    onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    {renderHourLabel(h)}
                  </div>
                );
              })}
            </div>
            <div style={colStyle}>
              {minutes.map((m) => {
                const h = selectedH ?? (format === "24h" ? 0 : 12);
                const disabledCell = isDisabled(h, m);
                const selected = selectedM === m;
                return (
                  <div
                    key={m}
                    aria-disabled={disabledCell}
                    aria-pressed={selected}
                    style={{ ...itemStyle, color: disabledCell ? `${theme.surface.mutedText}88` : theme.surface.headerText, background: selected ? `${c.main}22` : "transparent" }}
                    onClick={() => {
                      if (disabledCell) return;
                      pick(h, m);
                    }}
                    onMouseEnter={(e) => { if (!selected && !disabledCell) (e.currentTarget as HTMLDivElement).style.background = `${c.main}14`; }}
                    onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    {String(m).padStart(2, "0")}
                  </div>
                );
              })}
            </div>
            {format === "12h" && (
              <div style={colStyle}>
                {["AM", "PM"].map((ampm) => {
                  const isPM = ampm === "PM";
                  const h = value ? value.getHours() : 0;
                  const selected = (h >= 12) === isPM;
                  const disabledCell = false;
                  return (
                    <div
                      key={ampm}
                      aria-disabled={disabledCell}
                      aria-pressed={selected}
                      style={{ ...itemStyle, width: 56, justifyContent: "center", color: theme.surface.headerText, background: selected ? `${c.main}22` : "transparent" }}
                      onClick={() => {
                        const base = value ? new Date(value) : new Date();
                        const hr = base.getHours() % 12 + (isPM ? 12 : 0);
                        base.setHours(hr);
                        onChange(base, buildDetail(base));
                        if (!inline) setOpen(false);
                      }}
                      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLDivElement).style.background = `${c.main}14`; }}
                      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    >
                      {ampm}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDatePickerTheme } from "../theme/datePickerProvider";
import type { DatePickerColorKey } from "../theme/datePickerTypes";
import { getMonthMatrix, getWeekdayLabels, isSameDay, toDisplayString, toMonthLabel } from "../lib/dateUtils";
import { Input } from "./Input";

export type DateSelectionDetail = {
  /** day of month: 1..31 */
  day: number;
  /** month number: 1..12 */
  month: number;
  /** full year, e.g., 2025 */
  year: number;
  /** ISO date string YYYY-MM-DD for convenience */
  iso?: string;
  /** Original JS Date for backward-compatibility utilities */
  jsDate?: Date;
};

export interface DatePickerProps {
  value: Date | null;
  /**
   * onChange receives the selected date as a JS Date (1st parameter) for backward compatibility,
   * and a structured detail (2nd parameter) with day/month/year. Pass null when cleared.
   */
  onChange: (date: Date | null, detail?: DateSelectionDetail | null) => void;
  color?: DatePickerColorKey;
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "filled" | "standard";
  placeholder?: string;
  format?: (date: Date) => string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 Sunday .. 6 Saturday
  inline?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  showToday?: boolean;
  locale?: string;
  fullWidth?: boolean;
  label?: string;
  floatingLabel?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function DatePicker({
  value,
  onChange,
  color = "primary",
  size = "medium",
  variant = "outlined",
  placeholder = "Select date",
  format,
  minDate,
  maxDate,
  disabledDates,
  firstDayOfWeek = 0,
  inline = false,
  disabled = false,
  clearable = true,
  showToday = true,
  locale,
  fullWidth,
  label,
  floatingLabel,
  error,
  helperText,
  required,
  className,
  style
}: DatePickerProps) {
  const theme = useDatePickerTheme();
  const c = theme.colors[color];
  const s = theme.sizes[size];
  const [open, setOpen] = useState<boolean>(inline);
  const [viewYear, setViewYear] = useState<number>((value || new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState<number>((value || new Date()).getMonth());
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

  useEffect(() => {
    if (value) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
    }
  }, [value]);

  const display = useMemo(() => (value ? (format ? format(value) : toDisplayString(value, locale)) : ""), [value, format, locale]);

  const weeks = useMemo(() => getMonthMatrix(viewYear, viewMonth, firstDayOfWeek), [viewYear, viewMonth, firstDayOfWeek]);
  const weekdays = useMemo(() => getWeekdayLabels(firstDayOfWeek, locale), [firstDayOfWeek, locale]);

  const isDisabled = (d: Date) => {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    if (typeof disabledDates === "function" && disabledDates(d)) return true;
    return false;
  };

  const selectDate = (d: Date) => {
    if (isDisabled(d)) return;
    const js = new Date(d);
    const detail: DateSelectionDetail = {
      day: js.getDate(),
      month: js.getMonth() + 1,
      year: js.getFullYear(),
      iso: js.toISOString().slice(0, 10),
      jsDate: js
    };
    onChange(js, detail);
    if (!inline) setOpen(false);
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: s.padding,
    background: theme.surface.headerBackground,
    color: theme.surface.headerText,
    borderBottom: `1px solid ${theme.surface.border}`,
    borderTopLeftRadius: theme.radius,
    borderTopRightRadius: theme.radius,
    fontFamily: theme.fontFamily,
    fontSize: s.headerFontSize
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

  const monthGridStyle: React.CSSProperties = {
    padding: s.padding,
    fontFamily: theme.fontFamily
  };

  const navBtn: React.CSSProperties = {
    border: "none",
    background: "transparent",
    padding: 6,
    borderRadius: 6,
    cursor: "pointer",
    color: theme.surface.headerText
  };

  const dayCellBase: React.CSSProperties = {
    width: s.daySize,
    height: s.daySize,
    lineHeight: `${s.daySize}px`,
    textAlign: "center" as const,
    borderRadius: 6,
    userSelect: "none" as const,
    cursor: "pointer",
    transition: "background 150ms ease",
    fontSize: s.fontSize
  };

  const calendarIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

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
          endAdornment={calendarIcon}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="date-picker-panel"
          disabled={disabled}
        />
      )}
      {(open || inline) && (
        <div id="date-picker-panel" role="dialog" aria-label="Date picker" style={panelStyle}>
          <div style={headerStyle}>
            <button type="button" style={navBtn} onClick={() => {
              const m = new Date(viewYear, viewMonth, 1);
              m.setMonth(m.getMonth() - 1);
              setViewYear(m.getFullYear());
              setViewMonth(m.getMonth());
            }} aria-label="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div style={{ fontWeight: 600 }}>{toMonthLabel(viewYear, viewMonth, locale)}</div>
            <button type="button" style={navBtn} onClick={() => {
              const m = new Date(viewYear, viewMonth, 1);
              m.setMonth(m.getMonth() + 1);
              setViewYear(m.getFullYear());
              setViewMonth(m.getMonth());
            }} aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <div style={monthGridStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
              {weekdays.map((w) => (
                <div key={w} style={{ textAlign: "center", fontSize: s.fontSize, color: theme.surface.mutedText }}>{w}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {weeks.flat().map((d, idx) => {
                const inMonth = d.getMonth() === viewMonth;
                const selected = value ? isSameDay(d, value) : false;
                const today = isSameDay(d, new Date());
                const disabledCell = isDisabled(d);
                let style: React.CSSProperties = { ...dayCellBase, color: inMonth ? theme.surface.headerText : theme.surface.outsideText };
                if (selected) {
                  style = { ...style, background: c.main, color: "#fff" };
                } else if (!disabledCell) {
                  style = { ...style, cursor: "pointer" };
                } else {
                  style = { ...style, color: theme.surface.outsideText, opacity: 0.45, cursor: "not-allowed" };
                }
                return (
                  <div
                    key={idx}
                    role="button"
                    aria-pressed={selected}
                    aria-disabled={disabledCell}
                    onClick={() => !disabledCell && selectDate(d)}
                    onMouseEnter={(e) => {
                      if (!selected && !disabledCell) {
                        (e.currentTarget as HTMLDivElement).style.background = `${c.main}14`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                    }}
                    style={style}
                    title={today ? "Today" : undefined}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
          {(clearable || showToday) && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: s.padding, borderTop: `1px solid ${theme.surface.border}` }}>
              {clearable ? (
                <button type="button" onClick={() => onChange(null, null)} style={{ border: "none", background: "transparent", color: theme.surface.mutedText, cursor: "pointer" }}>Clear</button>
              ) : <span />}
              {showToday && (
                <button type="button" onClick={() => selectDate(new Date())} style={{ border: `1px solid ${c.border}`, background: c.main, color: "#fff", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Today</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DatePicker;

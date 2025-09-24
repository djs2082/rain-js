import React, { useId, useMemo, useRef, useState } from "react";
import { useInputTheme } from "../theme/inputProvider";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "filled" | "standard"; // visual style variants
  floatingLabel?: boolean; // label floats when focused/has value
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  showPasswordToggle?: boolean; // for type="password"
  format?: "none" | "tel" | "email" | "url"; // simple formatting/masking helpers
  telPattern?: string; // e.g., "+91 xxxx xxx" (x = digit)
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error = false,
    fullWidth = false,
    color = "primary",
    size = "medium",
    variant = "outlined",
    floatingLabel = false,
    startAdornment,
    endAdornment,
    showPasswordToggle,
    format = "none",
    telPattern,
    style,
    className,
    id,
    ...rest
  },
  ref
) {
  const theme = useInputTheme();
  const inputId = id || useId();
  const c = theme.colors[color];
  const s = theme.sizes[size];
  const isPassword = (rest.type || "text") === "password";
  const allowToggle = isPassword && (showPasswordToggle ?? true);
  const [showPwd, setShowPwd] = useState(false);

  const [focused, setFocused] = useState(false);
  const [uncontrolledVal, setUncontrolledVal] = useState<string>(
    typeof rest.defaultValue === "string" ? rest.defaultValue : ""
  );
  const isControlled = rest.value !== undefined;
  const currentValue = String((isControlled ? rest.value : uncontrolledVal) ?? "");
  const hasContent = currentValue.length > 0;

  const inputType = allowToggle ? (showPwd ? "text" : "password") : rest.type;

  const inputElRef = useRef<HTMLInputElement | null>(null);
  const setRefs = (node: HTMLInputElement | null) => {
    inputElRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref && typeof ref === "object") (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };
  const lastKeyRef = useRef<null | { key: "Backspace" | "Delete"; }>(null);

  const countDigits = (s: string) => (s.match(/\d/g) || []).length;
  const formatTelWithMask = (digits: string, mask?: string) => {
    if (!digits) return "";
    if (mask && /x/.test(mask)) {
      const maxDigits = (mask.match(/x/g) || []).length;
      const d = digits.slice(0, maxDigits);
      let out = "";
      let di = 0;
      for (let i = 0; i < mask.length; i++) {
        const ch = mask[i];
        if (ch === "x") {
          if (di < d.length) out += d[di++];
          else break;
        } else {
          out += ch;
        }
      }
      return out;
    }
    // default US-like
    const d = digits.slice(0, 10);
    const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return `(${parts[0]}`;
    if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
    return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
  };
  const caretPosForDigitCount = (digitCount: number, mask: string | undefined, digitsLen: number, formatted: string) => {
    if (!digitsLen) return 0;
    if (!mask || !/x/.test(mask)) {
      // approximate: map to end if digitCount equals digitsLen, else find positions skipping non-digits
      let seen = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen === digitCount) return i + 1;
      }
      return formatted.length;
    }
    // walk mask and count x up to digitCount
    let outIndex = 0;
    let placed = 0;
    for (let i = 0; i < mask.length; i++) {
      const ch = mask[i];
      if (ch === "x") {
        if (placed === digitCount) return outIndex; // caret before placing this digit
        placed++;
        outIndex++; // one digit placed adds one char to output
        if (placed === digitsLen && digitCount >= digitsLen) {
          // caret at end of last digit
          // advance through remaining literals until next x or end
          while (i + 1 < mask.length && mask[i + 1] !== "x") {
            i++;
            outIndex++;
          }
          return outIndex;
        }
      } else {
        outIndex++;
      }
    }
    return Math.min(outIndex, formatted.length);
  };

  const formatValue = (val: string) => {
    switch (format) {
      case "tel": {
        const digits = val.replace(/\D/g, "");
        if (typeof rest.maxLength === "number" && rest.maxLength > 0) {
          // respect provided maxLength for digits too, if any
          // note: input maxLength applies to full string; we additionally cap digits here heuristically
        }
        if (typeof rest.inputMode === "undefined") {
          // consumers get numeric keypad by default for tel
        }
        if (telPattern && /x/.test(telPattern)) {
          const maxDigits = (telPattern.match(/x/g) || []).length;
          const d = digits.slice(0, maxDigits);
          let out = "";
          let di = 0;
          for (let i = 0; i < telPattern.length; i++) {
            const ch = telPattern[i];
            if (ch === "x") {
              if (di < d.length) {
                out += d[di++];
              } else {
                break;
              }
            } else {
              out += ch;
            }
          }
          return out;
        } else {
          // default US-like formatting
          const d = digits.slice(0, 10);
          const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean);
          if (parts.length === 0) return "";
          if (parts.length === 1) return `(${parts[0]}`;
          if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
          return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
        }
      }
      case "email":
        return val.replace(/\s+/g, "").toLowerCase();
      case "url":
        return val.trim();
      case "none":
      default:
        return val;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (format === "tel") {
      const input = e.target as HTMLInputElement;
      const prevDigits = (currentValue.match(/\d/g) || []).join("");
      const selStart = input.selectionStart ?? input.value.length;
      const digitsBefore = countDigits(input.value.slice(0, selStart));
      const allDigits = input.value.replace(/\D/g, "");
      const maxDigits = telPattern && /x/.test(telPattern) ? (telPattern.match(/x/g) || []).length : 10;
      let newDigits = allDigits.slice(0, maxDigits);
      // If browser removed only a literal, enforce digit removal on backspace/delete
      if (lastKeyRef.current?.key === "Backspace" && newDigits === prevDigits) {
        const idx = Math.max(0, digitsBefore - 1);
        if (idx < prevDigits.length) newDigits = prevDigits.slice(0, idx) + prevDigits.slice(idx + 1);
      } else if (lastKeyRef.current?.key === "Delete" && newDigits === prevDigits) {
        const idx = Math.max(0, digitsBefore);
        if (idx < prevDigits.length) newDigits = prevDigits.slice(0, idx) + prevDigits.slice(idx + 1);
      }
      const formatted = formatTelWithMask(newDigits, telPattern);
      if (formatted !== input.value) {
        input.value = formatted;
      }
      if (!isControlled) setUncontrolledVal(formatted);
      rest.onChange?.(e);
      // set caret after React updates DOM
      setTimeout(() => {
        const el = inputElRef.current;
        if (!el) return;
        const targetDigitIndex = lastKeyRef.current?.key === "Backspace" ? Math.max(0, digitsBefore - 1) : digitsBefore;
        const caret = caretPosForDigitCount(targetDigitIndex, telPattern, newDigits.length, formatted);
        try { el.setSelectionRange(caret, caret); } catch {}
      }, 0);
      lastKeyRef.current = null;
      return;
    }

    if (format !== "none") {
      const raw = e.target.value;
      const next = formatValue(raw);
      if (next !== raw) {
        e.target.value = next;
      }
    }
    if (!isControlled) setUncontrolledVal(e.target.value);
    rest.onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (format === "tel") {
      if (e.key === "Backspace" || e.key === "Delete") {
        lastKeyRef.current = { key: e.key };
      } else {
        lastKeyRef.current = null;
      }
    }
    rest.onKeyDown?.(e);
  };

  const wrapperStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    gap: floatingLabel ? 6 : 4,
    width: fullWidth ? "100%" : "auto",
    fontFamily: theme.fontFamily,
    alignItems: "stretch"
  };

  const labelStyle: React.CSSProperties = floatingLabel
    ? {
        position: "absolute",
        left: startAdornment ? 36 : 12,
        top: hasContent || focused ? -8 : "50%",
        transform: hasContent || focused ? "translateY(0)" : "translateY(-50%)",
        fontSize: hasContent || focused ? "0.75rem" : s.labelFontSize,
        padding: "0 4px",
        background: theme.labelBackground ?? "transparent",
        color: theme.labelColor,
        pointerEvents: "none",
        transition: "all 150ms ease"
      }
    : {
        fontSize: s.labelFontSize,
        color: theme.labelColor
      };

  const baseInputStyle: React.CSSProperties = {
    width: fullWidth ? "100%" : undefined,
    height: s.height,
    padding: s.padding,
    fontSize: s.fontSize,
    color: c.text,
    borderRadius: theme.borderRadius,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms ease, box-shadow 150ms ease, background 150ms ease",
    fontFamily: theme.fontFamily
  };

  let inputStyle: React.CSSProperties = {};
  switch (variant) {
    case "filled":
      inputStyle = {
        background: theme.background,
        border: `${theme.borderWidth} solid ${c.border}`,
      };
      break;
    case "standard":
      inputStyle = {
        border: "none",
        borderBottom: `${theme.borderWidth} solid ${c.border}`,
        borderRadius: 0
      };
      break;
    case "outlined":
      inputStyle = {
        background: "transparent",
        border: `${theme.borderWidth} solid ${c.border}`
      };
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    const el = e.currentTarget;
    if (variant === "standard") {
      el.style.borderBottomColor = c.focus;
      el.style.boxShadow = "none";
    } else {
      el.style.borderColor = c.focus;
      el.style.boxShadow = `0 0 0 3px ${c.focus}22`;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    const el = e.currentTarget;
    if (variant === "standard") {
      el.style.borderBottomColor = c.border;
      el.style.boxShadow = "none";
    } else {
      el.style.borderColor = c.border;
      el.style.boxShadow = "none";
    }
  };

  const finalInputStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...inputStyle,
    ...(error ? { borderColor: theme.colors.error.main, boxShadow: `0 0 0 3px ${theme.colors.error.main}22` } : {}),
    ...style
  };

  const helperStyle: React.CSSProperties = {
    fontSize: s.labelFontSize,
    color: error ? (theme.colors.error.helper || theme.colors.error.main) : theme.placeholderColor,
    display: "block",
    textAlign: "left",
    marginTop: 2
  };

  return (
    <div style={wrapperStyle} className={className}>
      {!floatingLabel && label && (
        <label htmlFor={inputId} style={{ fontSize: s.labelFontSize, color: theme.labelColor, display: "block", marginBottom: 4 }}>{label}</label>
      )}
      <div style={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
        {floatingLabel && label && (
          <label htmlFor={inputId} style={{ ...labelStyle, zIndex: 1 }}>{label}</label>
        )}
        {startAdornment && (
          <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", display: "inline-flex", color: c.text }}>
            {startAdornment}
          </span>
        )}
        <input
          id={inputId}
          ref={setRefs}
          style={{
            ...finalInputStyle,
            paddingLeft: startAdornment ? 36 : 12,
            paddingRight: (allowToggle || endAdornment) ? 36 : undefined
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
          type={inputType}
          value={isControlled ? rest.value : undefined}
          defaultValue={!isControlled ? uncontrolledVal : undefined}
        />
        {(allowToggle || endAdornment) && (
          <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "inline-flex", color: c.text }}>
            {allowToggle ? (
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
              >
                {showPwd ? (
                  // eye-off icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.46-1.03 1.1-2 1.86-2.86M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-3.42"/><path d="M1 1l22 22"/><path d="M9.88 9.88 4.12 4.12"/><path d="M21.82 12A10.94 10.94 0 0 0 12 4c-1.61 0-3.14.35-4.5.98"/></svg>
                ) : (
                  // eye icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            ) : (
              endAdornment
            )}
          </span>
        )}
        {helperText && (
          <span
            style={{
              position: "absolute",
              left: startAdornment ? 36 : 12,
              top: `calc(${s.height} + 2px)`,
              zIndex: 3,
              pointerEvents: "none",
              background: "transparent",
              fontSize: s.labelFontSize,
              color: error ? (theme.colors.error.helper || theme.colors.error.main) : theme.placeholderColor,
              textAlign: "left"
            }}
          >
            {helperText}
          </span>
        )}
      </div>
      <div>Hello world</div>
    </div>
  );
});

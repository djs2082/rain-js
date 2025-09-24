import React from "react";

export type ValidatorKey =
  | "validate_email"
  | "validate_mobile"
  | "validate_password"
  | "validate_required"
  | "validate_url"
  | (string & {});

export type ValidationResult = {
  key: ValidatorKey;
  success: boolean;
  fail: boolean;
  message?: string;
};

export type ValidationRule = (value: unknown, options?: Record<string, any>) => ValidationResult;

function emailRule(value: unknown): ValidationResult {
  const v = (value ?? "").toString().trim();
  const success = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return { key: "validate_email", success, fail: !success, message: success ? undefined : "Invalid email" };
}

function mobileRule(value: unknown, options?: { minDigits?: number; maxDigits?: number; pattern?: RegExp }): ValidationResult {
  const digits = (value ?? "").toString().replace(/\D/g, "");
  const minD = options?.minDigits ?? 10;
  const maxD = options?.maxDigits ?? 15;
  const pattern = options?.pattern;
  let success = digits.length >= minD && digits.length <= maxD;
  if (pattern) success = pattern.test((value ?? "").toString());
  return { key: "validate_mobile", success, fail: !success, message: success ? undefined : "Invalid mobile number" };
}

function passwordRule(
  value: unknown,
  options?: { minLength?: number; requireUpper?: boolean; requireLower?: boolean; requireNumber?: boolean; requireSpecial?: boolean }
): ValidationResult {
  const v = (value ?? "").toString();
  const cfg = {
    minLength: 8,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSpecial: false,
    ...(options || {})
  };
  const checks: Array<{ ok: boolean; msg: string }> = [
    { ok: v.length >= cfg.minLength, msg: `Minimum ${cfg.minLength} characters required` },
    { ok: !cfg.requireUpper || /[A-Z]/.test(v), msg: "At least one uppercase letter required" },
    { ok: !cfg.requireLower || /[a-z]/.test(v), msg: "At least one lowercase letter required" },
    { ok: !cfg.requireNumber || /[0-9]/.test(v), msg: "At least one number required" },
    { ok: !cfg.requireSpecial || /[^A-Za-z0-9]/.test(v), msg: "At least one special character required" }
  ];
  const firstFail = checks.find(c => !c.ok);
  const success = !firstFail;
  return { key: "validate_password", success, fail: !success, message: success ? undefined : firstFail?.msg };
}

function requiredRule(value: unknown): ValidationResult {
  const v = value as any;
  const success = !(v === undefined || v === null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0));
  return { key: "validate_required", success, fail: !success, message: success ? undefined : "This field is required" };
}

function urlRule(value: unknown): ValidationResult {
  const v = (value ?? "").toString().trim();
  let success = false;
  if (!v) success = false;
  else {
    try {
      // Allow implicit http(s)
      // eslint-disable-next-line no-new
      new URL(v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v}`);
      success = true;
    } catch {
      success = false;
    }
  }
  return { key: "validate_url", success, fail: !success, message: success ? undefined : "Invalid URL" };
}

const defaultRules: Record<string, ValidationRule> = {
  validate_email: emailRule,
  validate_mobile: mobileRule,
  validate_password: passwordRule,
  validate_required: requiredRule,
  validate_url: urlRule
};

export function useFormFieldValidator(initialRules?: Partial<Record<ValidatorKey, ValidationRule>>) {
  const rulesRef = React.useRef<Record<string, ValidationRule>>(
    (() => {
      const base: Record<string, ValidationRule> = { ...defaultRules };
      if (initialRules) {
        for (const [k, v] of Object.entries(initialRules)) {
          if (v) base[k] = v;
        }
      }
      return base;
    })()
  );

  const validate = React.useCallback(
    (key: ValidatorKey, value: unknown, options?: Record<string, any>): ValidationResult => {
      const fn = rulesRef.current[String(key)];
  if (!fn) return { key, success: false, fail: true, message: `Unknown validator: ${key}` };
      return fn(value, options);
    },
    []
  );

  const addRule = React.useCallback((key: ValidatorKey, rule: ValidationRule) => {
    rulesRef.current[String(key)] = rule;
  }, []);

  const removeRule = React.useCallback((key: ValidatorKey) => {
    delete rulesRef.current[String(key)];
  }, []);

  return { validate, addRule, removeRule } as const;
}

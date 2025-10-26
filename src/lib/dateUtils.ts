export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function addDays(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + delta);
  return x;
}

export function clampDate(d: Date, min?: Date, max?: Date): Date {
  if (min && d < min) return min;
  if (max && d > max) return max;
  return d;
}

export function getMonthMatrix(year: number, month: number, firstDayOfWeek: number): Date[][] {
  // month is 0-based
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7; // 0..6
  const startDate = addDays(firstOfMonth, -startWeekday);
  const weeks: Date[][] = [];
  let current = startDate;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(current));
      current = addDays(current, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export function toDisplayString(date: Date, locale?: string): string {
  try {
    return date.toLocaleDateString(locale || undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
}

export function toMonthLabel(year: number, month: number, locale?: string): string {
  const d = new Date(year, month, 1);
  try {
    return d.toLocaleDateString(locale || undefined, { month: "long", year: "numeric" });
  } catch {
    return `${d.toLocaleString(undefined, { month: "long" })} ${year}`;
  }
}

export function getWeekdayLabels(firstDayOfWeek: number, locale?: string): string[] {
  const base = new Date(2021, 0, 3); // Sunday
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(base, (firstDayOfWeek + i) % 7);
    try {
      out.push(d.toLocaleDateString(locale || undefined, { weekday: "short" }));
    } catch {
      out.push(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][(firstDayOfWeek + i) % 7]);
    }
  }
  return out;
}

export function parseTimeStr(s: string): { h: number; m: number } | null {
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if (isNaN(h) || isNaN(mm)) return null;
  return { h, m: mm };
}

export function timeToMinutes(h: number, m: number): number {
  return h * 60 + m;
}

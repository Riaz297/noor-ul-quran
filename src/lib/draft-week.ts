import {
  readAttendanceDraft,
  readHomeAnswers,
  readSabaqPages,
  type AttendanceDraft,
  type HomeAnswers,
  type SabaqPages,
} from "@/lib/draft-daily";

export const DAILY_HISTORY_KEY = "noor-ul-quran-daily-history";
export const WEEKLY_CHECK_KEY = "noor-ul-quran-weekly-check-draft";
export const MONTHLY_CHECK_KEY = "noor-ul-quran-monthly-check-draft";

export type DayHistory = {
  attendance?: AttendanceDraft;
  homework?: HomeAnswers;
  sabaq?: SabaqPages;
};

export type DailyHistory = Record<string, DayHistory>;

export type WeekRow = {
  name: string;
  absentDates: string[];
  notReviewedDates: string[];
  lastPage: string;
};

export function dateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function lastSevenKeys(): string[] {
  const keys: string[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    keys.push(dateKey(date));
  }
  return keys;
}

export function monthKeys(): string[] {
  const today = new Date();
  const keys: string[] = [];
  for (let day = 1; day <= today.getDate(); day += 1) {
    keys.push(dateKey(new Date(today.getFullYear(), today.getMonth(), day)));
  }
  return keys;
}

function readHistory(): DailyHistory {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(DAILY_HISTORY_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as DailyHistory;
  } catch {
    return {};
  }
}

function writeHistory(history: DailyHistory) {
  window.localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
}

export function stampToday() {
  if (typeof window === "undefined") return;
  const key = dateKey();
  const history = readHistory();
  const day = history[key] ?? {};
  const attendance = readAttendanceDraft();
  if (attendance.finalized) day.attendance = attendance;
  const homework = readHomeAnswers();
  if (Object.keys(homework).length > 0) day.homework = homework;
  const sabaq = readSabaqPages();
  if (Object.keys(sabaq).length > 0) day.sabaq = sabaq;
  history[key] = day;
  writeHistory(history);
}

export function weekRangeLabel(locale: string): string {
  const keys = lastSevenKeys();
  const start = new Date(`${keys[0]}T00:00:00`);
  const end = new Date(`${keys[keys.length - 1]}T00:00:00`);
  return `${start.toLocaleDateString(locale)} — ${end.toLocaleDateString(locale)}`;
}

function rowsForKeys(names: string[], keys: string[]): WeekRow[] {
  stampToday();
  const history = readHistory();
  return names.map((name) => {
    const absentDates: string[] = [];
    const notReviewedDates: string[] = [];
    let lastPage = "";
    for (const key of keys) {
      const day = history[key];
      if (!day) continue;
      const row = day.attendance?.finalized
        ? day.attendance.rows.find((item) => item.name === name)
        : undefined;
      if (row?.absent) absentDates.push(key);
      if (day.homework?.[name] === "no") notReviewedDates.push(key);
      const page = day.sabaq?.[name]?.trim();
      if (page) lastPage = page;
    }
    return { name, absentDates, notReviewedDates, lastPage };
  });
}

export function readWeekRows(names: string[]): WeekRow[] {
  return rowsForKeys(names, lastSevenKeys());
}

export function readMonthRows(names: string[]): WeekRow[] {
  return rowsForKeys(names, monthKeys());
}

export function monthRangeLabel(locale: string): string {
  const keys = monthKeys();
  const start = new Date(`${keys[0]}T00:00:00`);
  const end = new Date(`${keys[keys.length - 1]}T00:00:00`);
  return `${start.toLocaleDateString(locale)} — ${end.toLocaleDateString(locale)}`;
}

export function readWeeklyChecked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(WEEKLY_CHECK_KEY) === "yes";
}

export function writeWeeklyChecked(checked: boolean) {
  window.localStorage.setItem(WEEKLY_CHECK_KEY, checked ? "yes" : "no");
}

export function readMonthlyChecked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MONTHLY_CHECK_KEY) === "yes";
}

export function writeMonthlyChecked(checked: boolean) {
  window.localStorage.setItem(MONTHLY_CHECK_KEY, checked ? "yes" : "no");
}

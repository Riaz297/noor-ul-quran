export const ATTENDANCE_STORAGE_KEY = "noor-ul-quran-attendance-draft";
export const HOME_SABAQ_KEY = "noor-ul-quran-ghar-sabaq-draft";
export const SABAQ_KEY = "noor-ul-quran-sabaq-draft";
export const REPORT_CHECK_KEY = "noor-ul-quran-report-check-draft";

export type AttendanceRow = {
  name: string;
  absent: boolean;
  reason: string;
};

export type AttendanceDraft = {
  finalized: boolean;
  rows: AttendanceRow[];
};

export type HomeAnswer = "yes" | "no";
export type HomeAnswers = Record<string, HomeAnswer>;

export function readAttendanceDraft(): AttendanceDraft {
  if (typeof window === "undefined") return { finalized: false, rows: [] };
  const raw = window.localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (!raw) return { finalized: false, rows: [] };
  try {
    const parsed = JSON.parse(raw) as AttendanceDraft;
    if (!parsed || !Array.isArray(parsed.rows)) {
      return { finalized: false, rows: [] };
    }
    return {
      finalized: Boolean(parsed.finalized),
      rows: parsed.rows.filter(
        (row) => row && typeof row.name === "string",
      ),
    };
  } catch {
    return { finalized: false, rows: [] };
  }
}

export function writeAttendanceDraft(draft: AttendanceDraft) {
  window.localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(draft));
  if (draft.finalized) {
    void import("@/lib/draft-week").then((mod) => mod.stampToday());
  }
}

export function readHomeAnswers(): HomeAnswers {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(HOME_SABAQ_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as HomeAnswers;
  } catch {
    return {};
  }
}

export function writeHomeAnswers(answers: HomeAnswers) {
  window.localStorage.setItem(HOME_SABAQ_KEY, JSON.stringify(answers));
  void import("@/lib/draft-week").then((mod) => mod.stampToday());
}

export type SabaqPages = Record<string, string>;

export function readSabaqPages(): SabaqPages {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(SABAQ_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as SabaqPages;
  } catch {
    return {};
  }
}

export function writeSabaqPages(pages: SabaqPages) {
  window.localStorage.setItem(SABAQ_KEY, JSON.stringify(pages));
  void import("@/lib/draft-week").then((mod) => mod.stampToday());
}

export function readReportChecked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(REPORT_CHECK_KEY) === "yes";
}

export function writeReportChecked(checked: boolean) {
  window.localStorage.setItem(REPORT_CHECK_KEY, checked ? "yes" : "no");
}

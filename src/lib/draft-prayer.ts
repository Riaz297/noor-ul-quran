export const PRAYER_STORAGE_KEY = "noor-ul-quran-prayer-draft";

export const PRAYER_IDS = ["fajr", "zuhr", "asr", "maghrib", "isha"] as const;
export type PrayerId = (typeof PRAYER_IDS)[number];

export type PrayerStatus = "" | "done" | "missed" | "unknown" | "not_yet";
export type PrayerRow = Record<PrayerId, PrayerStatus>;
export type PrayerDraft = Record<string, PrayerRow>;

const STATUSES: PrayerStatus[] = ["", "done", "missed", "unknown", "not_yet"];

function emptyRow(): PrayerRow {
  return {
    fajr: "",
    zuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
  };
}

function asStatus(value: unknown): PrayerStatus {
  return STATUSES.includes(value as PrayerStatus) ? (value as PrayerStatus) : "";
}

export function readPrayerDraft(): PrayerDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(PRAYER_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const next: PrayerDraft = {};
    for (const [name, row] of Object.entries(parsed as Record<string, unknown>)) {
      if (!row || typeof row !== "object") continue;
      const source = row as Record<string, unknown>;
      next[name] = {
        fajr: asStatus(source.fajr),
        zuhr: asStatus(source.zuhr),
        asr: asStatus(source.asr),
        maghrib: asStatus(source.maghrib),
        isha: asStatus(source.isha),
      };
    }
    return next;
  } catch {
    return {};
  }
}

export function writePrayerDraft(draft: PrayerDraft) {
  window.localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(draft));
}

export function rowFor(draft: PrayerDraft, name: string): PrayerRow {
  return draft[name] ?? emptyRow();
}

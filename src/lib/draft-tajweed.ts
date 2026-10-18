export const TAJWEED_STORAGE_KEY = "noor-ul-quran-tajweed-draft";

export const TAJWEED_IDS = [
  "makharij",
  "izhar",
  "idgham",
  "iqlab",
  "ikhfa",
  "madd",
  "ghunnah",
] as const;
export type TajweedId = (typeof TAJWEED_IDS)[number];

export type TajweedStatus = "not_learned" | "read" | "memorized" | "recited";
export type TajweedRow = Record<TajweedId, TajweedStatus>;
export type TajweedDraft = Record<string, TajweedRow>;

const STATUSES: TajweedStatus[] = [
  "not_learned",
  "read",
  "memorized",
  "recited",
];

function emptyRow(): TajweedRow {
  return {
    makharij: "not_learned",
    izhar: "not_learned",
    idgham: "not_learned",
    iqlab: "not_learned",
    ikhfa: "not_learned",
    madd: "not_learned",
    ghunnah: "not_learned",
  };
}

function asStatus(value: unknown): TajweedStatus {
  return STATUSES.includes(value as TajweedStatus)
    ? (value as TajweedStatus)
    : "not_learned";
}

export function readTajweedDraft(): TajweedDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(TAJWEED_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const next: TajweedDraft = {};
    for (const [name, row] of Object.entries(parsed as Record<string, unknown>)) {
      if (!row || typeof row !== "object") continue;
      const source = row as Record<string, unknown>;
      next[name] = {
        makharij: asStatus(source.makharij),
        izhar: asStatus(source.izhar),
        idgham: asStatus(source.idgham),
        iqlab: asStatus(source.iqlab),
        ikhfa: asStatus(source.ikhfa),
        madd: asStatus(source.madd),
        ghunnah: asStatus(source.ghunnah),
      };
    }
    return next;
  } catch {
    return {};
  }
}

export function writeTajweedDraft(draft: TajweedDraft) {
  window.localStorage.setItem(TAJWEED_STORAGE_KEY, JSON.stringify(draft));
}

export function tajweedRowFor(draft: TajweedDraft, name: string): TajweedRow {
  return draft[name] ?? emptyRow();
}

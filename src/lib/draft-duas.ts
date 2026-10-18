export const DUAS_STORAGE_KEY = "noor-ul-quran-duas-draft";

export const DUA_IDS = [
  "enterMasjid",
  "leaveMasjid",
  "enterHome",
  "leaveHome",
  "beforeFood",
  "afterFood",
  "sleep",
  "wake",
] as const;
export type DuaId = (typeof DUA_IDS)[number];

export type DuaStatus = "not_learned" | "read" | "memorized" | "recited";
export type DuaRow = Record<DuaId, DuaStatus>;
export type DuaDraft = Record<string, DuaRow>;

const STATUSES: DuaStatus[] = ["not_learned", "read", "memorized", "recited"];

function emptyRow(): DuaRow {
  return {
    enterMasjid: "not_learned",
    leaveMasjid: "not_learned",
    enterHome: "not_learned",
    leaveHome: "not_learned",
    beforeFood: "not_learned",
    afterFood: "not_learned",
    sleep: "not_learned",
    wake: "not_learned",
  };
}

function asStatus(value: unknown): DuaStatus {
  return STATUSES.includes(value as DuaStatus)
    ? (value as DuaStatus)
    : "not_learned";
}

export function readDuaDraft(): DuaDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(DUAS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const next: DuaDraft = {};
    for (const [name, row] of Object.entries(parsed as Record<string, unknown>)) {
      if (!row || typeof row !== "object") continue;
      const source = row as Record<string, unknown>;
      next[name] = {
        enterMasjid: asStatus(source.enterMasjid),
        leaveMasjid: asStatus(source.leaveMasjid),
        enterHome: asStatus(source.enterHome),
        leaveHome: asStatus(source.leaveHome),
        beforeFood: asStatus(source.beforeFood),
        afterFood: asStatus(source.afterFood),
        sleep: asStatus(source.sleep),
        wake: asStatus(source.wake),
      };
    }
    return next;
  } catch {
    return {};
  }
}

export function writeDuaDraft(draft: DuaDraft) {
  window.localStorage.setItem(DUAS_STORAGE_KEY, JSON.stringify(draft));
}

export function duaRowFor(draft: DuaDraft, name: string): DuaRow {
  return draft[name] ?? emptyRow();
}

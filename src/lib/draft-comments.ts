export const COMMENTS_STORAGE_KEY = "noor-ul-quran-comments-draft";

export type StudentComment = {
  text: string;
  at: string;
};

export type CommentDraft = Record<string, StudentComment>;

export function readComments(): CommentDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const next: CommentDraft = {};
    for (const [name, row] of Object.entries(parsed as Record<string, unknown>)) {
      if (!row || typeof row !== "object") continue;
      const source = row as { text?: unknown; at?: unknown };
      if (typeof source.text !== "string" || !source.text.trim()) continue;
      next[name] = {
        text: source.text.trim(),
        at: typeof source.at === "string" ? source.at : "",
      };
    }
    return next;
  } catch {
    return {};
  }
}

export function writeComments(draft: CommentDraft) {
  window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(draft));
}

export function commentFor(name: string): StudentComment | null {
  return readComments()[name] ?? null;
}

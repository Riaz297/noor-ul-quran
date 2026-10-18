export const CONTACT_STORAGE_KEY = "noor-ul-quran-contact-draft";

export type ContactRequest = {
  id: string;
  student: string;
  message: string;
};

export function readContactRequests(): ContactRequest[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ContactRequest =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.student === "string" &&
            typeof item.message === "string",
        ),
    );
  } catch {
    return [];
  }
}

export function writeContactRequests(requests: ContactRequest[]) {
  window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(requests));
}

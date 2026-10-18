export const STUDENTS_STORAGE_KEY = "noor-ul-quran-students-draft";

export const STUDENT_GROUPS = ["boys_morning", "girls_home"] as const;
export type StudentGroup = "" | (typeof STUDENT_GROUPS)[number];

export type DraftStudent = {
  name: string;
  guardian: string;
  group: StudentGroup;
  phone: string;
};

function asGroup(value: unknown): StudentGroup {
  return value === "boys_morning" || value === "girls_home" ? value : "";
}

function parseStudents(raw: string | null): DraftStudent[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const rows: DraftStudent[] = [];
    for (const item of parsed) {
      if (typeof item === "string" && item.trim()) {
        rows.push({ name: item, guardian: "", group: "", phone: "" });
        continue;
      }
      if (item && typeof item === "object" && "name" in item) {
        const name = String((item as { name: unknown }).name ?? "").trim();
        if (!name) continue;
        const guardian =
          "guardian" in item
            ? String((item as { guardian: unknown }).guardian ?? "").trim()
            : "";
        const group = asGroup(
          "group" in item ? (item as { group: unknown }).group : "",
        );
        const phone =
          "phone" in item
            ? String((item as { phone: unknown }).phone ?? "").trim()
            : "";
        rows.push({ name, guardian, group, phone });
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export function readDraftStudentRecords(): DraftStudent[] {
  if (typeof window === "undefined") return [];
  return parseStudents(window.localStorage.getItem(STUDENTS_STORAGE_KEY));
}

export function readDraftStudents(): string[] {
  return readDraftStudentRecords().map((row) => row.name);
}

export function writeDraftStudentRecords(students: DraftStudent[]) {
  window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

export function guardianFor(name: string): string {
  return (
    readDraftStudentRecords().find((row) => row.name === name)?.guardian ?? ""
  );
}

export function phoneFor(name: string): string {
  return readDraftStudentRecords().find((row) => row.name === name)?.phone ?? "";
}

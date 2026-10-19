import {
  readAttendanceDraft,
  readHomeAnswers,
  readSabaqPages,
} from "@/lib/draft-daily";
import { readDraftStudents } from "@/lib/draft-students";

export type HomeOverview = {
  students: number;
  attendanceReady: boolean;
  present: number;
  absent: number;
  sabaqMissing: number;
  homeworkMissing: number;
  homeworkNo: number;
};

export function readHomeOverview(): HomeOverview {
  const names = readDraftStudents();
  const attendance = readAttendanceDraft();
  const pages = readSabaqPages();
  const homework = readHomeAnswers();
  const present = attendance.finalized
    ? attendance.rows.filter((row) => names.includes(row.name) && !row.absent)
        .length
    : 0;
  const absent = attendance.finalized
    ? attendance.rows.filter((row) => names.includes(row.name) && row.absent)
        .length
    : 0;

  return {
    students: names.length,
    attendanceReady: attendance.finalized,
    present,
    absent,
    sabaqMissing: names.filter((name) => !pages[name]?.trim()).length,
    homeworkMissing: names.filter(
      (name) => homework[name] !== "yes" && homework[name] !== "no",
    ).length,
    homeworkNo: names.filter((name) => homework[name] === "no").length,
  };
}

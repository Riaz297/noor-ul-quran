"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readAttendanceDraft,
  readHomeAnswers,
  readSabaqPages,
} from "@/lib/draft-daily";
import { commentFor, type StudentComment } from "@/lib/draft-comments";
import {
  guardianFor,
  readDraftStudentRecords,
  type DraftStudent,
} from "@/lib/draft-students";

export default function ParentsPage() {
  const { t, lang } = useLanguage();
  const [students, setStudents] = useState<DraftStudent[]>([]);
  const [name, setName] = useState("");
  const [present, setPresent] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [page, setPage] = useState("");
  const [home, setHome] = useState<string>("");
  const [comment, setComment] = useState<StudentComment | null>(null);

  function load(studentName: string) {
    const attendance = readAttendanceDraft();
    const row = attendance.rows.find((item) => item.name === studentName);
    if (!attendance.finalized || !row) {
      setPresent(null);
      setReason("");
    } else {
      setPresent(row.absent ? "absent" : "present");
      setReason(row.reason);
    }
    setPage(readSabaqPages()[studentName] ?? "");
    const answer = readHomeAnswers()[studentName];
    setHome(answer === "yes" || answer === "no" ? answer : "");
    setComment(commentFor(studentName));
  }

  useEffect(() => {
    const list = readDraftStudentRecords();
    setStudents(list);
    const first = list[0]?.name ?? "";
    setName(first);
    if (first) load(first);
  }, []);

  const current = students.find((row) => row.name === name);

  return (
    <main className="page">
      <div className="topbar">
        <p>
          <Link href="/">← {t.home}</Link>
        </p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.parents}</h1>
      <section className="card">
        <p>{t.parentsIntro}</p>
        <p className="note">{t.parentsNote}</p>

        {students.length === 0 ? (
          <p className="note">
            {t.noStudentsForParents} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <>
            <div className="form">
            <label htmlFor="parent-student">{t.students}</label>
            <select
              id="parent-student"
              className="field"
              value={name}
              onChange={(event) => {
                const next = event.target.value;
                setName(next);
                load(next);
              }}
            >
              {students.map((row) => (
                <option key={row.name} value={row.name}>
                  {row.name}
                </option>
              ))}
            </select>
            </div>

            <ul className="list">
              <li>
                <b>{t.guardianLabel}</b>
                <div className="note">
                  {guardianFor(name) || t.guardianMissing}
                </div>
              </li>
              <li>
                <b>{t.groupLabel}</b>
                <div className="note">
                  {current?.group === "boys_morning"
                    ? t.groupBoys
                    : current?.group === "girls_home"
                      ? t.groupGirls
                      : t.groupEmpty}
                </div>
              </li>
              <li>
                <b>{t.attendance}</b>
                <div className="note">
                  {present === "absent"
                    ? `${t.absent}${reason ? ` — ${reason}` : ""}`
                    : present === "present"
                      ? t.present
                      : t.parentNoAttendance}
                </div>
              </li>
              <li>
                <b>{t.sabaq}</b>
                <div className="note">
                  {page ? `${t.pageNumber}: ${page}` : t.parentNoSabaq}
                </div>
              </li>
              <li>
                <b>{t.homework}</b>
                <div className="note">
                  {home === "yes"
                    ? t.homeworkYes
                    : home === "no"
                      ? t.homeworkNo
                      : t.parentNoHomework}
                </div>
              </li>
              <li>
                <b>{t.comments}</b>
                {comment ? (
                  <>
                    <div className="note">{comment.text}</div>
                    <div className="note">
                      {t.commentByTeacher}
                      {comment.at
                        ? ` — ${new Date(comment.at).toLocaleString(
                            lang === "ur" ? "ur-PK" : "en",
                          )}`
                        : ""}
                    </div>
                  </>
                ) : (
                  <div className="note">{t.parentNoComment}</div>
                )}
              </li>
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

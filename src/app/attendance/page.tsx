"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readAttendanceDraft,
  writeAttendanceDraft,
  type AttendanceRow,
} from "@/lib/draft-daily";
import { readDraftStudents } from "@/lib/draft-students";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    const names = readDraftStudents();
    const draft = readAttendanceDraft();
    setRows(
      names.map((name) => {
        const prev = draft.rows.find((row) => row.name === name);
        return prev ?? { name, absent: false, reason: "" };
      }),
    );
    setFinalized(draft.finalized);
  }, []);

  function toggleAbsent(index: number) {
    if (finalized) return;
    setRows((current) =>
      current.map((row, i) =>
        i === index ? { ...row, absent: !row.absent } : row,
      ),
    );
  }

  function setReason(index: number, reason: string) {
    if (finalized) return;
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, reason } : row)),
    );
  }

  return (
    <main className="page">
      <div className="topbar">
        <p>
          <Link href="/">← {t.home}</Link>
        </p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.attendance}</h1>
      <section className="card">
        <p>{t.attendanceIntro}</p>
        <p className="note">{t.attendanceNote}</p>

        {rows.length === 0 ? (
          <p className="note">
            {t.noStudentsForAttendance}{" "}
            <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <>
            <ul className="list">
              {rows.map((row, index) => (
                <li key={`${row.name}-${index}`}>
                  <label className="attend-row">
                    <input
                      type="checkbox"
                      checked={row.absent}
                      disabled={finalized}
                      onChange={() => toggleAbsent(index)}
                    />
                    <span>
                      <b>{row.name}</b>
                      <div className="note">
                        {row.absent ? t.absent : t.present}
                      </div>
                    </span>
                  </label>
                  {row.absent ? (
                    <input
                      className="field"
                      value={row.reason}
                      disabled={finalized}
                      onChange={(event) => setReason(index, event.target.value)}
                      placeholder={t.reasonOptional}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            {finalized ? (
              <p className="note">{t.attendanceFinal}</p>
            ) : (
              <button
                className="primary"
                type="button"
                onClick={() => {
                  writeAttendanceDraft({ finalized: true, rows });
                  setFinalized(true);
                }}
              >
                {t.confirmAttendance}
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

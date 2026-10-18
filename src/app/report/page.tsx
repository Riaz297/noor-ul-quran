"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readAttendanceDraft,
  readHomeAnswers,
  readReportChecked,
  writeReportChecked,
  type AttendanceRow,
  type HomeAnswers,
} from "@/lib/draft-daily";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { guardianFor, phoneFor } from "@/lib/draft-students";

export default function ReportPage() {
  const { t } = useLanguage();
  const [attendanceReady, setAttendanceReady] = useState(false);
  const [absentees, setAbsentees] = useState<AttendanceRow[]>([]);
  const [notReviewed, setNotReviewed] = useState<string[]>([]);
  const [homeworkReady, setHomeworkReady] = useState(false);
  const [lookedTwice, setLookedTwice] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const attendance = readAttendanceDraft();
    const answers: HomeAnswers = readHomeAnswers();
    setAttendanceReady(attendance.finalized);
    setAbsentees(attendance.finalized ? attendance.rows.filter((row) => row.absent) : []);
    setHomeworkReady(Object.keys(answers).length > 0);
    setNotReviewed(
      Object.entries(answers)
        .filter(([, answer]) => answer === "no")
        .map(([name]) => name),
    );
    setConfirmed(readReportChecked());
  }, []);

  function onConfirm(event: FormEvent) {
    event.preventDefault();
    if (!lookedTwice) return;
    writeReportChecked(true);
    setConfirmed(true);
  }

  return (
    <main className="page">
      <div className="topbar">
        <p>
          <Link href="/">← {t.home}</Link>
        </p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.report}</h1>
      <section className="card">
        <p>{t.reportIntro}</p>
        <p className="note">{t.reportNote}</p>

        <h2 className="section-title">{t.absent}</h2>
        {!attendanceReady ? (
          <p className="note">
            {t.reportNeedAttendance}{" "}
            <Link href="/attendance">{t.attendance}</Link>
          </p>
        ) : absentees.length === 0 ? (
          <p className="note">{t.reportNoAbsent}</p>
        ) : (
          <ul className="list">
            {absentees.map((row) => (
              <li key={row.name}>
                <b>{row.name}</b>
                <div className="note">
                  {t.guardianLabel}: {guardianFor(row.name) || t.guardianMissing}
                </div>
                <div className="note">
                  {t.phoneLabel}: {phoneFor(row.name) || t.phoneMissing}
                </div>
                {row.reason ? <div className="note">{row.reason}</div> : null}
                {confirmed ? (
                  <WhatsAppLink
                    name={row.name}
                    text={t.waAbsent.replace("{name}", row.name)}
                    openLabel={t.waOpen}
                    missingLabel={t.waNoPhone}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <h2 className="section-title">{t.reportNotReviewed}</h2>
        {!homeworkReady ? (
          <p className="note">
            {t.reportNeedHomework} <Link href="/homework">{t.homework}</Link>
          </p>
        ) : notReviewed.length === 0 ? (
          <p className="note">{t.reportAllReviewed}</p>
        ) : (
          <ul className="list">
            {notReviewed.map((name) => (
              <li key={name}>
                <b>{name}</b>
                <div className="note">
                  {t.guardianLabel}: {guardianFor(name) || t.guardianMissing}
                </div>
                <div className="note">
                  {t.phoneLabel}: {phoneFor(name) || t.phoneMissing}
                </div>
                {confirmed ? (
                  <WhatsAppLink
                    name={name}
                    text={t.waHomework.replace("{name}", name)}
                    openLabel={t.waOpen}
                    missingLabel={t.waNoPhone}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {confirmed ? (
          <p className="note">{t.reportConfirmed}</p>
        ) : (
          <form className="form" onSubmit={onConfirm}>
            <label className="attend-row">
              <input
                type="checkbox"
                checked={lookedTwice}
                onChange={(event) => setLookedTwice(event.target.checked)}
              />
              <span>{t.reportDoubleCheck}</span>
            </label>
            <button className="primary" type="submit" disabled={!lookedTwice}>
              {t.confirmReport}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

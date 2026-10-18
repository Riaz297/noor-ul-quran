"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { commentFor } from "@/lib/draft-comments";
import {
  guardianFor,
  phoneFor,
  readDraftStudents,
} from "@/lib/draft-students";
import {
  monthRangeLabel,
  readMonthRows,
  readMonthlyChecked,
  writeMonthlyChecked,
  type WeekRow,
} from "@/lib/draft-week";

export default function MonthlyPage() {
  const { t, lang } = useLanguage();
  const [rows, setRows] = useState<WeekRow[]>([]);
  const [range, setRange] = useState("");
  const [lookedTwice, setLookedTwice] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const names = readDraftStudents();
    setRows(readMonthRows(names));
    setRange(monthRangeLabel(lang === "ur" ? "ur-PK" : "en"));
    setConfirmed(readMonthlyChecked());
  }, [lang]);

  function onConfirm(event: FormEvent) {
    event.preventDefault();
    if (!lookedTwice) return;
    writeMonthlyChecked(true);
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
      <h1 className="brand">{t.monthly}</h1>
      <section className="card">
        <p>{t.monthlyIntro}</p>
        <p className="note">{t.monthlyNote}</p>
        {range ? (
          <p className="note">
            {t.weeklyRange}: {range}
          </p>
        ) : null}

        {rows.length === 0 ? (
          <p className="note">
            {t.noStudentsForMonthly} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <ul className="list">
            {rows.map((row) => {
              const comment = commentFor(row.name);
              return (
                <li key={row.name}>
                  <b>{row.name}</b>
                  <div className="note">
                    {t.guardianLabel}: {guardianFor(row.name) || t.guardianMissing}
                  </div>
                  <div className="note">
                    {t.phoneLabel}: {phoneFor(row.name) || t.phoneMissing}
                  </div>
                  <div className="note">
                    {t.absent}:{" "}
                    {row.absentDates.length > 0
                      ? `${row.absentDates.length} — ${row.absentDates.join("، ")}`
                      : t.monthlyNoAbsent}
                  </div>
                  <div className="note">
                    {t.reportNotReviewed}:{" "}
                    {row.notReviewedDates.length > 0
                      ? `${row.notReviewedDates.length} — ${row.notReviewedDates.join("، ")}`
                      : t.monthlyAllReviewed}
                  </div>
                  <div className="note">
                    {t.sabaq}:{" "}
                    {row.lastPage
                      ? `${t.pageNumber} ${row.lastPage}`
                      : t.parentNoSabaq}
                  </div>
                  <div className="note">
                    {t.comments}: {comment?.text || t.parentNoComment}
                  </div>
                  {confirmed &&
                  (row.absentDates.length > 0 ||
                    row.notReviewedDates.length > 0) ? (
                    <WhatsAppLink
                      name={row.name}
                      text={t.waMonthly
                        .replace("{name}", row.name)
                        .replace("{absent}", String(row.absentDates.length))
                        .replace(
                          "{homework}",
                          String(row.notReviewedDates.length),
                        )}
                      openLabel={t.waOpen}
                      missingLabel={t.waNoPhone}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        {rows.length > 0 && !confirmed ? (
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
        ) : null}
        {confirmed ? <p className="note">{t.monthlyConfirmed}</p> : null}
      </section>
    </main>
  );
}

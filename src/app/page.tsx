"use client";

import Link from "next/link";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="page">
      <div className="topbar">
        <p className="en">Noor-ul-Quran</p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.appName}</h1>
      <section className="card">
        <p>{t.tagline}</p>
        <p className="note">{t.homeNote}</p>
        <ul className="list">
          <li>
            <Link href="/students">
              <b>{t.students}</b>
              <div className="note">{t.studentsHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/attendance">
              <b>{t.attendance}</b>
              <div className="note">{t.attendanceHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/sabaq">
              <b>{t.sabaq}</b>
              <div className="note">{t.sabaqHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/homework">
              <b>{t.homework}</b>
              <div className="note">{t.homeworkHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/report">
              <b>{t.report}</b>
              <div className="note">{t.reportHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/prayer">
              <b>{t.prayer}</b>
              <div className="note">{t.prayerHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/duas">
              <b>{t.duas}</b>
              <div className="note">{t.duasHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <b>{t.contact}</b>
              <div className="note">{t.contactHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/parents">
              <b>{t.parents}</b>
              <div className="note">{t.parentsHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/comments">
              <b>{t.comments}</b>
              <div className="note">{t.commentsHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/weekly">
              <b>{t.weekly}</b>
              <div className="note">{t.weeklyHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/monthly">
              <b>{t.monthly}</b>
              <div className="note">{t.monthlyHint}</div>
            </Link>
          </li>
          <li>
            <Link href="/tajweed">
              <b>{t.tajweed}</b>
              <div className="note">{t.tajweedHint}</div>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

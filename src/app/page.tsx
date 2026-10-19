"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import { readHomeOverview, type HomeOverview } from "@/lib/home-overview";

function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#1b5e4a" />
      <path
        d="M14 34V16l10-6 10 6v18"
        fill="none"
        stroke="#c4a35a"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M19 34v-8h10v8"
        fill="none"
        stroke="#fffdf6"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg className="quick-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 18c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14.6 18c.4-2.2 1.8-3.4 3.8-3.4 1.2 0 2.2.4 2.9 1.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="quick-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.2 10.5 15 16 9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="quick-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5.5h6.5A3.5 3.5 0 0 1 15 9v10H8.2A3.2 3.2 0 0 0 5 15.8V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19 5.5h-6.5A3.5 3.5 0 0 0 9 9v10h6.8A3.2 3.2 0 0 0 19 15.8V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg className="quick-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 11 8-7 8 7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 22v-7h4v7" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [overview, setOverview] = useState<HomeOverview | null>(null);

  useEffect(() => {
    setOverview(readHomeOverview());
  }, []);

  return (
    <main className="page home">
      <header className="home-header">
        <div className="brand-row">
          <Mark />
          <div>
            <p className="en">{lang === "ur" ? "Noor-ul-Quran" : "نور القرآن"}</p>
            <h1 className="brand">{t.appName}</h1>
          </div>
        </div>
        <LanguageToggle />
      </header>

      <section className="hero card">
        <h2 className="hero-title">{t.heroTitle}</h2>
        <p>{t.heroText}</p>
        <Link className="primary" href="/students">
          {t.heroButton}
        </Link>
      </section>

      <section className="card overview">
        <h2 className="section-title">{t.overviewTitle}</h2>
        {overview === null ? null : overview.students === 0 ? (
          <p className="note">{t.overviewEmpty}</p>
        ) : (
          <ul className="overview-list">
            <li>
              {t.overviewStudents}: {overview.students}
            </li>
            <li>
              {t.overviewAttendance}:{" "}
              {overview.attendanceReady
                ? `${t.present} ${overview.present} — ${t.absent} ${overview.absent}`
                : t.parentNoAttendance}
            </li>
            <li>
              {t.overviewSabaq}:{" "}
              {overview.sabaqMissing > 0
                ? t.overviewSabaqLeft.replace(
                    "{count}",
                    String(overview.sabaqMissing),
                  )
                : t.overviewSabaqDone}
            </li>
            <li>
              {t.overviewHomework}:{" "}
              {overview.homeworkMissing > 0
                ? t.overviewHomeworkLeft.replace(
                    "{count}",
                    String(overview.homeworkMissing),
                  )
                : overview.homeworkNo > 0
                  ? t.overviewHomeworkNo.replace(
                      "{count}",
                      String(overview.homeworkNo),
                    )
                  : t.overviewHomeworkDone}
            </li>
          </ul>
        )}
      </section>

      <section>
        <h2 className="section-title">{t.quickTitle}</h2>
        <div className="quick-grid">
          <Link className="quick-card" href="/students">
            <IconPeople />
            <b>{t.students}</b>
            <span className="note">{t.studentsHint}</span>
          </Link>
          <Link className="quick-card" href="/attendance">
            <IconCheck />
            <b>{t.attendance}</b>
            <span className="note">{t.attendanceHint}</span>
          </Link>
          <Link className="quick-card" href="/sabaq">
            <IconBook />
            <b>{t.sabaq}</b>
            <span className="note">{t.sabaqHint}</span>
          </Link>
          <Link className="quick-card" href="/homework">
            <IconHome />
            <b>{t.homework}</b>
            <span className="note">{t.homeworkHint}</span>
          </Link>
        </div>
      </section>

      <section className="groups">
        <div>
          <h2 className="section-title">{t.groupLearn}</h2>
          <ul className="list">
            <li>
              <Link href="/comments">
                <b>{t.comments}</b>
                <div className="note">{t.commentsHint}</div>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="section-title">{t.groupReports}</h2>
          <ul className="list">
            <li>
              <Link href="/report">
                <b>{t.report}</b>
                <div className="note">{t.reportHint}</div>
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
          </ul>
        </div>
        <div>
          <h2 className="section-title">{t.groupParents}</h2>
          <ul className="list">
            <li>
              <Link href="/parents">
                <b>{t.parents}</b>
                <div className="note">{t.parentsHint}</div>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <b>{t.contact}</b>
                <div className="note">{t.contactHint}</div>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="section-title">{t.groupTarbiyah}</h2>
          <ul className="list">
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
              <Link href="/tajweed">
                <b>{t.tajweed}</b>
                <div className="note">{t.tajweedHint}</div>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

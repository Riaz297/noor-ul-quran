"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BrandMark,
  IconBook,
  IconCheck,
  IconComment,
  IconHome,
  IconParents,
  IconPeople,
  IconPrayer,
  IconReport,
} from "@/components/home-marks";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import { readHomeOverview, type HomeOverview } from "@/lib/home-overview";

type OverviewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: HomeOverview };

export default function HomePage() {
  const { t } = useLanguage();
  const [overview, setOverview] = useState<OverviewState>({
    status: "loading",
  });

  const loadOverview = useCallback(() => {
    try {
      setOverview({ status: "ready", data: readHomeOverview() });
    } catch {
      setOverview({ status: "error" });
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const data = overview.status === "ready" ? overview.data : null;
  const startHref =
    data && data.students > 0 ? "/attendance" : "/students";

  return (
    <main className="page home">
      <header className="home-header">
        <div className="brand-row">
          <BrandMark />
          <div>
            <p className="brand-latin">Noor-ul-Quran</p>
            <h1 className="brand">{t.appName}</h1>
          </div>
        </div>
        <LanguageToggle />
      </header>

      <section className="hero-panel">
        <p className="hero-kicker">{t.tagline}</p>
        <h2 className="hero-title">{t.heroTitle}</h2>
        <p className="hero-text">{t.heroText}</p>
        <div className="hero-actions">
          <Link className="primary hero-primary" href={startHref}>
            {t.heroStart}
          </Link>
          <Link className="hero-secondary" href="/students">
            {t.heroButton}
          </Link>
        </div>
      </section>

      <section className="home-block">
        <h2 className="section-title">{t.overviewTitle}</h2>
        {overview.status === "loading" ? (
          <p className="note">{t.overviewLoading}</p>
        ) : overview.status === "error" ? (
          <div className="empty-panel">
            <p className="note">{t.overviewError}</p>
            <button type="button" className="primary" onClick={loadOverview}>
              {t.overviewRetry}
            </button>
          </div>
        ) : data && data.students === 0 ? (
          <div className="empty-panel">
            <p className="note">{t.overviewEmpty}</p>
            <Link className="primary" href="/students">
              {t.heroButton}
            </Link>
          </div>
        ) : data ? (
          <div className="stat-grid">
            <article className="stat-card">
              <IconPeople />
              <span className="note">{t.overviewStudents}</span>
              <strong>{data.students}</strong>
            </article>
            <article className="stat-card">
              <IconCheck />
              <span className="note">{t.overviewAttendance}</span>
              <strong>
                {data.attendanceReady
                  ? `${data.present} / ${data.present + data.absent}`
                  : "—"}
              </strong>
              <span className="note">
                {data.attendanceReady
                  ? `${t.present} ${data.present} — ${t.absent} ${data.absent}`
                  : t.parentNoAttendance}
              </span>
            </article>
            <article className="stat-card">
              <IconBook />
              <span className="note">{t.overviewSabaq}</span>
              <strong>
                {data.sabaqMissing > 0 ? data.sabaqMissing : "✓"}
              </strong>
              <span className="note">
                {data.sabaqMissing > 0
                  ? t.overviewSabaqLeft.replace(
                      "{count}",
                      String(data.sabaqMissing),
                    )
                  : t.overviewSabaqDone}
              </span>
            </article>
            <article className="stat-card">
              <IconHome />
              <span className="note">{t.overviewHomework}</span>
              <strong>
                {data.homeworkMissing > 0
                  ? data.homeworkMissing
                  : data.homeworkNo > 0
                    ? data.homeworkNo
                    : "✓"}
              </strong>
              <span className="note">
                {data.homeworkMissing > 0
                  ? t.overviewHomeworkLeft.replace(
                      "{count}",
                      String(data.homeworkMissing),
                    )
                  : data.homeworkNo > 0
                    ? t.overviewHomeworkNo.replace(
                        "{count}",
                        String(data.homeworkNo),
                      )
                    : t.overviewHomeworkDone}
              </span>
            </article>
          </div>
        ) : null}
      </section>

      <section className="home-block">
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
            <b>{t.quickSabaq}</b>
            <span className="note">{t.sabaqHint}</span>
          </Link>
          <Link className="quick-card" href="/homework">
            <IconHome />
            <b>{t.homework}</b>
            <span className="note">{t.homeworkHint}</span>
          </Link>
        </div>
      </section>

      <section className="home-block">
        <h2 className="section-title">{t.featuresTitle}</h2>
        <div className="groups">
          <article className="group-card">
            <div className="group-head">
              <IconComment />
              <h3>{t.groupLearn}</h3>
            </div>
            <Link className="feature-link" href="/comments">
              <b>{t.comments}</b>
              <span className="note">{t.commentsHint}</span>
            </Link>
          </article>
          <article className="group-card">
            <div className="group-head">
              <IconReport />
              <h3>{t.groupReports}</h3>
            </div>
            <Link className="feature-link" href="/report">
              <b>{t.report}</b>
              <span className="note">{t.reportHint}</span>
            </Link>
            <Link className="feature-link" href="/weekly">
              <b>{t.weekly}</b>
              <span className="note">{t.weeklyHint}</span>
            </Link>
            <Link className="feature-link" href="/monthly">
              <b>{t.monthly}</b>
              <span className="note">{t.monthlyHint}</span>
            </Link>
          </article>
          <article className="group-card">
            <div className="group-head">
              <IconParents />
              <h3>{t.groupParents}</h3>
            </div>
            <Link className="feature-link" href="/parents">
              <b>{t.parents}</b>
              <span className="note">{t.parentsHint}</span>
            </Link>
            <Link className="feature-link" href="/contact">
              <b>{t.contact}</b>
              <span className="note">{t.contactHint}</span>
            </Link>
          </article>
          <article className="group-card">
            <div className="group-head">
              <IconPrayer />
              <h3>{t.groupTarbiyah}</h3>
            </div>
            <Link className="feature-link" href="/prayer">
              <b>{t.prayer}</b>
              <span className="note">{t.prayerHint}</span>
            </Link>
            <Link className="feature-link" href="/duas">
              <b>{t.duas}</b>
              <span className="note">{t.duasHint}</span>
            </Link>
            <Link className="feature-link" href="/tajweed">
              <b>{t.tajweed}</b>
              <span className="note">{t.tajweedHint}</span>
            </Link>
          </article>
        </div>
      </section>

      <footer className="home-foot">
        <p>{t.appName}</p>
        <p className="note">{t.tagline}</p>
      </footer>
    </main>
  );
}

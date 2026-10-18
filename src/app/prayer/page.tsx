"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  PRAYER_IDS,
  readPrayerDraft,
  rowFor,
  writePrayerDraft,
  type PrayerDraft,
  type PrayerId,
  type PrayerStatus,
} from "@/lib/draft-prayer";
import { readDraftStudents } from "@/lib/draft-students";

export default function PrayerPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState<PrayerDraft>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNames(readDraftStudents());
    setDraft(readPrayerDraft());
  }, []);

  const labels: Record<PrayerId, string> = {
    fajr: t.prayerFajr,
    zuhr: t.prayerZuhr,
    asr: t.prayerAsr,
    maghrib: t.prayerMaghrib,
    isha: t.prayerIsha,
  };

  function setStatus(name: string, prayer: PrayerId, status: PrayerStatus) {
    setSaved(false);
    setDraft((current) => ({
      ...current,
      [name]: {
        ...rowFor(current, name),
        [prayer]: status,
      },
    }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: PrayerDraft = {};
    for (const name of names) {
      next[name] = rowFor(draft, name);
    }
    writePrayerDraft(next);
    setDraft(next);
    setSaved(true);
  }

  return (
    <main className="page">
      <div className="topbar">
        <p>
          <Link href="/">← {t.home}</Link>
        </p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.prayer}</h1>
      <section className="card">
        <p>{t.prayerIntro}</p>
        <p className="note">{t.prayerNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForPrayer} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <ul className="list">
              {names.map((name) => {
                const row = rowFor(draft, name);
                return (
                  <li key={name}>
                    <b>{name}</b>
                    <div className="prayer-grid">
                      {PRAYER_IDS.map((prayer) => (
                        <label key={prayer} htmlFor={`${name}-${prayer}`}>
                          {labels[prayer]}
                          <select
                            id={`${name}-${prayer}`}
                            className="field"
                            value={row[prayer]}
                            onChange={(event) =>
                              setStatus(
                                name,
                                prayer,
                                event.target.value as PrayerStatus,
                              )
                            }
                          >
                            <option value="">{t.prayerEmpty}</option>
                            <option value="done">{t.prayerDone}</option>
                            <option value="missed">{t.prayerMissed}</option>
                            <option value="unknown">{t.prayerUnknown}</option>
                            <option value="not_yet">{t.prayerNotYet}</option>
                          </select>
                        </label>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
            <button className="primary" type="submit">
              {t.savePrayer}
            </button>
            {saved ? <p className="note">{t.prayerSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

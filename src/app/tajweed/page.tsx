"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  TAJWEED_IDS,
  readTajweedDraft,
  tajweedRowFor,
  writeTajweedDraft,
  type TajweedDraft,
  type TajweedId,
  type TajweedStatus,
} from "@/lib/draft-tajweed";
import { readDraftStudents } from "@/lib/draft-students";

export default function TajweedPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState<TajweedDraft>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNames(readDraftStudents());
    setDraft(readTajweedDraft());
  }, []);

  const labels: Record<TajweedId, string> = {
    makharij: t.tajweedMakharij,
    izhar: t.tajweedIzhar,
    idgham: t.tajweedIdgham,
    iqlab: t.tajweedIqlab,
    ikhfa: t.tajweedIkhfa,
    madd: t.tajweedMadd,
    ghunnah: t.tajweedGhunnah,
  };

  function setStatus(name: string, rule: TajweedId, status: TajweedStatus) {
    setSaved(false);
    setDraft((current) => ({
      ...current,
      [name]: {
        ...tajweedRowFor(current, name),
        [rule]: status,
      },
    }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: TajweedDraft = {};
    for (const name of names) {
      next[name] = tajweedRowFor(draft, name);
    }
    writeTajweedDraft(next);
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
      <h1 className="brand">{t.tajweed}</h1>
      <section className="card">
        <p>{t.tajweedIntro}</p>
        <p className="note">{t.tajweedNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForTajweed} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <ul className="list">
              {names.map((name) => {
                const row = tajweedRowFor(draft, name);
                return (
                  <li key={name}>
                    <b>{name}</b>
                    <div className="prayer-grid">
                      {TAJWEED_IDS.map((rule) => (
                        <label key={rule} htmlFor={`${name}-${rule}`}>
                          {labels[rule]}
                          <select
                            id={`${name}-${rule}`}
                            className="field"
                            value={row[rule]}
                            onChange={(event) =>
                              setStatus(
                                name,
                                rule,
                                event.target.value as TajweedStatus,
                              )
                            }
                          >
                            <option value="not_learned">{t.duaNotLearned}</option>
                            <option value="read">{t.duaRead}</option>
                            <option value="memorized">{t.duaMemorized}</option>
                            <option value="recited">{t.duaRecited}</option>
                          </select>
                        </label>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
            <button className="primary" type="submit">
              {t.saveTajweed}
            </button>
            {saved ? <p className="note">{t.tajweedSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

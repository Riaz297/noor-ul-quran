"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  DUA_IDS,
  duaRowFor,
  readDuaDraft,
  writeDuaDraft,
  type DuaDraft,
  type DuaId,
  type DuaStatus,
} from "@/lib/draft-duas";
import { readDraftStudents } from "@/lib/draft-students";

export default function DuasPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState<DuaDraft>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNames(readDraftStudents());
    setDraft(readDuaDraft());
  }, []);

  const labels: Record<DuaId, string> = {
    enterMasjid: t.duaEnterMasjid,
    leaveMasjid: t.duaLeaveMasjid,
    enterHome: t.duaEnterHome,
    leaveHome: t.duaLeaveHome,
    beforeFood: t.duaBeforeFood,
    afterFood: t.duaAfterFood,
    sleep: t.duaSleep,
    wake: t.duaWake,
  };

  function setStatus(name: string, dua: DuaId, status: DuaStatus) {
    setSaved(false);
    setDraft((current) => ({
      ...current,
      [name]: {
        ...duaRowFor(current, name),
        [dua]: status,
      },
    }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: DuaDraft = {};
    for (const name of names) {
      next[name] = duaRowFor(draft, name);
    }
    writeDuaDraft(next);
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
      <h1 className="brand">{t.duas}</h1>
      <section className="card">
        <p>{t.duasIntro}</p>
        <p className="note">{t.duasNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForDuas} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <ul className="list">
              {names.map((name) => {
                const row = duaRowFor(draft, name);
                return (
                  <li key={name}>
                    <b>{name}</b>
                    <div className="prayer-grid">
                      {DUA_IDS.map((dua) => (
                        <label key={dua} htmlFor={`${name}-${dua}`}>
                          {labels[dua]}
                          <select
                            id={`${name}-${dua}`}
                            className="field"
                            value={row[dua]}
                            onChange={(event) =>
                              setStatus(name, dua, event.target.value as DuaStatus)
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
              {t.saveDuas}
            </button>
            {saved ? <p className="note">{t.duasSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

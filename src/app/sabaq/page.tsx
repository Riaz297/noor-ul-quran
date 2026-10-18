"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readSabaqPages,
  writeSabaqPages,
  type SabaqPages,
} from "@/lib/draft-daily";
import { readDraftStudents } from "@/lib/draft-students";

export default function SabaqPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [pages, setPages] = useState<SabaqPages>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = readDraftStudents();
    const stored = readSabaqPages();
    setNames(list);
    setPages(stored);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    writeSabaqPages(pages);
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
      <h1 className="brand">{t.sabaq}</h1>
      <section className="card">
        <p>{t.sabaqIntro}</p>
        <p className="note">{t.sabaqNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForSabaq} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <ul className="list">
              {names.map((name) => (
                <li key={name}>
                  <label htmlFor={`page-${name}`}>
                    <b>{name}</b>
                    <div className="note">{t.pageNumber}</div>
                  </label>
                  <input
                    id={`page-${name}`}
                    className="field"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={pages[name] ?? ""}
                    onChange={(event) => {
                      setSaved(false);
                      setPages((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }));
                    }}
                  />
                </li>
              ))}
            </ul>
            <button className="primary" type="submit">
              {t.saveSabaq}
            </button>
            {saved ? <p className="note">{t.sabaqSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

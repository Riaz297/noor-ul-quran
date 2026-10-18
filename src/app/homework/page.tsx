"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readHomeAnswers,
  writeHomeAnswers,
  type HomeAnswer,
  type HomeAnswers,
} from "@/lib/draft-daily";
import { readDraftStudents } from "@/lib/draft-students";

export default function HomeSabaqPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [answers, setAnswers] = useState<HomeAnswers>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNames(readDraftStudents());
    setAnswers(readHomeAnswers());
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: HomeAnswers = {};
    for (const name of names) {
      next[name] = answers[name] === "no" ? "no" : "yes";
    }
    writeHomeAnswers(next);
    setAnswers(next);
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
      <h1 className="brand">{t.homework}</h1>
      <section className="card">
        <p>{t.homeworkIntro}</p>
        <p className="note">{t.homeworkNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForHomework} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <ul className="list">
              {names.map((name) => {
                const value = answers[name] === "no" ? "no" : "yes";
                return (
                  <li key={name}>
                    <b>{name}</b>
                    <label htmlFor={`ghar-${name}`}>{t.homeworkQuestion}</label>
                    <select
                      id={`ghar-${name}`}
                      className="field"
                      value={value}
                      onChange={(event) => {
                        setSaved(false);
                        setAnswers((current) => ({
                          ...current,
                          [name]: event.target.value as HomeAnswer,
                        }));
                      }}
                    >
                      <option value="yes">{t.homeworkYes}</option>
                      <option value="no">{t.homeworkNo}</option>
                    </select>
                  </li>
                );
              })}
            </ul>
            <button className="primary" type="submit">
              {t.saveHomework}
            </button>
            {saved ? <p className="note">{t.homeworkSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

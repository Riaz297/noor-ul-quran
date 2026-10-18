"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import { readComments, writeComments } from "@/lib/draft-comments";
import { readDraftStudents } from "@/lib/draft-students";

export default function CommentsPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [student, setStudent] = useState("");
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = readDraftStudents();
    setNames(list);
    const first = list[0] ?? "";
    setStudent(first);
    if (first) {
      setText(readComments()[first]?.text ?? "");
    }
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!student || !clean) return;
    const next = {
      ...readComments(),
      [student]: { text: clean, at: new Date().toISOString() },
    };
    writeComments(next);
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
      <h1 className="brand">{t.comments}</h1>
      <section className="card">
        <p>{t.commentsIntro}</p>
        <p className="note">{t.commentsNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForComments} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <label htmlFor="comment-student">{t.students}</label>
            <select
              id="comment-student"
              className="field"
              value={student}
              onChange={(event) => {
                const next = event.target.value;
                setStudent(next);
                setText(readComments()[next]?.text ?? "");
                setSaved(false);
              }}
            >
              {names.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label htmlFor="comment-text">{t.comments}</label>
            <textarea
              id="comment-text"
              className="field area"
              value={text}
              onChange={(event) => {
                setSaved(false);
                setText(event.target.value);
              }}
              placeholder={t.commentPlaceholder}
            />
            <button className="primary" type="submit">
              {t.saveComment}
            </button>
            {saved ? <p className="note">{t.commentSaved}</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

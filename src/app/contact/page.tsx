"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readContactRequests,
  writeContactRequests,
  type ContactRequest,
} from "@/lib/draft-contact";
import { guardianFor, readDraftStudents } from "@/lib/draft-students";

export default function ContactPage() {
  const { t } = useLanguage();
  const [names, setNames] = useState<string[]>([]);
  const [student, setStudent] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = readDraftStudents();
    setNames(list);
    setStudent(list[0] ?? "");
    setRequests(readContactRequests());
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const clean = message.trim();
    if (!student || !clean) return;
    const next: ContactRequest[] = [
      ...requests,
      { id: String(Date.now()), student, message: clean },
    ];
    writeContactRequests(next);
    setRequests(next);
    setMessage("");
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
      <h1 className="brand">{t.contact}</h1>
      <section className="card">
        <p>{t.contactIntro}</p>
        <p className="note">{t.contactNote}</p>

        {names.length === 0 ? (
          <p className="note">
            {t.noStudentsForContact} <Link href="/students">{t.students}</Link>
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <label htmlFor="contact-student">{t.students}</label>
            <select
              id="contact-student"
              className="field"
              value={student}
              onChange={(event) => {
                setSaved(false);
                setStudent(event.target.value);
              }}
            >
              {names.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p className="note">
              {t.guardianLabel}: {guardianFor(student) || t.guardianMissing}
            </p>
            <label htmlFor="contact-message">{t.contactMessage}</label>
            <textarea
              id="contact-message"
              className="field area"
              value={message}
              onChange={(event) => {
                setSaved(false);
                setMessage(event.target.value);
              }}
              placeholder={t.contactPlaceholder}
            />
            <button className="primary" type="submit">
              {t.sendContact}
            </button>
            {saved ? <p className="note">{t.contactSaved}</p> : null}
          </form>
        )}

        {requests.length > 0 ? (
          <>
            <h2 className="section-title">{t.contactList}</h2>
            <ul className="list">
              {requests.map((item) => (
                <li key={item.id}>
                  <b>{item.student}</b>
                  <div className="note">{item.message}</div>
                  <div className="note">{t.contactWaiting}</div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </main>
  );
}

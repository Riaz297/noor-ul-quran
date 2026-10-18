"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle, useLanguage } from "@/components/language-toggle";
import {
  readDraftStudentRecords,
  writeDraftStudentRecords,
  type DraftStudent,
} from "@/lib/draft-students";

export default function StudentsPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [guardian, setGuardian] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState<DraftStudent["group"]>("");
  const [students, setStudents] = useState<DraftStudent[]>([]);

  useEffect(() => {
    setStudents(readDraftStudentRecords());
  }, []);

  function save(next: DraftStudent[]) {
    setStudents(next);
    writeDraftStudentRecords(next);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    const cleanGuardian = guardian.trim();
    const cleanPhone = phone.trim();
    const existing = students.findIndex((row) => row.name === cleanName);
    const nextRow: DraftStudent = {
      name: cleanName,
      guardian:
        cleanGuardian || (existing >= 0 ? students[existing].guardian : ""),
      phone: cleanPhone || (existing >= 0 ? students[existing].phone : ""),
      group: group || (existing >= 0 ? students[existing].group : ""),
    };
    if (existing >= 0) {
      save(
        students.map((row, index) => (index === existing ? nextRow : row)),
      );
    } else {
      save([...students, nextRow]);
    }
    setName("");
    setGuardian("");
    setPhone("");
    setGroup("");
  }

  return (
    <main className="page">
      <div className="topbar">
        <p>
          <Link href="/">← {t.home}</Link>
        </p>
        <LanguageToggle />
      </div>
      <h1 className="brand">{t.students}</h1>
      <section className="card">
        <p className="note">{t.studentsDraftNote}</p>
        <form className="form" onSubmit={onSubmit}>
          <label htmlFor="student-name">{t.nameLabel}</label>
          <input
            id="student-name"
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.namePlaceholder}
          />
          <label htmlFor="student-guardian">{t.guardianLabel}</label>
          <input
            id="student-guardian"
            className="field"
            value={guardian}
            onChange={(event) => setGuardian(event.target.value)}
            placeholder={t.guardianPlaceholder}
          />
          <p className="note">{t.guardianHelp}</p>
          <label htmlFor="student-phone">{t.phoneLabel}</label>
          <input
            id="student-phone"
            className="field"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t.phonePlaceholder}
            inputMode="tel"
          />
          <p className="note">{t.phoneHelp}</p>
          <label htmlFor="student-group">{t.groupLabel}</label>
          <select
            id="student-group"
            className="field"
            value={group}
            onChange={(event) =>
              setGroup(event.target.value as DraftStudent["group"])
            }
          >
            <option value="">{t.groupEmpty}</option>
            <option value="boys_morning">{t.groupBoys}</option>
            <option value="girls_home">{t.groupGirls}</option>
          </select>
          <p className="note">{t.groupHelp}</p>
          <button className="primary" type="submit">
            {t.add}
          </button>
        </form>
        {students.length === 0 ? (
          <p className="note">{t.studentsEmpty}</p>
        ) : (
          <ul className="list">
            {students.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <b>{item.name}</b>
                <div className="note">
                  {t.guardianLabel}: {item.guardian || t.guardianMissing}
                </div>
                <div className="note">
                  {t.phoneLabel}: {item.phone || t.phoneMissing}
                </div>
                <div className="note">
                  {t.groupLabel}:{" "}
                  {item.group === "boys_morning"
                    ? t.groupBoys
                    : item.group === "girls_home"
                      ? t.groupGirls
                      : t.groupEmpty}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowLeft, BookOpen, Plus, Trash2 } from "lucide-react"
import { useApplication } from "./ApplicationContext"
import type { AcademicInfo, Subject } from "./ApplicationContext"

const ADMISSION_BASE = "/admission/apply/undergraduate"

const subjectCategories: { group: string; subjects: string[] }[] = [
  {
    group: "Core / General",
    subjects: ["English Language", "Mathematics", "Civic Education"],
  },
  {
    group: "Science",
    subjects: [
      "Physics", "Chemistry", "Biology", "Further Mathematics",
      "Agricultural Science", "Geography", "Health Science", "Computer Studies",
    ],
  },
  {
    group: "Arts",
    subjects: [
      "Literature in English", "Government", "History", "Christian Religious Studies",
      "Islamic Religious Studies", "French", "Fine Art", "Music", "CRS/IRS",
    ],
  },
  {
    group: "Commercial",
    subjects: [
      "Financial Accounting", "Commerce", "Economics", "Office Practice",
      "Marketing", "Insurance", "Store Management",
    ],
  },
]

const gradeOptions = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"]
const inputClass = "border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs tracking-wide uppercase text-black/50">{label}</label>
      {children}
    </div>
  )
}

function SubjectSelect({ value, onChange, usedSubjects }: {
  value: string
  onChange: (v: string) => void
  usedSubjects: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} flex-1`}
    >
      <option value="">Select subject</option>
      {subjectCategories.map((cat) => (
        <optgroup key={cat.group} label={cat.group}>
          {cat.subjects.map((s) => (
            <option
              key={s}
              value={s}
              disabled={usedSubjects.includes(s) && s !== value}
            >
              {s}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

export default function AcademicInformation() {
  const navigate = useNavigate()
  const { data, setAcademic } = useApplication()

  const [form, setForm] = useState<AcademicInfo>(
    data.academic.subjects.length > 0
      ? data.academic
      : {
          ...data.academic,
          subjects: [
            { subject: "English Language", grade: "" },
            { subject: "Mathematics", grade: "" },
            { subject: "", grade: "" },
            { subject: "", grade: "" },
            { subject: "", grade: "" },
          ],
        }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const updateSubject = (index: number, field: keyof Subject, value: string) => {
    const next = [...form.subjects]
    next[index] = { ...next[index], [field]: value }
    setForm({ ...form, subjects: next })
  }

  const addSubject = () => setForm({ ...form, subjects: [...form.subjects, { subject: "", grade: "" }] })
  const removeSubject = (index: number) => setForm({ ...form, subjects: form.subjects.filter((_, i) => i !== index) })

  const usedSubjects = form.subjects.map((s) => s.subject).filter(Boolean)
  const filledSubjects = form.subjects.filter((s) => s.subject && s.grade)
  const canContinue = form.schoolName && form.examType && form.examNumber && form.examYear && filledSubjects.length >= 5

  const handleContinue = () => {
    if (!canContinue) return
    setAcademic({ ...form, subjects: filledSubjects })
    navigate(`${ADMISSION_BASE}/documents`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Step 4 of 8</span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Academic Information</h1>
        <p className="text-sm text-black/55 mt-2">Enter your O'Level exam details and at least five subject grades.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
            <BookOpen size={16} strokeWidth={1.75} className="text-[#1E3A8A]" />
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Examination Details</p>
        </div>

        <Field label="Secondary School Attended">
          <input name="schoolName" value={form.schoolName} onChange={handleChange} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Exam Type">
            <select name="examType" value={form.examType} onChange={handleChange as any} className={inputClass}>
              <option value="">Select...</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="NABTEB">NABTEB</option>
            </select>
          </Field>
          <Field label="Exam Number">
            <input name="examNumber" value={form.examNumber} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Exam Year">
            <input name="examYear" value={form.examYear} onChange={handleChange} placeholder="2025" className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="JAMB Registration Number">
            <input name="jambNumber" value={form.jambNumber} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="JAMB Score">
            <input name="jambScore" value={form.jambScore} onChange={handleChange} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">
            O'Level Subjects & Grades <span className="text-black/30 normal-case">(min. 5)</span>
          </p>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${filledSubjects.length >= 5 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
            {filledSubjects.length} of {form.subjects.length} filled
          </span>
        </div>
        <p className="text-xs text-black/40 mb-5">
          Choose from Core, Science, Arts, or Commercial subjects — pick whichever combination matches what you sat for.
        </p>

        <div className="flex flex-col gap-3">
          {form.subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <SubjectSelect
                value={s.subject}
                onChange={(v) => updateSubject(i, "subject", v)}
                usedSubjects={usedSubjects}
              />
              <select
                value={s.grade}
                onChange={(e) => updateSubject(i, "grade", e.target.value)}
                className={`${inputClass} w-24 flex-shrink-0`}
              >
                <option value="">Grade</option>
                {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removeSubject(i)}
                disabled={form.subjects.length <= 5}
                className="p-2 text-black/30 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSubject}
          className="flex items-center gap-1.5 text-sm text-[#1E3A8A] font-medium mt-4 hover:underline"
        >
          <Plus size={15} /> Add another subject
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`${ADMISSION_BASE}/personal-information`)}
          className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
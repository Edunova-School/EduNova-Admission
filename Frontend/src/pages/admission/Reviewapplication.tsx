import { useNavigate, useParams } from "react-router-dom"
import { ArrowRight, ArrowLeft, Pencil, User, BookOpen, FileText } from "lucide-react"
import { useApplication } from "./ApplicationContext"
import { trackConfigs } from "./trackconfig"
import type { Track } from "./trackconfig"

function SectionCard({ icon: Icon, title, editPath, children }: { icon: any; title: string; editPath: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center"><Icon size={16} strokeWidth={1.75} className="text-[#1E3A8A]" /></div>
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">{title}</p>
        </div>
        <button onClick={() => navigate(editPath)} className="flex items-center gap-1 text-xs font-medium text-[#1E3A8A] hover:underline">
          <Pencil size={12} /> Edit
        </button>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-black/5 last:border-b-0">
      <span className="text-black/50">{label}</span>
      <span className="font-medium text-black text-right">{value || "—"}</span>
    </div>
  )
}

export default function ReviewApplication() {
  const { track: trackParam } = useParams<{ track: string }>()
  const track = (trackParam ?? "undergraduate") as Track
  const config = trackConfigs[track]
  const base = `/admission/apply/${track}`
  const isDegreeMode = config.educationMode === "degree"

  const navigate = useNavigate()
  const { data, isPersonalComplete, isEducationComplete, isDocumentsComplete } = useApplication()

  const allComplete = isPersonalComplete && isEducationComplete(config.educationMode) && isDocumentsComplete

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Review</span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Review Application</h1>
        <p className="text-sm text-black/55 mt-2">Check every section carefully. You can edit any part before submitting.</p>
      </div>

      <SectionCard icon={User} title="Personal Information" editPath={`${base}/personal-information`}>
        <Row label="Date of Birth" value={data.personal.dob} />
        <Row label="Gender" value={data.personal.gender} />
        <Row label="State / LGA" value={[data.personal.state, data.personal.lga].filter(Boolean).join(" / ")} />
        <Row label="Address" value={data.personal.address} />
        <Row label="Phone Number" value={data.personal.phone} />
      </SectionCard>

      <SectionCard icon={BookOpen} title={isDegreeMode ? "Previous Education" : "Academic Information"} editPath={`${base}/education`}>
        {isDegreeMode ? (
          <>
            <Row label="Institution" value={data.education.institution} />
            <Row label="Degree" value={data.education.degree} />
            <Row label="Class of Degree" value={data.education.classOfDegree} />
            <Row label="CGPA" value={data.education.cgpa} />
          </>
        ) : (
          <>
            <Row label="School Attended" value={data.education.schoolName} />
            <Row label="Exam Type" value={data.education.examType} />
            <Row label="Exam Number" value={data.education.examNumber} />
            <div className="pt-3">
              <p className="text-xs text-black/40 mb-2">Subjects & Grades</p>
              <div className="flex flex-wrap gap-2">
                {data.education.subjects.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-[#1E3A8A]/5 text-[#1E3A8A] px-2.5 py-1 rounded-full">{s.subject} — {s.grade}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard icon={FileText} title="Documents" editPath={`${base}/documents`}>
        <Row label="Primary Result" value={data.documents.primaryResult} />
        <Row label="Passport Photograph" value={data.documents.passportPhoto} />
        <Row label="Identification" value={data.documents.idDocument} />
        <Row label="Supporting Document" value={data.documents.supporting} />
      </SectionCard>

      {!allComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <p className="text-sm text-amber-700">Some sections are incomplete. Please go back and fill in all required fields before proceeding.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`${base}/documents`)} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={() => allComplete && navigate(`${base}/fee`)} disabled={!allComplete} className="flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0">
          Confirm & Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
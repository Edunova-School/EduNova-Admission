import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react"
import { useApplication } from "./ApplicationContext"
import type { Documents } from "./ApplicationContext"
import { trackConfigs } from "./trackconfig"
import type { Track } from "./trackconfig"

// Labels change per track's education mode, but the underlying Documents
// shape (primaryResult / passportPhoto / idDocument / supporting) stays the same.
const labelsByMode = {
  olevel: {
    primaryResult: "O'Level Result",
    idDocument: "Birth Certificate / Declaration of Age",
    supporting: "JAMB Slip (if applicable)",
    supportingRequired: false,
  },
  degree: {
    primaryResult: "Degree Certificate",
    idDocument: "Valid Identification",
    supporting: "Statement of Purpose / Referee Letter",
    supportingRequired: true,
  },
}

function UploadRow({ label, required, fileName, onChange }: {
  label: string
  required: boolean
  fileName: string
  onChange: (name: string) => void
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onChange(e.target.files[0].name)
  }
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/5 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${fileName ? "bg-green-50" : "bg-black/5"}`}>
          {fileName ? <CheckCircle2 size={16} className="text-green-600" /> : <FileText size={16} className="text-black/40" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-black">{label} {required && <span className="text-red-400">*</span>}</p>
          <p className="text-xs text-black/40 truncate">{fileName || "PDF, JPG or PNG · Max 5MB"}</p>
        </div>
      </div>
      <label className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#1E3A8A] border border-[#1E3A8A]/20 px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#1E3A8A]/5 transition-colors">
        <Upload size={13} /> {fileName ? "Replace" : "Upload"}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} className="hidden" />
      </label>
    </div>
  )
}

export default function DocumentsPage() {
  const { track: trackParam } = useParams<{ track: string }>()
  const track = (trackParam ?? "undergraduate") as Track
  const config = trackConfigs[track]
  const labels = labelsByMode[config.educationMode]
  const base = `/admission/apply/${track}`

  const navigate = useNavigate()
  const { data, setDocuments } = useApplication()
  const [docs, setDocs] = useState<Documents>(data.documents)

  const canContinue = !!(docs.primaryResult && docs.passportPhoto && docs.idDocument && (!labels.supportingRequired || docs.supporting))

  const handleContinue = () => {
    if (!canContinue) return
    setDocuments(docs)
    navigate(`${base}/review`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Documents</span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Upload Your Documents</h1>
        <p className="text-sm text-black/55 mt-2">Upload clear, legible copies. Accepted formats: PDF, JPG, PNG.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 px-6">
        <UploadRow label={labels.primaryResult} required fileName={docs.primaryResult} onChange={(name) => setDocs({ ...docs, primaryResult: name })} />
        <UploadRow label="Passport Photograph" required fileName={docs.passportPhoto} onChange={(name) => setDocs({ ...docs, passportPhoto: name })} />
        <UploadRow label={labels.idDocument} required fileName={docs.idDocument} onChange={(name) => setDocs({ ...docs, idDocument: name })} />
        <UploadRow label={labels.supporting} required={labels.supportingRequired} fileName={docs.supporting} onChange={(name) => setDocs({ ...docs, supporting: name })} />
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`${base}/education`)} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handleContinue} disabled={!canContinue} className="flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0">
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
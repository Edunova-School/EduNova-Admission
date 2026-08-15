import { createContext, useContext, useState} from "react"
import type { ReactNode } from "react"
export interface PersonalInfo {
  dob: string
  gender: string
  nationality: string
  state: string
  lga: string
  address: string
  phone: string
  altPhone: string
}

export interface Subject {
  subject: string
  grade: string
}

export interface AcademicInfo {
  schoolName: string
  examType: string
  examNumber: string
  examYear: string
  subjects: Subject[]
  jambNumber: string
  jambScore: string
}

export interface Documents {
  oLevelResult: string
  passportPhoto: string
  birthCertificate: string
  validId: string
  jambSlip: string
}

interface ApplicationState {
  applicationNumber: string
  applicantName: string
  faculty: string
  department: string
  programmeTitle: string
  accountCreated: boolean
  personal: PersonalInfo
  academic: AcademicInfo
  documents: Documents
  feePaid: boolean
  submitted: boolean
}

interface ApplicationContextValue {
  data: ApplicationState
  setSelection: (faculty: string, department: string, programmeTitle: string) => void
  setAccountCreated: (name: string) => void
  setPersonal: (info: PersonalInfo) => void
  setAcademic: (info: AcademicInfo) => void
  setDocuments: (docs: Documents) => void
  setFeePaid: (paid: boolean) => void
  setSubmitted: (val: boolean) => void
  isProgrammeSelected: boolean
  isPersonalComplete: boolean
  isAcademicComplete: boolean
  isDocumentsComplete: boolean
  completedCount: number
  totalSteps: number
  progressPercent: number
}

const defaultState: ApplicationState = {
  applicationNumber: "EDU-UG-2026-001245",
  applicantName: "",
  faculty: "",
  department: "",
  programmeTitle: "",
  accountCreated: false,
  personal: { dob: "", gender: "", nationality: "", state: "", lga: "", address: "", phone: "", altPhone: "" },
  academic: { schoolName: "", examType: "", examNumber: "", examYear: "", subjects: [], jambNumber: "", jambScore: "" },
  documents: { oLevelResult: "", passportPhoto: "", birthCertificate: "", validId: "", jambSlip: "" },
  feePaid: false,
  submitted: false,
}

const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined)

// NOTE: This holds application progress in memory only (React state).
// Once the Flask backend exists, each `set...` function below should also
// POST/PATCH the relevant section to something like
// `/api/applications/{applicationNumber}/personal-info`, and initial state
// should be hydrated from a GET on mount instead of `defaultState`.
export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ApplicationState>(defaultState)

  const setSelection = (faculty: string, department: string, programmeTitle: string) =>
    setData((prev) => ({ ...prev, faculty, department, programmeTitle }))
  const setAccountCreated = (name: string) =>
    setData((prev) => ({ ...prev, applicantName: name, accountCreated: true }))
  const setPersonal = (info: PersonalInfo) => setData((prev) => ({ ...prev, personal: info }))
  const setAcademic = (info: AcademicInfo) => setData((prev) => ({ ...prev, academic: info }))
  const setDocuments = (docs: Documents) => setData((prev) => ({ ...prev, documents: docs }))
  const setFeePaid = (paid: boolean) => setData((prev) => ({ ...prev, feePaid: paid }))
  const setSubmitted = (val: boolean) => setData((prev) => ({ ...prev, submitted: val }))

  const isProgrammeSelected = !!data.programmeTitle
  const isPersonalComplete = !!(data.personal.dob && data.personal.gender && data.personal.address && data.personal.phone)
  const isAcademicComplete = !!(data.academic.schoolName && data.academic.examNumber && data.academic.subjects.length >= 5)
  const isDocumentsComplete = !!(
    data.documents.oLevelResult && data.documents.passportPhoto &&
    data.documents.birthCertificate && data.documents.validId
  )

  const flags = [data.accountCreated, isProgrammeSelected, isPersonalComplete, isAcademicComplete, isDocumentsComplete, isPersonalComplete && isAcademicComplete && isDocumentsComplete, data.feePaid, data.submitted]
  const totalSteps = flags.length
  const completedCount = flags.filter(Boolean).length
  const progressPercent = Math.round((completedCount / totalSteps) * 100)

  return (
    <ApplicationContext.Provider
      value={{
        data, setSelection, setAccountCreated, setPersonal, setAcademic, setDocuments, setFeePaid, setSubmitted,
        isProgrammeSelected, isPersonalComplete, isAcademicComplete, isDocumentsComplete,
        completedCount, totalSteps, progressPercent,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const ctx = useContext(ApplicationContext)
  if (!ctx) throw new Error("useApplication must be used within an ApplicationProvider")
  return ctx
}
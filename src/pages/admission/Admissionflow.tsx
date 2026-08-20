import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    ChevronLeft, ChevronRight, Building2, GraduationCap, Clock, Layers, Award,
    CheckCircle2, FileText, Eye, EyeOff, Sparkles, Copy, Check, KeyRound,
    UserPlus, LogIn, UserCheck, UserPlus2,
} from "lucide-react"
import logo from "../../assets/edunova-logo.webp"
import { useApplication } from "./ApplicationContext"
import { trackConfigs } from "./trackconfig"
import type { Track } from "./trackconfig"

type Step =
    | "entry" | "login" | "faculty" | "department" | "programme" | "requirements"
    | "applicantType" | "eduNovaLookup" | "account" | "created" | "dashboard"

const flowOrder: Step[] = ["entry", "faculty", "department", "programme", "requirements", "applicantType", "account", "created"]

function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
    return (
        <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-[#1E3A8A] transition-colors w-fit">
            <ChevronLeft size={16} /> {label}
        </button>
    )
}

function Breadcrumb({ items }: { items: string[] }) {
    return (
        <p className="text-xs text-black/40">
            {items.map((item, i) => (
                <span key={i}>
                    {i > 0 && <span className="mx-1.5">/</span>}
                    <span className={i === items.length - 1 ? "text-[#1E3A8A] font-medium" : ""}>{item}</span>
                </span>
            ))}
        </p>
    )
}

export default function AdmissionFlow() {
    const { track: trackParam } = useParams<{ track: string }>()
    const track = (trackParam ?? "undergraduate") as Track
    const config = trackConfigs[track]

    const navigate = useNavigate()
    const { data, setTrack, setSelection, setApplicantType, prefillFromEduNovaRecord, setAccountCreated, progressPercent } = useApplication()

    const [step, setStep] = useState<Step>("entry")
    const [faculty, setFaculty] = useState("")
    const [department, setDepartment] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [copied, setCopied] = useState(false)
    const [studentIdInput, setStudentIdInput] = useState("")
    const [lookupError, setLookupError] = useState("")

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" })
    const [loginForm, setLoginForm] = useState({ idOrEmail: "", password: "" })
    const [loginError, setLoginError] = useState("")

    const programme = department ? config.programmesByDept[department] ?? null : null

    // Ensure track/applicationNumber are registered in context as soon as this mounts
    // Ensure track/applicationNumber are registered in context as soon as this mounts
    useEffect(() => {
    if (data.track !== track) setTrack(track)
    }, [track, data.track, setTrack])

    const goBack = () => {
        const idx = flowOrder.indexOf(step)
        if (idx > 0) {
            let prevStep = flowOrder[idx - 1]
            if (prevStep === "requirements" && !config.hasApplicantTypeStep) {
                // requirements always shown for non-PG tracks; fine as-is
            }
            setStep(prevStep)
        } else {
            setStep("entry")
        }
    }

    const canCreateAccount = form.firstName && form.lastName && form.email && form.phone && form.password.length >= 6 && form.password === form.confirmPassword

    const copyAppNumber = () => {
        navigator.clipboard.writeText(data.applicationNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const afterProgrammeContinue = () => {
        setSelection(faculty, department, programme?.title ?? "")
        setStep(config.hasApplicantTypeStep ? "applicantType" : "requirements")
    }

    const handleEduNovaLookup = () => {
        if (!studentIdInput.trim()) { setLookupError("Enter your EduNova Student ID to continue."); return }
        setLookupError("")
        prefillFromEduNovaRecord(studentIdInput.trim())
        setStep("created")
    }

    const handleLogin = () => {
        if (!loginForm.idOrEmail.trim() || !loginForm.password.trim()) {
            setLoginError("Enter your application number/email and password to continue.")
            return
        }
        setLoginError("")
        setStep("dashboard")
    }

    const handleCreateAccount = () => {
        setSelection(faculty, department, programme?.title ?? "")
        setAccountCreated(`${form.firstName} ${form.lastName}`.trim(), form.email)
        setStep("created")
    }

    return (
        <div className="min-h-screen bg-[#F6F6F2]">
            {step !== "dashboard" && (
                <div className="relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B8901F]/20 rounded-full blur-3xl" />
                    <div className="relative px-4 md:px-8 py-10 max-w-2xl mx-auto text-center flex flex-col items-center">
                        <img src={logo} alt="EduNova" className="h-9 w-auto mb-5 opacity-90" />
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-3">
                            <Sparkles size={13} /> {config.heroLabel}
                        </span>
                        <h1 className="font-serif text-white text-2xl md:text-3xl font-semibold leading-snug">
                            {step === "entry" && "Let's get started"}
                            {step === "login" && "Welcome back"}
                            {step === "faculty" && "Select the faculty offering your intended programme."}
                            {step === "department" && "Select your department."}
                            {step === "programme" && `Available ${config.label} Programmes`}
                            {step === "requirements" && programme?.title}
                            {step === "applicantType" && "Tell us about your background"}
                            {step === "eduNovaLookup" && "Welcome back, EduNova graduate"}
                            {(step === "account" || step === "created") && "Create Your Application Account"}
                        </h1>
                    </div>
                </div>
            )}

            <div className="px-4 md:px-8 py-8 max-w-2xl mx-auto flex flex-col gap-5">

                {/* Entry */}
                {step === "entry" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <button onClick={() => setStep("faculty")} className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#1E3A8A]/30 hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 flex items-center justify-center">
                                <UserPlus size={22} strokeWidth={1.5} className="text-[#1E3A8A]" />
                            </div>
                            <div>
                                <p className="font-serif font-semibold text-black">Start New Application</p>
                                <p className="text-xs text-black/50 mt-1">Choose your programme and create an application account.</p>
                            </div>
                        </button>
                        <button onClick={() => setStep("login")} className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#B8901F]/40 hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-[#B8901F]/10 flex items-center justify-center">
                                <LogIn size={22} strokeWidth={1.5} className="text-[#B8901F]" />
                            </div>
                            <div>
                                <p className="font-serif font-semibold text-black">Continue Application</p>
                                <p className="text-xs text-black/50 mt-1">Log in to pick up where you left off.</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Login */}
                {step === "login" && (
                    <>
                        <BackButton onClick={() => setStep("entry")} />
                        <div className="bg-white rounded-2xl border border-black/5 p-7 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs tracking-wide uppercase text-black/50">Application Number or Email</label>
                                <input value={loginForm.idOrEmail} onChange={(e) => setLoginForm({ ...loginForm, idOrEmail: e.target.value })} className="border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs tracking-wide uppercase text-black/50">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border border-black/15 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                            <button onClick={handleLogin} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1">
                                <KeyRound size={16} /> Continue Application
                            </button>
                        </div>
                    </>
                )}

                {/* Faculty */}
                {step === "faculty" && (
                    <>
                        <BackButton onClick={goBack} label="Back to start" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {config.faculties.map((f, i) => (
                                <button key={i} onClick={() => { setFaculty(f); setStep("department") }} className="group flex items-center gap-4 bg-white rounded-2xl border border-black/5 p-5 text-left hover:border-[#1E3A8A]/30 hover:shadow-md transition-all duration-300">
                                    <div className="w-11 h-11 rounded-full bg-[#1E3A8A]/8 flex items-center justify-center flex-shrink-0">
                                        <Building2 size={20} strokeWidth={1.5} className="text-[#1E3A8A]" />
                                    </div>
                                    <span className="text-sm font-medium text-black/80 group-hover:text-[#1E3A8A] transition-colors">{f}</span>
                                    <ChevronRight size={16} className="ml-auto text-black/20 group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Department */}
                {step === "department" && (
                    <>
                        <BackButton onClick={goBack} />
                        <Breadcrumb items={[config.label, faculty]} />
                        <div className="flex flex-col gap-3">
                            {(config.departmentsByFaculty[faculty] ?? []).map((d, i) => (
                                <button key={i} onClick={() => { setDepartment(d); setStep("programme") }} className="group flex items-center justify-between bg-white rounded-xl border border-black/5 px-5 py-4 text-left hover:border-[#1E3A8A]/30 hover:shadow-sm transition-all duration-300">
                                    <span className="text-sm font-medium text-black/80 group-hover:text-[#1E3A8A] transition-colors">{d}</span>
                                    <ChevronRight size={16} className="text-black/20 group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-all" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Programme */}
                {step === "programme" && programme && (
                    <>
                        <BackButton onClick={goBack} />
                        <Breadcrumb items={[config.label, faculty, department]} />
                        <div className="bg-white rounded-2xl border border-black/5 p-7">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A]/8 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap size={26} strokeWidth={1.5} className="text-[#1E3A8A]" />
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-black">{programme.title}</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-black/5">
                                <div>
                                    <Clock size={16} strokeWidth={1.75} className="text-black/30 mb-1.5" />
                                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40">Duration</p>
                                    <p className="text-sm font-medium text-black mt-0.5">{programme.duration}</p>
                                </div>
                                <div>
                                    <Layers size={16} strokeWidth={1.75} className="text-black/30 mb-1.5" />
                                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40">Mode</p>
                                    <p className="text-sm font-medium text-black mt-0.5">{programme.mode}</p>
                                </div>
                                <div>
                                    <Award size={16} strokeWidth={1.75} className="text-black/30 mb-1.5" />
                                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40">Qualification</p>
                                    <p className="text-sm font-medium text-black mt-0.5">{programme.qualification}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={afterProgrammeContinue} className="self-end bg-[#14263F] text-white text-sm font-semibold px-7 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                            Continue
                        </button>
                    </>
                )}

                {/* Requirements (skipped for tracks with an applicant-type step, e.g. postgraduate) */}
                {step === "requirements" && programme && (
                    <>
                        <BackButton onClick={goBack} />
                        <Breadcrumb items={[config.label, faculty, department, "Requirements"]} />
                        <div className="bg-white rounded-2xl border border-black/5 p-7 flex flex-col gap-6">
                            <div>
                                <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3">General Requirements</p>
                                <div className="flex flex-col gap-2.5">
                                    {config.generalRequirements.map((r, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 size={16} strokeWidth={2} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-black/70">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-5 border-t border-black/5">
                                <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3">Application Requirements</p>
                                <div className="flex flex-col gap-2.5">
                                    {config.applicationRequirements.map((r, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <FileText size={16} strokeWidth={1.75} className="text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-black/70">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#14263F] to-[#1E3A8A] rounded-2xl p-7 text-center">
                            <p className="font-serif text-white text-lg font-semibold mb-4">Ready to begin your application?</p>
                            <button onClick={() => setStep("account")} className="bg-[#B8901F] text-[#14263F] text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                                Create Application Account
                            </button>
                        </div>
                    </>
                )}

                {/* Applicant type — postgraduate only */}
                {step === "applicantType" && (
                    <>
                        <BackButton onClick={goBack} />
                        <p className="text-sm text-black/55 -mt-2">Did you complete your undergraduate degree at EduNova University?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => { setApplicantType("eduNovaGraduate"); setStep("eduNovaLookup") }} className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#1E3A8A]/30 hover:shadow-md transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 flex items-center justify-center">
                                    <UserCheck size={22} strokeWidth={1.5} className="text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <p className="font-serif font-semibold text-black">Yes, I'm an EduNova Graduate</p>
                                    <p className="text-xs text-black/50 mt-1">We'll pull up your academic record to save you time.</p>
                                </div>
                            </button>
                            <button onClick={() => { setApplicantType("external"); setStep("account") }} className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#B8901F]/40 hover:shadow-md transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#B8901F]/10 flex items-center justify-center">
                                    <UserPlus2 size={22} strokeWidth={1.5} className="text-[#B8901F]" />
                                </div>
                                <div>
                                    <p className="font-serif font-semibold text-black">No, From Another Institution</p>
                                    <p className="text-xs text-black/50 mt-1">Create a new applicant account to continue.</p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {/* EduNova graduate lookup */}
                {step === "eduNovaLookup" && (
                    <>
                        <BackButton onClick={() => setStep("applicantType")} />
                        <div className="bg-white rounded-2xl border border-black/5 p-7 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs tracking-wide uppercase text-black/50">EduNova Student ID</label>
                                <input value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)} placeholder="EDU/2026/UG/001245" className="border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                            </div>
                            {lookupError && <p className="text-xs text-red-500">{lookupError}</p>}
                            <button onClick={handleEduNovaLookup} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                                <KeyRound size={16} /> Find My Record
                            </button>
                        </div>
                    </>
                )}

                {/* Create account */}
                {step === "account" && (
                    <>
                        <BackButton onClick={goBack} />
                        <div className="bg-white rounded-2xl border border-black/5 p-7">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                                <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <input placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                                <input placeholder="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="relative">
                                    <input placeholder="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-black/15 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <input placeholder="Confirm Password" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                            </div>
                            <button onClick={handleCreateAccount} disabled={!canCreateAccount} className="w-full bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40">
                                Create Account
                            </button>
                        </div>
                    </>
                )}

                {/* Created / record found */}
                {step === "created" && (
                    <div className="bg-white rounded-3xl border border-black/5 p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 size={30} strokeWidth={1.75} className="text-green-600" />
                        </div>
                        {data.isEduNovaGraduate ? (
                            <>
                                <h2 className="font-serif text-2xl font-semibold text-black mb-2">Record Found</h2>
                                <p className="text-sm text-black/55 mb-6 max-w-sm mx-auto">
                                    We've found your EduNova academic record. Some information has been filled in for you — review it before continuing.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="font-serif text-2xl font-semibold text-black mb-2">Account Created</h2>
                                <p className="text-sm text-black/55 mb-6">Your application number has been generated. Keep it safe.</p>
                            </>
                        )}
                        <div className="flex items-center justify-center gap-2 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-xl px-5 py-3 mb-8 w-fit mx-auto">
                            <span className="font-mono text-sm font-semibold text-[#1E3A8A]">{data.applicationNumber}</span>
                            <button onClick={copyAppNumber} className="text-[#1E3A8A]/60 hover:text-[#1E3A8A] transition-colors">
                                {copied ? <Check size={15} /> : <Copy size={15} />}
                            </button>
                        </div>
                        <button onClick={() => setStep("dashboard")} className="bg-[#14263F] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                            Go to Applicant Dashboard
                        </button>
                    </div>
                )}

                {/* Dashboard */}
                {step === "dashboard" && (
                    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pt-8">
                        <BackButton onClick={() => setStep("entry")} label="Log out" />
                        <div>
                            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black">Welcome, {data.applicantName || "Applicant"} 👋</h1>
                            <p className="text-sm text-black/55 mt-1">Application Number: <span className="font-mono">{data.applicationNumber}</span></p>
                        </div>
                        <div className="bg-white rounded-2xl border border-black/5 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap size={22} strokeWidth={1.5} className="text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] tracking-wide uppercase text-black/40">{config.label} Application</p>
                                    <p className="font-serif font-semibold text-black">{data.programmeTitle || programme?.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-black">Application Progress</p>
                                <p className="text-sm font-semibold text-[#B8901F]">{progressPercent(config.educationMode)}%</p>
                            </div>
                            <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mb-4">
                                <div className="h-full bg-[#B8901F] rounded-full transition-all duration-500" style={{ width: `${progressPercent(config.educationMode)}%` }} />
                            </div>
                            <button
                                onClick={() => navigate(`/admission/apply/${track}/personal-information`)}
                                className="w-full mt-2 bg-[#14263F] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                            >
                                Continue Application
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
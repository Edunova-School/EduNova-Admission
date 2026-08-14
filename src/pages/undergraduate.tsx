import { useState } from "react"
import { ChevronLeft, ChevronRight, Building2, GraduationCap, Clock,Layers, Award, CheckCircle2, Circle, FileText, Eye, EyeOff, Sparkles, Copy, Check, KeyRound, UserPlus, LogIn,} from "lucide-react"
import logo from "../assets/edunova-logo.webp"
const faculties = [
  "Faculty of Engineering & Technology",
  "Faculty of Computing & AI",
  "Faculty of Business & Management",
  "Faculty of Health Sciences",
  "Faculty of Law",
  "Faculty of Education",
  "Faculty of Arts & Humanities",
  "Faculty of Natural & Applied Sciences",
]
const departmentsByFaculty: Record<string, string[]> = {
  "Faculty of Engineering & Technology": [
    "Mechanical Engineering", "Civil Engineering", "Electrical & Electronics Engineering",
    "Chemical Engineering", "Mechatronics Engineering", "Industrial & Production Engineering", "Biomedical Engineering",
  ],
  "Faculty of Computing & AI": ["Computer Science", "Software Engineering", "Artificial Intelligence", "Cybersecurity"],
  "Faculty of Business & Management": ["Accounting", "Marketing", "Business Administration", "Economics"],
  "Faculty of Health Sciences": ["Nursing", "Public Health", "Biomedical Sciences"],
  "Faculty of Law": ["Common Law", "International Law"],
  "Faculty of Education": ["Educational Foundations", "Curriculum Studies"],
  "Faculty of Arts & Humanities": ["English", "History", "Philosophy"],
  "Faculty of Natural & Applied Sciences": ["Physics", "Chemistry", "Biology", "Mathematics"],
}

const programmesByDept: Record<string, { title: string; duration: string; mode: string; qualification: string }> = {
  "Mechanical Engineering": { title: "B.Eng. Mechanical Engineering", duration: "5 Years", mode: "Full-Time", qualification: "Bachelor of Engineering" },
  "Civil Engineering": { title: "B.Eng. Civil Engineering", duration: "5 Years", mode: "Full-Time", qualification: "Bachelor of Engineering" },
  "Computer Science": { title: "B.Sc. Computer Science", duration: "4 Years", mode: "Full-Time", qualification: "Bachelor of Science" },
}

const generalRequirements = [
  "Minimum of five relevant O'Level credits",
  "Mathematics and English Language required",
  "Relevant science subjects required",
]

const applicationRequirements = [
  "O'Level result",
  "Passport photograph",
  "Birth certificate / declaration of age",
  "Valid identification",
  "JAMB information, where applicable",
]
const dashboardSteps = [
  { label: "Account Created", state: "done" },
  { label: "Programme Selected", state: "done" },
  { label: "Personal Information", state: "pending" },
  { label: "Academic Information", state: "pending" },
  { label: "Documents", state: "pending" },
  { label: "Review Application", state: "pending" },
  { label: "Application Fee", state: "pending" },
  { label: "Submit Application", state: "pending" },
]
type Step = "entry" | "faculty" | "department" | "programme" | "requirements" | "account" | "created" | "login" | "dashboard"
const flowOrder: Step[] = ["entry", "faculty", "department", "programme", "requirements", "account", "created"]
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
function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-[#1E3A8A] transition-colors w-fit">
      <ChevronLeft size={16} /> {label}
    </button>
  )
}
export default function UndergraduateAdmission() {
  const [step, setStep] = useState<Step>("entry")
  const [faculty, setFaculty] = useState("")
  const [department, setDepartment] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
  })
  const [loginForm, setLoginForm] = useState({ appNumber: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const programme = department ? programmesByDept[department] ?? programmesByDept["Mechanical Engineering"] : null
  const applicationNumber = "EDU-UG-2026-001245"

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const canCreateAccount =
    form.firstName && form.lastName && form.email && form.phone &&
    form.password.length >= 6 && form.password === form.confirmPassword
  const copyAppNumber = () => {
    navigator.clipboard.writeText(applicationNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const goBack = () => {
    const idx = flowOrder.indexOf(step)
    if (idx > 0) setStep(flowOrder[idx - 1])
  }
  const handleLogin = () => {
    if (!loginForm.appNumber.trim() || !loginForm.password.trim()) {
      setLoginError("Enter your application number and password to continue.")
      return
    }
    setLoginError("")
    setStep("dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2]">
      {step !== "dashboard" && (
        <div className="relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B8901F]/20 rounded-full blur-3xl" />
          <div className="relative px-4 md:px-8 py-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <img src={logo} alt="EduNova" className="h-9 w-auto mb-5 opacity-90" />
            <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-3">
              <Sparkles size={13} /> Undergraduate Application
            </span>
            <h1 className="font-serif text-white text-2xl md:text-3xl font-semibold leading-snug">
              {step === "entry" && "Let's get started"}
              {step === "faculty" && "Select the faculty offering your intended programme."}
              {step === "department" && "Select your department."}
              {step === "programme" && "Available Undergraduate Programmes"}
              {step === "requirements" && programme?.title}
              {(step === "account" || step === "created") && "Create Your Application Account"}
              {step === "login" && "Welcome back"}
            </h1>
          </div>
        </div>
      )}
      <div className="px-4 md:px-8 py-8 max-w-2xl mx-auto flex flex-col gap-5">
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
                <p className="text-xs text-black/50 mt-1">Log in with your application number to pick up where you left off.</p>
              </div>
            </button>
          </div>
        )}
        {step === "login" && (
          <>
            <BackButton onClick={() => setStep("entry")} />
            <div className="bg-white rounded-2xl border border-black/5 p-7">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Application Number</label>
                  <input value={loginForm.appNumber} onChange={(e) => setLoginForm({ ...loginForm, appNumber: e.target.value })} placeholder="EDU-UG-2026-00000" className="border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" className="w-full border border-black/15 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"/>
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
            </div>
          </>
        )}
        {step === "faculty" && (
          <>
            <BackButton onClick={goBack} label="Back to start" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faculties.map((f, i) => (
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
        {step === "department" && (
          <>
            <BackButton onClick={goBack} />
            <Breadcrumb items={["Undergraduate", faculty]} />
            <div className="flex flex-col gap-3">
              {(departmentsByFaculty[faculty] ?? []).map((d, i) => (
                <button key={i} onClick={() => { setDepartment(d); setStep("programme") }} className="group flex items-center justify-between bg-white rounded-xl border border-black/5 px-5 py-4 text-left hover:border-[#1E3A8A]/30 hover:shadow-sm transition-all duration-300">
                  <span className="text-sm font-medium text-black/80 group-hover:text-[#1E3A8A] transition-colors">{d}</span>
                  <ChevronRight size={16} className="text-black/20 group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </>
        )}
        {step === "programme" && programme && (
          <>
            <BackButton onClick={goBack} />
            <Breadcrumb items={["Undergraduate", faculty, department]} />
            <div className="bg-white rounded-2xl border border-black/5 p-7">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A]/8 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={26} strokeWidth={1.5} className="text-[#1E3A8A]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-black">{programme.title}</h3>
                  <a href="#" className="text-xs text-[#1E3A8A] hover:underline mt-1 inline-block">View Programme Details</a>
                </div>
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
            <button onClick={() => setStep("requirements")} className="self-end bg-[#14263F] text-white text-sm font-semibold px-7 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">Continue</button>
          </>
        )}

        {/* STEP: Requirements */}
        {step === "requirements" && programme && (
          <>
            <BackButton onClick={goBack} />
            <Breadcrumb items={["Undergraduate", faculty, department, "Requirements"]} />
            <div className="bg-white rounded-2xl border border-black/5 p-7 flex flex-col gap-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3">General Requirements</p>
                <div className="flex flex-col gap-2.5">
                  {generalRequirements.map((r, i) => (
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
                  {applicationRequirements.map((r, i) => (
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
              <button onClick={() => setStep("account")} className="bg-[#B8901F] text-[#14263F] text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">Create Application Account</button>
            </div>
          </>
        )}
        {/* STEP: Create Account */}
        {step === "account" && (
          <>
            <BackButton onClick={goBack} />
            <div className="bg-white rounded-2xl border border-black/5 p-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Middle Name</label>
                  <input name="middleName" value={form.middleName} onChange={handleFormChange} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Phone Number</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Password</label>
                  <div className="relative">
                    <input
                      name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleFormChange}
                      className="w-full border border-black/15 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs tracking-wide uppercase text-black/50">Confirm Password</label>
                  <input name="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleFormChange} className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"/>
                </div>
              </div>
              <button onClick={() => setStep("created")} disabled={!canCreateAccount} className="w-full bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40">Create Account</button>
            </div>
          </>
        )}
        {/* STEP: Created */}
        {step === "created" && (
          <div className="bg-white rounded-3xl border border-black/5 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={30} strokeWidth={1.75} className="text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-black mb-2">Account Created</h2>
            <p className="text-sm text-black/55 mb-6">Your application number has been generated. Keep it safe — you'll use it to log back in.</p>

            <div className="flex items-center justify-center gap-2 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-xl px-5 py-3 mb-8 w-fit mx-auto">
              <span className="font-mono text-sm font-semibold text-[#1E3A8A]">{applicationNumber}</span>
              <button onClick={copyAppNumber} className="text-[#1E3A8A]/60 hover:text-[#1E3A8A] transition-colors">
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>

            <button
              onClick={() => setStep("dashboard")}
              className="bg-[#14263F] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              Go to Applicant Dashboard
            </button>
          </div>
        )}
        {step === "dashboard" && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pt-8">
            <BackButton onClick={() => setStep("entry")} label="Log out" />
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black">
                Welcome, {form.firstName || "Applicant"} 
              </h1>
              <p className="text-sm text-black/55 mt-1">Application Number: <span className="font-mono">{applicationNumber}</span></p>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={22} strokeWidth={1.5} className="text-[#1E3A8A]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-black/40">Undergraduate Application</p>
                  <p className="font-serif font-semibold text-black">{programme?.title ?? "B.Eng. Mechanical Engineering"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-black">Application Progress</p>
                <p className="text-sm font-semibold text-[#B8901F]">20%</p>
              </div>
              <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mb-6">
                <div className="h-full bg-[#B8901F] rounded-full" style={{ width: "20%" }} />
              </div>
              <div className="flex flex-col gap-3">
                {dashboardSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {s.state === "done" ? (
                      <CheckCircle2 size={18} strokeWidth={2} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={18} strokeWidth={1.75} className="text-black/20 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${s.state === "done" ? "text-black/70 font-medium" : "text-black/40"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-[#14263F] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                Continue: Personal Information
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
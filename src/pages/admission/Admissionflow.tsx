    import { register, login,logout, getToken, verifyEmail  } from "../../lib/api"
    import { useState, useEffect } from "react"
    import { useNavigate, useParams } from "react-router-dom"
    import {
        ChevronLeft, ChevronRight, Building2, GraduationCap, Clock, Layers, Award,
        CheckCircle2, FileText, Eye, EyeOff, Sparkles, LogOut, KeyRound,
        UserPlus, LogIn, UserCheck, UserPlus2, ClipboardCheck, FileCheck2, AlertTriangle, ArrowRight, UserRound, Bell, Clock3, CircleCheck, LockKeyhole,
    } from "lucide-react"
    import logo from "../../assets/edunova-logo.webp"
    import { useApplication } from "./ApplicationContext"
    import { trackConfigs } from "./trackconfig"
    import type { Track } from "./trackconfig"

    type Step =
        | "entry" | "login" | "faculty" | "department" | "programme" | "requirements"
        | "applicantType" | "eduNovaLookup" | "account" | "verify" | "created" | "dashboard"

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
    const validateEmail = (email: string) => {
    const value = email.trim().toLowerCase();

    if (!value) {
        return "Email address is required.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
        return "Enter a valid email address, e.g. name@gmail.com.";
    }

    const [, domain] = value.split("@");

    const standardDomains = [
        "gmail.com",
        "yahoo.com",
        "yahoo.co.uk",
        "outlook.com",
        "hotmail.com",
        "live.com",
        "icloud.com",
        "me.com",
        "proton.me",
        "protonmail.com",
        "aol.com",
        "mail.com",
        "zoho.com",
    ];

    const isStandardDomain = standardDomains.includes(domain);

    // Allow institutional/educational domains
    const isInstitutionalDomain =
        domain.endsWith(".edu") ||
        domain.endsWith(".edu.ng") ||
        domain.endsWith(".ac.ng") ||
        domain.endsWith(".edu.ng");

    if (!isStandardDomain && !isInstitutionalDomain) {
        return "Please use a standard email provider such as Gmail, Yahoo, or Outlook.";
    }

    return "";
    };
    const validatePhone = (phone: string) => {
    const value = phone.trim();

    if (!value) {
        return "Phone number is required.";
    }

    const phoneRegex = /^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/;

    if (!phoneRegex.test(value)) {
        return "Enter a valid Nigerian phone number, e.g. 08012345678.";
    }

    return "";
    };

    const validatePassword = (password: string) => {
    if (!password) {
        return "Password is required.";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (!/[A-Za-z]/.test(password)) {
        return "Password must contain at least one letter.";
    }

    if (!/\d/.test(password)) {
        return "Password must contain at least one number.";
    }

    return "";
    };
    export default function AdmissionFlow() {
        const { track: trackParam } = useParams<{ track: string }>()
        const track = (trackParam ?? "undergraduate") as Track
        const config = trackConfigs[track]

        const navigate = useNavigate()

    const {
    data,
    setTrack,
    setSelection,
    setApplicantType,
    prefillFromEduNovaRecord,
    setAccountCreated,
    progressPercent,
    isPersonalComplete,
    isEducationComplete,
    refreshProfile,
    resetApplication,
    } = useApplication()

        const [step, setStep] = useState<Step>("entry")
        const [isRestoringSession, setIsRestoringSession] = useState(false)
        const [faculty, setFaculty] = useState("")
        const [department, setDepartment] = useState("")
        const [showPassword, setShowPassword] = useState(false)
        const [studentIdInput, setStudentIdInput] = useState("")
        const [lookupError, setLookupError] = useState("")
        const [activeSection, setActiveSection] = useState<
    "application" | "academic" | "documents" | "personal"
>("application")
        const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" })
        const [loginForm, setLoginForm] = useState({ LogEmail: "", password: "" })
        const [loginError, setLoginError] = useState("")
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
        const [accountError, setAccountError] = useState("")
        const [fieldErrors, setFieldErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    });
        const [otp, setOtp] = useState("")
    const [verifyError, setVerifyError] = useState("")
        const programme = department ? config.programmesByDept[department] ?? null : null
        console.log("TRACK:", track)
    console.log("DEPARTMENT:", department)
    console.log("CONFIG PROGRAMME:", config.programmesByDept[department])
    console.log("TOKEN ON ADMISSION FLOW MOUNT:", getToken())
    
useEffect(() => {
    const authenticated = sessionStorage.getItem(
        "edunova_authenticated"
    )

    const pendingVerification = sessionStorage.getItem(
        "edunova_pending_verification"
    )

    // User created an account but has not verified
    // their email yet. Keep them on OTP, including refresh.
 if (pendingVerification) {
    sessionStorage.removeItem("edunova_pending_verification")
    sessionStorage.removeItem("edunova_pending_email")

    setOtp("")
    setVerifyError("")
    setIsRestoringSession(false)
    return
}

    // User is authenticated.
    if (authenticated) {
        const restoreSession = async () => {
            setIsRestoringSession(true)

            try {
                await refreshProfile()
                setStep("dashboard")
            } catch (error) {
                console.error(
                    "Failed to restore session:",
                    error
                )

                sessionStorage.removeItem(
                    "edunova_authenticated"
                )

                setStep("entry")
            } finally {
                setIsRestoringSession(false)
            }
        }

        restoreSession()
        return
    }

    setIsRestoringSession(false)
}, [])
    useEffect(() => {
        if (data.track !== track) setTrack(track)
    }, [track, data.track, setTrack])

        const goBack = () => {
            const idx = flowOrder.indexOf(step)
            if (idx > 0) {
                let prevStep = flowOrder[idx - 1]
                if (prevStep === "requirements" && !config.hasApplicantTypeStep) {
                }
                setStep(prevStep)
            } else {
                setStep("entry")
            }
        }
        const canCreateAccount =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    validateEmail(form.email) === "" &&
    validatePhone(form.phone) === "" &&
    validatePassword(form.password) === "" &&
    form.password === form.confirmPassword;
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

        const handleLogin = async () => {
        if (!loginForm.LogEmail.trim() || !loginForm.password.trim()) {
            setLoginError("Enter your application number/email and password to continue.")
            return
        }
        setLoginError("")
        setIsSubmitting(true)
    try {
        await login(loginForm.LogEmail, loginForm.password)
        sessionStorage.setItem("edunova_authenticated", "true")
    await refreshProfile()
    setStep("dashboard")
        } catch (err) {
            setLoginError(err instanceof Error ? err.message : "Invalid credentials. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
        }

    const handleCreateAccount = async () => {
    console.log("CREATE ACCOUNT CLICKED")

    setAccountError("")
    setIsSubmitting(true)

    try {
        console.log("BEFORE REGISTER")
    console.log("PROGRAMME OBJECT:", programme)
    console.log("PROGRAMME TITLE BEING SENT:", programme?.title)
    await register({
    first_name: form.firstName,
    last_name: form.lastName,
    phone_number: form.phone,
    email: form.email,
    password: form.password,
    programme_name: programme?.title ?? "",
    });

    console.log("REGISTER SUCCESS");

    await login(form.email, form.password);

    sessionStorage.setItem("edunova_pending_verification", "true");
    sessionStorage.setItem("edunova_pending_email", form.email);

    console.log("LOGIN SUCCESS");
        console.log("SELECTED PROGRAMME:", programme)
        console.log("PROGRAMME NAME:", programme?.title)

        setSelection(faculty, department, programme?.title ?? "")
        setAccountCreated(
        `${form.firstName} ${form.lastName}`.trim(),
        form.email
        )
        setStep("verify")
    } catch (err) {
    console.error("CREATE ACCOUNT ERROR:", err)
    console.error("REGISTER ERROR OBJECT:", err)

    setAccountError(
        err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    )
    } finally {
        setIsSubmitting(false)
    }
    }
    const handleVerifyContinue = async () => {
    setVerifyError("")
    setIsSubmitting(true)

    try {
        await verifyEmail(form.email, otp)

        sessionStorage.removeItem("edunova_pending_verification")
        sessionStorage.removeItem("edunova_pending_email")
        sessionStorage.setItem("edunova_authenticated", "true")

        await refreshProfile()

        setStep("created")
    } catch (err) {
        console.error("VERIFY OTP ERROR:", err)

        setVerifyError(
        err instanceof Error
            ? err.message
            : "Invalid or expired OTP. Please try again."
        )
    } finally {
        setIsSubmitting(false)
    }
    }
    
    const getNextApplicationStep = () => {
        if (!isPersonalComplete) {
            return "personal-information"
        }

        if (!isEducationComplete(config.educationMode)) {
            return "education"
        }

        if (!data.documents.primaryResult || !data.documents.passportPhoto || !data.documents.idDocument) {
            return "documents"
        }

        return "review"
    }
    if (isRestoringSession) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
            <img
                src={logo}
                alt="EduNova"
                className="w-20 h-20 mx-auto mb-4"
            />

            <div className="w-6 h-6 mx-auto border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-gray-500">
                Restoring your application...
            </p>
            </div>
        </div>
        )
    }
        return (
            <div className="min-h-screen bg-[#F6F6F2]">
                {step !== "dashboard" && (
                    <div className="relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A] overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B8901F]/20 rounded-full blur-3xl" />
                        <div className="relative px-4 md:px-8 py-10 max-w-2xl mx-auto text-center flex flex-col items-center">
                            <div className="bg-white rounded-md  mb-5">
                                <img src={logo} alt="EduNova" className="h-9 m-1  w-auto opacity-90" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B8901F] mb-3">
                                <Sparkles size={13} /> {config.heroLabel}
                            </span>
                            <div className="font-serif text-white text-2xl md:text-3xl font-semibold leading-snug">
                                {step === "entry" && "Let's get started"}
                                {step === "login" && "Welcome back"}
                                {step === "faculty" && "Select the faculty offering your intended programme."}
                                {step === "department" && "Select your department."}
                                {step === "programme" && `Available ${config.label} Programmes`}
                                {step === "requirements" && programme?.title}
                                {step === "applicantType" && "Tell us about your background"}
                                {step === "eduNovaLookup" && "Welcome back, EduNova graduate"}
                                {step === "verify" && (
        <div className="bg-white rounded-3xl border border-black/5 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center mx-auto mb-5">
                <KeyRound size={26} strokeWidth={1.75} className="text-[#1E3A8A]" />
            </div>

            <h2 className="font-serif text-2xl font-semibold text-black mb-2">
                Verify Your Email
            </h2>

            <p className="text-sm text-black/55 mb-6 max-w-sm mx-auto">
                We've sent a verification code to{" "}
                <span className="font-medium text-black">{form.email}</span>.
                Enter the OTP below to verify your account.
            </p>

            <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-black/15 rounded-xl px-4 py-3 text-center text-lg text-black placeholder:text-black/30 tracking-[0.4em] focus:outline-none focus:border-[#1E3A8A] mb-4"
            />

            {verifyError && (
                <p className="text-xs text-red-500 mb-3">
                    {verifyError}
                </p>
            )}

            <button
                onClick={handleVerifyContinue}
                disabled={otp.length !== 6 || isSubmitting}
                className="w-full bg-[#14263F] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 disabled:opacity-40"
            >
                {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
        </div>
    )}
                                {(step === "account" || step === "created") && "Create Your Application Account"}
                            </div>
                        </div>
                    </div>
                )}
                <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto flex flex-col gap-5">

                    {/* Entry */}
                    {step === "entry" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <button
    onClick={() => {
        sessionStorage.removeItem("edunova_pending_verification")
        sessionStorage.removeItem("edunova_pending_email")
        setOtp("")
        setVerifyError("")
        setStep("faculty")
    }}
    className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#1E3A8A]/30 hover:shadow-md transition-all duration-300"
>
                                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 flex items-center justify-center">
                                    <UserPlus size={22} strokeWidth={1.5} className="text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <p className="font-serif font-semibold text-black">Start New Application</p>
                                    <p className="text-xs text-black/50 mt-1">Choose your programme and create an application account.</p>
                                </div>
                            </button>
                            <button
    onClick={() => {
        setStep("login")
    }}
    className="group flex flex-col items-start gap-3 bg-white rounded-2xl border border-black/5 p-6 text-left hover:border-[#1E3A8A]/30 hover:shadow-md transition-all duration-300"
    >
    <div className="w-12 h-12 rounded-xl bg-[#B8901F]/10 flex items-center justify-center">
        <LogIn size={22} strokeWidth={1.5} className="text-[#B8901F]" />
    </div>

    <div>
        <p className="font-serif font-semibold text-black">
        Continue Application
        </p>
        <p className="text-xs text-black/50 mt-1">
        Log in to pick up where you left off.
        </p>
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
                                    <label className="font-mono text-xs tracking-wide uppercase text-black/50">Email</label>
                                    <input value={loginForm.LogEmail} onChange={(e) => setLoginForm({ ...loginForm, LogEmail: e.target.value })} className="border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" />
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
                                <button onClick={handleLogin} disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1">
                                    <KeyRound size={16} /> {isSubmitting ? "Logging in..." : "Continue Application"}
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
                    {step === "account" && (
                        <>
                            <BackButton onClick={() => setStep("requirements")} />
                            <div className="bg-white rounded-2xl border border-black/5 p-7">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                                    <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <input
    placeholder="Email Address"
    type="email"
    value={form.email}
    onChange={(e) => {
        const value = e.target.value;
        setForm({ ...form, email: value });
        setFieldErrors({
        ...fieldErrors,
        email: validateEmail(value),
        });
    }}  className="border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] w-full"/>
    {fieldErrors.email && (
    <p className="text-xs text-red-500 mt-1">
        {fieldErrors.email}
    </p>
    )}
                                </div>
                                    <div>
    <input
        placeholder="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(e) => {
        const value = e.target.value;
        setForm({ ...form, phone: value });
        setFieldErrors({
            ...fieldErrors,
            phone: validatePhone(value),
        });
        }}
        className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
    />

    {fieldErrors.phone && (
        <p className="text-xs text-red-500 mt-1">
        {fieldErrors.phone}
        </p>
    )}
    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="relative">
    <input
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={(e) => {
        const value = e.target.value;

        setForm({ ...form, password: value });

        setFieldErrors({
            ...fieldErrors,
            password: validatePassword(value),
            confirmPassword:
            form.confirmPassword && value !== form.confirmPassword
                ? "Passwords do not match."
                : "",
        });
        }}
        className="w-full border border-black/15 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#1E3A8A]"
    />

    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60"
    >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
    </div>

    {fieldErrors.password && (
    <p className="text-xs text-red-500 mt-1">
        {fieldErrors.password}
    </p>
    )}
        </div>   
                                                            <div>
    <input
        placeholder="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={form.confirmPassword}
        onChange={(e) => {
        const value = e.target.value;

        setForm({ ...form, confirmPassword: value });

        setFieldErrors({
            ...fieldErrors,
            confirmPassword:
            value !== form.password
                ? "Passwords do not match."
                : "",
        });
        }}
        className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
    />

    {fieldErrors.confirmPassword && (
        <p className="text-xs text-red-500 mt-1">
        {fieldErrors.confirmPassword}
        </p>
    )}
    </div>
                                </div>
                                {accountError && <p className="text-xs text-red-500 mb-3">{accountError}</p>}
                                <button onClick={handleCreateAccount} disabled={!canCreateAccount || isSubmitting} className="w-full bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40">
                                    {isSubmitting ? "Creating account..." : "Create Account"}
                                </button>
                            </div>
                        </>
                    )}
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
                            <button onClick={() => setStep("dashboard")} className="bg-[#14263F] text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                                Go to Applicant Dashboard
                            </button>
                        </div>
                    )}
                    {step === "dashboard" && (
        <div className="w-full mx-auto flex flex-col gap-10 pt-6 pb-14 bg-[#F6F6F2]">

            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-[#B8901F]">
                        Applicant Portal
                    </p>
                    <h1 className="font-serif font-semibold text-black mt-2 text-[1.9rem] md:text-[2.4rem] leading-[1.05]">
                        Welcome, {data.applicantName || "Applicant"}
                    </h1>
                </div>
            <button
    onClick={() => setShowLogoutConfirm(true)}
    className="group inline-flex items-center justify-center gap-2 text-sm font-medium text-black/60 px-4 py-2 rounded-full border border-black/10 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors duration-200 self-start sm:self-auto"
    >
    <LogOut
        size={15}
        strokeWidth={1.8}
        className="text-black/40 group-hover:text-red-500 transition-colors"
    />
    Log out
    </button>
            </div>
            {showLogoutConfirm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <LogOut
            size={20}
            strokeWidth={1.8}
            className="text-red-500"
            />
        </div>

        <h2 className="font-serif text-xl font-semibold text-black">
            Log out?
        </h2>

        <p className="text-sm text-black/55 mt-2 leading-relaxed">
            Are you sure you want to log out of your application account?
        </p>

        <div className="flex gap-3 mt-6">
            <button
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition-colors"
            >
            Cancel
            </button>

            <button
            onClick={async () => {
                try {
                await logout()
                } catch (error) {
                console.error("Logout failed:", error)
                } finally {
                sessionStorage.removeItem("edunova_authenticated")
                resetApplication()
                setStep("entry")
                setShowLogoutConfirm(false)
                }
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
            Log out
            </button>
        </div>
        </div>
    </div>
    )}

            {/* Hero status panel */}
            <div className="rounded-[28px] overflow-hidden relative bg-gradient-to-br from-[#0B1524] via-[#14263F] to-[#1E3A8A]">

                <svg className="absolute -right-10 -top-10 opacity-[0.14]" width="260" height="260" viewBox="0 0 260 260" fill="none">
                    <circle cx="130" cy="130" r="128" stroke="#B8901F" strokeWidth="1" />
                    <circle cx="130" cy="130" r="104" stroke="#B8901F" strokeWidth="1" />
                    <circle cx="130" cy="130" r="80" stroke="#B8901F" strokeWidth="1" />
                </svg>

                <div className="relative p-7 md:p-10 text-white">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div>
                            <p className="text-xs mb-2 text-white/50">
                                {config.label} Application · 2026/2027
                            </p>
                            <h2 className="font-serif font-semibold text-[1.4rem] md:text-[1.8rem] leading-[1.15]">
                                {data.programmeTitle || "Programme not selected"}
                            </h2>
                            <p className="text-sm mt-1 text-white/60">
                                {data.department || "Department"}
                            </p>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="font-serif font-semibold text-white text-[3rem] leading-none">
                                {progressPercent(config.educationMode)}
                            </span>
                            <span className="text-sm text-white/50">% complete</span>
                        </div>
                    </div>

                    <div className="w-full h-[3px] rounded-full mt-6 bg-white/15">
                        <div
                            className="h-full rounded-full bg-[#B8901F] transition-all duration-500"
                            style={{ width: `${progressPercent(config.educationMode)}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-7">
                        <span className="inline-flex items-center gap-2 text-xs text-white/65">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8901F]" />
                            {data.submitted ? "Submitted — awaiting decision" : "In progress"}
                        </span>

                        {!data.submitted && (
                            <button
                                onClick={() =>
                                    navigate(`/admission/apply/${track}/${getNextApplicationStep()}`)
                                }
                                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-[#B8901F] text-[#0B1524] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
                            >
                                Continue application
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick nav strip — real tap targets, not bare links */}
            {/* Application sections */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-10">

                {/* Timeline */}
                <div>
                    <h3 className="font-serif font-semibold text-lg text-black mb-7">
                        Your application journey
                    </h3>

                    {(() => {
                        const documentsComplete =
                            !!data.documents.primaryResult &&
                            !!data.documents.passportPhoto &&
                            !!data.documents.idDocument;

                        const docLabels: Array<[boolean, string]> = [
                            [!!data.documents.primaryResult, "Result"],
                            [!!data.documents.passportPhoto, "Passport photograph"],
                            [!!data.documents.idDocument, "ID document"],
                        ];
                        const docsUploadedCount = docLabels.filter(([done]) => done).length;
                        const missingDocs = docLabels.filter(([done]) => !done).map(([, label]) => label);

                        const steps = [
                            { label: "Account created", done: true },
                            { label: "Personal information", done: isPersonalComplete },
                            { label: "Academic information", done: isEducationComplete(config.educationMode) },
                            { label: "Documents", done: documentsComplete, detail: `${docsUploadedCount} of 3 uploaded` },
                            { label: "Submission", done: data.submitted },
                        ];
                        const currentIndex = steps.findIndex((s) => !s.done);

                        return (
                            <>
                                {/* desktop horizontal stepper */}
                                <div className="hidden md:grid grid-cols-5 gap-0">
                                    {steps.map((s, i) => {
                                        const isCurrent = i === currentIndex;
                                        return (
                                            <div className="flex flex-col" key={s.label}>
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                            s.done
                                                                ? "bg-green-50"
                                                                : isCurrent
                                                                ? "border-2 border-[#B8901F]"
                                                                : "border border-black/10"
                                                        }`}
                                                    >
                                                        {s.done ? (
                                                            <CircleCheck size={16} className="text-green-600" />
                                                        ) : isCurrent ? (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8901F]" />
                                                        ) : (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-black/25" />
                                                        )}
                                                    </div>
                                                    {i < steps.length - 1 && (
                                                        <div className={`h-px flex-1 ${s.done ? "bg-green-500/50" : "bg-black/10"}`} />
                                                    )}
                                                </div>
                                                <p className={`text-sm font-medium mt-3 ${!s.done && !isCurrent ? "text-black/35" : "text-black"}`}>
                                                    {s.label}
                                                </p>
                                                <p className={`text-xs mt-1 ${isCurrent ? "text-[#B8901F]" : "text-black/35"}`}>
                                                    {s.detail ?? (s.done ? "Complete" : "Not yet")}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* mobile vertical stepper */}
                                <div className="md:hidden flex flex-col">
                                    {steps.map((s, i) => {
                                        const isCurrent = i === currentIndex;
                                        return (
                                            <div className="flex gap-4" key={s.label}>
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                            s.done
                                                                ? "bg-green-50"
                                                                : isCurrent
                                                                ? "border-2 border-[#B8901F]"
                                                                : "border border-black/10"
                                                        }`}
                                                    >
                                                        {s.done ? (
                                                            <CircleCheck size={16} className="text-green-600" />
                                                        ) : isCurrent ? (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8901F]" />
                                                        ) : (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-black/25" />
                                                        )}
                                                    </div>
                                                    {i < steps.length - 1 && (
                                                        <div className={`w-px flex-1 my-1 ${s.done ? "bg-green-500/50" : "bg-black/10"}`} />
                                                    )}
                                                </div>
                                                <div className={i < steps.length - 1 ? "pb-6" : ""}>
                                                    <p className={`text-sm font-medium ${!s.done && !isCurrent ? "text-black/35" : "text-black"}`}>
                                                        {s.label}
                                                    </p>
                                                    <p className={`text-xs mt-0.5 ${isCurrent ? "text-[#B8901F]" : "text-black/35"}`}>
                                                        {s.detail ?? (s.done ? "Complete" : "Not yet")}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* missing documents note */}
                                {!documentsComplete && missingDocs.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-black/5 flex items-start gap-3">
                                        <AlertTriangle size={17} className="text-[#B8901F] mt-0.5 shrink-0" strokeWidth={1.6} />
                                        <p className="text-sm text-black/60">
                                            Still needed: {missingDocs.join(", ")}. Add {missingDocs.length > 1 ? "these" : "it"} to move on to submission.
                                        </p>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-8">

                    {/* Admission status + programme facts */}
                    <div className="rounded-2xl p-6 bg-white border border-black/5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif font-semibold text-base text-black">
                                {data.submitted ? "Under review" : "Application in progress"}
                            </h3>
                            <Clock3 size={19} strokeWidth={1.6} className="text-[#B8901F]" />
                        </div>
                        <p className="text-sm mt-2 text-black/50 leading-relaxed">
                            {data.submitted
                                ? "Your application has been received and is awaiting an admission decision."
                                : "Complete and submit your application to begin the admission review process."}
                        </p>

                        <dl className="mt-6 flex flex-col">
                            <div className="flex items-center justify-between py-2.5 border-t border-black/5">
                                <dt className="text-xs text-black/35">Faculty</dt>
                                <dd className="text-sm text-black text-right">{data.faculty || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-t border-black/5">
                                <dt className="text-xs text-black/35">Department</dt>
                                <dd className="text-sm text-black text-right">{data.department || "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-t border-black/5">
                                <dt className="text-xs text-black/35">Programme</dt>
                                <dd className="text-sm text-black text-right">{data.programmeTitle || "—"}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-start gap-3 px-1">
                        <Bell size={17} strokeWidth={1.6} className="text-black/35 mt-0.5 shrink-0" />
                        <p className="text-xs leading-relaxed text-black/40">
                            You'll be notified here as soon as there's an update on your application or admission decision.
                        </p>
                    </div>

                </div>
            </div>
<div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
    {[
        { icon: ClipboardCheck, label: "Application", section: "application" as const },
        { icon: GraduationCap, label: "Academic information", section: "academic" as const },
        { icon: FileCheck2, label: "Documents", section: "documents" as const },
        { icon: UserRound, label: "Personal information", section: "personal" as const },
    ].map(({ icon: Icon, label, section }) => (
        <button
            key={label}
            onClick={() => setActiveSection(section)}
            className={`group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-white border transition-colors duration-200 ${
                activeSection === section
                    ? "border-[#B8901F]/40 bg-[#FBF7EC]"
                    : "border-black/[0.06] hover:border-[#B8901F]/40 hover:bg-[#FBF7EC]"
            }`}
        >
            <span className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    activeSection === section
                        ? "bg-[#B8901F]/10"
                        : "bg-black/[0.03] group-hover:bg-[#B8901F]/10"
                }`}>
                    <Icon
                        size={15}
                        strokeWidth={1.6}
                        className={`transition-colors ${
                            activeSection === section
                                ? "text-[#B8901F]"
                                : "text-black/45 group-hover:text-[#B8901F]"
                        }`}
                    />
                </span>

                <span className="text-sm font-medium text-black">
                    {label}
                </span>
            </span>

            <ChevronRight
                size={14}
                className={`transition-all ${
                    activeSection === section
                        ? "text-[#B8901F]"
                        : "text-black/20 group-hover:text-[#B8901F] group-hover:translate-x-0.5"
                }`}
            />
        </button>
    ))}
</div>
{data.submitted && activeSection === "application" && (
    <div className="bg-white rounded-2xl border border-black/5 p-7">
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#B8901F]">
                    Submitted application
                </p>
                <h3 className="font-serif text-xl font-semibold text-black mt-1">
                    Application information
                </h3>
            </div>

            <CheckCircle2
                size={20}
                className="text-green-600"
                strokeWidth={1.7}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <p className="text-xs text-black/35 mb-1">Faculty</p>
                <p className="text-sm font-medium text-black">
                    {data.faculty || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">Department</p>
                <p className="text-sm font-medium text-black">
                    {data.department || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">Programme</p>
                <p className="text-sm font-medium text-black">
                    {data.programmeTitle || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">Application number</p>
                <p className="text-sm font-medium text-black">
                    {data.applicationNumber || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">Application status</p>
                <p className="text-sm font-medium text-green-600">
                    Submitted — awaiting decision
                </p>
            </div>
        </div>
    </div>
)}
{data.submitted && activeSection === "academic" && (
    <div className="bg-white rounded-2xl border border-black/5 p-7">
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#B8901F]">
                    Submitted academic details
                </p>
                <h3 className="font-serif text-xl font-semibold text-black mt-1">
                    Academic information
                </h3>
            </div>

            <LockKeyhole
                size={19}
                className="text-black/30"
                strokeWidth={1.7}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div>
                <p className="text-xs text-black/35 mb-1">
                    Secondary school
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.schoolName || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Examination type
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.examType || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Examination number
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.examNumber || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Examination year
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.examYear || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    JAMB registration number
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.jambNumber || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    JAMB score
                </p>
                <p className="text-sm font-medium text-black">
                    {data.education.jambScore || "—"}
                </p>
            </div>
        </div>

        {data.education.subjects.length > 0 && (
            <div className="mt-7 pt-6 border-t border-black/5">
                <p className="text-xs text-black/35 mb-3">
                    O'Level subjects
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-black/5">
                                <th className="text-left py-3 font-medium text-black/40">
                                    Subject
                                </th>
                                <th className="text-left py-3 font-medium text-black/40">
                                    Grade
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.education.subjects.map((subject, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-black/5 last:border-b-0"
                                >
                                    <td className="py-3 text-black">
                                        {subject.subject || "—"}
                                    </td>
                                    <td className="py-3 text-black font-medium">
                                        {subject.grade || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <div className="flex items-start gap-2 mt-6 pt-5 border-t border-black/5">
            <LockKeyhole
                size={14}
                className="text-black/30 mt-0.5 shrink-0"
                strokeWidth={1.7}
            />
            <p className="text-xs text-black/40 leading-relaxed">
                This academic information was submitted with your
                application and cannot be changed after submission.
            </p>
        </div>
    </div>
)}
{data.submitted && activeSection === "documents" && (
    <div className="bg-white rounded-2xl border border-black/5 p-7">
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#B8901F]">
                    Submitted documents
                </p>
                <h3 className="font-serif text-xl font-semibold text-black mt-1">
                    Application documents
                </h3>
            </div>

            <CheckCircle2
                size={20}
                className="text-green-600"
                strokeWidth={1.7}
            />
        </div>

        <div className="flex flex-col">
            {[
                {
                    label: "Primary result",
                    value: data.documents.primaryResult,
                },
                {
                    label: "Passport photograph",
                    value: data.documents.passportPhoto,
                },
                {
                    label: "ID document",
                    value: data.documents.idDocument,
                },
                {
                    label: "Supporting document",
                    value: data.documents.supporting,
                },
            ].map((document) => (
                <div
                    key={document.label}
                    className="flex items-center justify-between gap-4 py-4 border-t border-black/5 first:border-t-0"
                >
                    <div>
                        <p className="text-sm font-medium text-black">
                            {document.label}
                        </p>
                        <p className="text-xs text-black/40 mt-1">
                            {document.value ? "Uploaded" : "Not uploaded"}
                        </p>
                    </div>

                    {document.value ? (
                        <a
                            href={document.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium text-[#1E3A8A] hover:text-[#B8901F] transition-colors"
                        >
                            <Eye size={15} />
                            View
                        </a>
                    ) : (
                        <span className="text-xs text-black/30">
                            —
                        </span>
                    )}
                </div>
            ))}
        </div>

        <p className="text-xs text-black/35 mt-5 pt-5 border-t border-black/5">
            These are the documents submitted with your application.
        </p>
    </div>
)}
{data.submitted && activeSection === "personal" && (
    <div className="bg-white rounded-2xl border border-black/5 p-7">
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#B8901F]">
                    Applicant details
                </p>
                <h3 className="font-serif text-xl font-semibold text-black mt-1">
                    Personal information
                </h3>
            </div>

            <LockKeyhole
                size={19}
                className="text-black/30"
                strokeWidth={1.7}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div>
                <p className="text-xs text-black/35 mb-1">
                    Full name
                </p>
                <p className="text-sm font-medium text-black">
                    {data.applicantName || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Phone number
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.phone_number || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Alternate phone number
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.alternate_phone_number || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Date of birth
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.date_of_birth || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Gender
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.gender || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    Nationality
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.nationality || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    State of origin
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.state_of_origin || "—"}
                </p>
            </div>

            <div>
                <p className="text-xs text-black/35 mb-1">
                    LGA of origin
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.lga_of_origin || "—"}
                </p>
            </div>

            <div className="md:col-span-2">
                <p className="text-xs text-black/35 mb-1">
                    Address
                </p>
                <p className="text-sm font-medium text-black">
                    {data.personal.address || "—"}
                </p>
            </div>
        </div>

        <div className="flex items-start gap-2 mt-6 pt-5 border-t border-black/5">
            <LockKeyhole
                size={14}
                className="text-black/30 mt-0.5 shrink-0"
                strokeWidth={1.7}
            />
            <p className="text-xs text-black/40 leading-relaxed">
                This information was submitted with your application and
                cannot be changed after submission.
            </p>
        </div>
    </div>
)}
            {/* Footer bar — a real command row, not a caption */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-black/10">
                <p className="inline-flex items-center gap-2 text-xs text-black/40">
                    <LockKeyhole size={13} className="shrink-0" />
                    Application information cannot be changed after submission.
                </p>
                
            </div>

        </div>
    )}
                </div>
            </div>
        )
    }
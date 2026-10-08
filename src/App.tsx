  import { Routes, Route, useNavigate,  } from "react-router-dom";
  import { useEffect, useState } from "react"
  import AdmissionPortal from "./pages/signup";
  import { scheduleSessionExpiry } from "./lib/api";
  // import UndergraduateAdmission from "./pages/undergraduate";
  // import { ApplicationProvider } from "./pages/ApplicationContext";
  // import ApplicantLayout from "./pages/ApplicantLayout";
  // import PersonalInformation from "./pages/PersonalInformation";
  // import AcademicInformation from "./pages/AcademicInformation";
  // import DocumentsPage from "./pages/DocumentsPage";
  // import ReviewApplication from "./pages/ReviewApplication";
  // import ApplicationFeePage from "./pages/ApplicationFeePage";
  // import SubmitApplicationPage from "./pages/SubmitApplicationPage";
  import { ApplicationProvider } from "./pages/admission/ApplicationContext"
  import AdmissionFlow from "./pages/admission/Admissionflow"
  import ApplicantLayout from "./pages/admission/ApplicantLayout"
  import PersonalInformation from "./pages/admission/PersonalInformation"
  import EducationPage from "./pages/admission/EducationPage"
  import DocumentsPage from "./pages/admission/DocumentsPage"
  import ReviewApplication from "./pages/admission/Reviewapplication"
  import ApplicationFeePage from "./pages/admission/Applicationfeepage"
  import SubmitApplicationPage from "./pages/admission/Submitapplicationpage"
  import VerifyEmail from "./pages/admission/VerifyEmail";

const DEFAULT_MSG = "Your session has expired. Please login again to continue."

  function App(){
const navigate = useNavigate()
  const [expiredMsg, setExpiredMsg] = useState<string | null>(null)

  useEffect(() => {
    scheduleSessionExpiry()   // handles page refresh with an existing token

    const onExpired = (e: Event) => {
      // No popup if they're already on the login page
      if (window.location.pathname === "/") return
      setExpiredMsg((e as CustomEvent).detail?.message || DEFAULT_MSG)
    }

    // Timers get throttled when a laptop sleeps or a tab is in the background
    const onVisible = () => {
      if (document.visibilityState === "visible") scheduleSessionExpiry()
    }

    window.addEventListener("auth-expired", onExpired)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("auth-expired", onExpired)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  const goToLogin = () => {
    setExpiredMsg(null)
    navigate("/", { replace: true })
  }

  return (
      <div>
        <ApplicationProvider>
    <Routes>
      <Route path="/" element={<AdmissionPortal />} />
      <Route path="/admission/apply/:track" element={<AdmissionFlow />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route element={<ApplicantLayout />}>
        <Route path="/admission/apply/:track/personal-information" element={<PersonalInformation />} />
        <Route path="/admission/apply/:track/education" element={<EducationPage />} />
        <Route path="/admission/apply/:track/documents" element={<DocumentsPage />} />
        <Route path="/admission/apply/:track/review" element={<ReviewApplication />} />
        <Route path="/admission/apply/:track/fee" element={<ApplicationFeePage />} />
        <Route path="/admission/apply/:track/submit" element={<SubmitApplicationPage />} />
      </Route>
    </Routes>
  </ApplicationProvider>

  {expiredMsg && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
          }}
        >
          <div style={{ background: "#fff", padding: 24, borderRadius: 12, maxWidth: 360, textAlign: "center" }}>
            <h3 style={{ marginBottom: 8 }}>Session expired</h3>
            <p style={{ marginBottom: 16 }}>{expiredMsg}</p>
            <button onClick={goToLogin}>Go to login</button>
          </div>
        </div>
      )}
      </div>
    )
  }
  export default App
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom"
import { CheckCircle2, Circle, LogOut } from "lucide-react"
import logo from "../assets/edunova-logo.webp"
import { useApplication } from "./ApplicationContext"

const steps = [
  { label: "Account Created", path: null },
  { label: "Programme Selected", path: null },
  { label: "Personal Information", path: "/admission/personal-information" },
  { label: "Academic Information", path: "/admission/academic-information" },
  { label: "Documents", path: "/admission/documents" },
  { label: "Review Application", path: "/admission/review" },
  { label: "Application Fee", path: "/admission/fee" },
  { label: "Submit Application", path: "/admission/submit" },
]

export default function ApplicantLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    data, isPersonalComplete, isAcademicComplete, isDocumentsComplete, progressPercent,
  } = useApplication()

  const stepDone = [
    true,
    true,
    isPersonalComplete,
    isAcademicComplete,
    isDocumentsComplete,
    isPersonalComplete && isAcademicComplete && isDocumentsComplete,
    data.feePaid,
    data.submitted,
  ]

  // A step is only clickable once reachable (previous step done), keeping the funnel linear
  const isUnlocked = (index: number) => stepDone.slice(0, index).every(Boolean)

  return (
    <div className="min-h-screen bg-[#F6F6F2] lg:flex">
      {/* Sidebar */}
      <aside className="lg:w-80 flex-shrink-0 bg-white border-r border-black/5 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <div className="px-6 py-6 border-b border-black/5 flex items-center gap-2">
          <img src={logo} alt="EduNova" className="h-9 w-auto" />
        </div>

        <div className="px-6 py-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-black/40 mb-1">
            Undergraduate Application
          </p>
          <p className="font-serif font-semibold text-black leading-snug">{data.programmeTitle}</p>
          <p className="font-mono text-xs text-black/40 mt-1">{data.applicationNumber}</p>

          <div className="flex items-center justify-between mt-5 mb-2">
            <p className="text-xs font-medium text-black/60">Progress</p>
            <p className="text-xs font-semibold text-[#B8901F]">{progressPercent}%</p>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full bg-[#B8901F] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <nav className="px-3 pb-6 flex flex-col gap-1">
          {steps.map((step, i) => {
            const done = stepDone[i]
            const unlocked = isUnlocked(i)
            const active = step.path && location.pathname === step.path

            const content = (
              <>
                {done ? (
                  <CheckCircle2 size={18} strokeWidth={2} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={18} strokeWidth={1.75} className={`flex-shrink-0 ${unlocked ? "text-[#1E3A8A]/40" : "text-black/15"}`} />
                )}
                <span className={`text-sm ${active ? "font-semibold text-[#1E3A8A]" : done ? "text-black/70 font-medium" : unlocked ? "text-black/60" : "text-black/30"}`}>
                  {step.label}
                </span>
              </>
            )

            if (!step.path) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg">
                  {content}
                </div>
              )
            }

            return (
              <NavLink
                key={i}
                to={unlocked ? step.path : "#"}
                onClick={(e) => { if (!unlocked) e.preventDefault() }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  active ? "bg-[#1E3A8A]/5" : unlocked ? "hover:bg-black/[0.03] cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {content}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-6 py-5 border-t border-black/5">
          <button
            onClick={() => navigate("/admission")}
            className="flex items-center gap-2 text-xs text-black/40 hover:text-black/70 transition-colors"
          >
            <LogOut size={14} /> Save & exit
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 min-w-0">
        <div className="px-4 md:px-8 py-8 max-w-2xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
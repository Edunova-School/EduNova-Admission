import { useState } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { verifyEmail, initProfile } from "../../lib/api"

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email ?? ""

  const [otp, setOtp] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async () => {
    if (!email) {
      setStatus("error")
      setErrorMsg("No email address was provided.")
      return
    }

    if (otp.length !== 6) {
      setStatus("error")
      setErrorMsg("Enter the 6-digit verification code.")
      return
    }

    setStatus("loading")
    setErrorMsg("")

    try {
      await verifyEmail(email, otp)
      await initProfile()
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMsg(
        err instanceof Error ? err.message : "Verification failed."
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-black/5 p-10 text-center max-w-sm w-full">

        {status !== "success" && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-black mb-2">
              Verify your email
            </h1>

            <p className="text-sm text-black/55 mb-6">
              Enter the 6-digit verification code sent to your email.
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""))
                setStatus("idle")
              }}
              placeholder="000000"
              className="w-full border border-black/15 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-[#1E3A8A]"
            />

            {status === "error" && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm mt-4">
                <XCircle size={16} />
                <p>{errorMsg}</p>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={status === "loading" || otp.length !== 6}
              className="w-full mt-6 bg-[#14263F] text-white text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={30}
              className="text-green-600 mx-auto mb-4"
            />

            <h2 className="font-serif text-xl font-semibold text-black mb-2">
              Email Verified
            </h2>

            <p className="text-sm text-black/55 mb-6">
              Your account is now verified. You can continue your application.
            </p>

            <button
              onClick={() => navigate("/admission")}
              className="bg-[#14263F] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all"
            >
              Continue
            </button>
          </>
        )}

      </div>
    </div>
  )
}
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

import { useApplication } from "./ApplicationContext"
import type { Track } from "./trackconfig"
import {
  getInvoices,
  initializeInvoicePayment,
} from "../../lib/api"
const naira = (n: number) => `₦${n.toLocaleString()}`

const paymentMethods = [
  { label: "Card", icon: CreditCard },
  { label: "Bank Transfer", icon: Building2 },
  { label: "USSD", icon: Smartphone },
]

export default function ApplicationFeePage() {
  const { track: trackParam } = useParams<{ track: string }>()

  const track = (trackParam ?? "undergraduate") as Track
  const base = `/admission/apply/${track}`

  const navigate = useNavigate()

  const { data, setFeePaid } = useApplication()

  const [method, setMethod] = useState("Card")
  const [processing, setProcessing] = useState(false)

  const [invoice, setInvoice] = useState<any>(null)
  const [loadingInvoice, setLoadingInvoice] = useState(true)
  const [error, setError] = useState("")

useEffect(() => {
  const loadInvoice = async () => {
    try {
      setLoadingInvoice(true)
      setError("")

      const response = await getInvoices()

      console.log("INVOICES RESPONSE:", response)

      const invoices = response?.data ?? []

      const registrationInvoice = invoices.find(
  (item: any) => item.fee_type === "REGISTRATION_FEE"
)

if (registrationInvoice?.status === "PAID") {
  setInvoice(registrationInvoice)
  setFeePaid(true)
} else {
  setInvoice(registrationInvoice ?? null)
}
    } catch (err) {
      console.error("Failed to load invoice:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your application fee."
      )
    } finally {
      setLoadingInvoice(false)
    }
  }

  loadInvoice()
}, [])

const handlePay = async () => {
  if (!invoice) return

  try {
    setProcessing(true)
    setError("")

    // 1. Initialize payment
    const initializeResponse = await initializeInvoicePayment(invoice.id)

    console.log(
      "PAYMENT INITIALIZATION RESPONSE:",
      initializeResponse
    )

    const payment = initializeResponse?.data

    if (!payment?.reference) {
      throw new Error("Payment reference was not returned.")
    }

const invoiceResponse = await getInvoices()


const invoices = invoiceResponse?.data ?? []

const paidInvoice = invoices.find(
  (item: any) =>
    item.fee_type === "REGISTRATION_FEE" &&
    item.status === "PAID"
)

if (paidInvoice) {
  setInvoice(paidInvoice)
  setFeePaid(true)
} else {
  throw new Error(
    "Payment verification completed, but the registration fee is not marked as paid yet."
  )
}
  } catch (err) {
    console.error("Payment failed:", err)

    setError(
      err instanceof Error
        ? err.message
        : "Unable to complete payment."
    )
  } finally {
    setProcessing(false)
  }
}
  if (data.feePaid) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">
            Application Fee
          </span>

          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">
            Fee Paid
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2
              size={26}
              strokeWidth={1.75}
              className="text-green-600"
            />
          </div>

          <h3 className="font-serif text-lg font-semibold text-black mb-1">
            Payment Received
          </h3>

          <p className="text-sm text-black/55">
            Your application fee of{" "}
            {invoice ? naira(Number(invoice.amount)) : "the required amount"}{" "}
            has been received.
          </p>
        </div>

        <button
          onClick={() => navigate(`${base}/submit`)}
          className="self-end flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">
          Application Fee
        </span>

        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">
          Pay Your Application Fee
        </h1>

        <p className="text-sm text-black/55 mt-2">
          A non-refundable application fee is required to submit your
          application.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1524] to-[#1E3A8A] p-7">
        <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-1">
          Amount Due
        </p>

        <p className="font-serif text-white text-4xl font-semibold">
          {loadingInvoice
            ? "Loading..."
            : invoice
              ? naira(Number(invoice.amount))
              : "Unavailable"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loadingInvoice && !invoice && !error && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          No unpaid application fee invoice was found.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F] mb-3">
          Payment Method
        </p>

        <div className="flex flex-col gap-2 mb-6">
          {paymentMethods.map((m) => {
            const Icon = m.icon
            const active = method === m.label

            return (
              <button
                key={m.label}
                onClick={() => setMethod(m.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]"
                    : "border-black/10 text-black/60 hover:border-black/20"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />

                {m.label}

                {active && (
                  <CheckCircle2
                    size={16}
                    className="ml-auto text-[#1E3A8A]"
                  />
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={handlePay}
          disabled={processing || loadingInvoice || !invoice}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {processing
            ? "Processing..."
            : invoice
              ? `Pay ${naira(Number(invoice.amount))}`
              : "Pay Application Fee"}
        </button>
      </div>

      <button
        onClick={() => navigate(`${base}/review`)}
        className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back
      </button>
    </div>
  )
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api/v1"
const TOKEN_KEY = "edunova_token"
let sessionEnded = false
let expiryTimer: number | undefined
export const getToken = () => sessionStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionEnded = false
  scheduleSessionExpiry()
}

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem("edunova_authenticated")
  sessionStorage.removeItem("edunova_pending_verification")
  sessionStorage.removeItem("edunova_pending_email")
  localStorage.removeItem("application_data")
  clearTimeout(expiryTimer)
}

export function handleSessionExpired(
  message = "Your session has expired. Please login again to continue."
) {
  if (sessionEnded) return 
  sessionEnded = true
  clearToken()
  window.dispatchEvent(new CustomEvent("auth-expired", { detail: { message } }))
}

function getTokenExpiry(token: string): number | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function scheduleSessionExpiry() {
  clearTimeout(expiryTimer)
  const token = getToken()
  if (!token) return

  const exp = getTokenExpiry(token)
  if (!exp) return

  const msLeft = exp - Date.now()
  if (msLeft <= 0) {
    handleSessionExpired()
    return
  }
  expiryTimer = window.setTimeout(() => handleSessionExpired(), msLeft)
}
interface ApiOptions extends RequestInit {
  auth?: boolean
}

async function apiFetch(path: string, options: ApiOptions = {}): Promise<any> {
  const { auth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  if (rest.body && !(rest.body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      handleSessionExpired()
      throw new Error("Session expired")
    }

    throw new Error(
      data?.message || data?.error || data?.msg || `Request failed (${res.status})`
    )
  }

  return data
}
export function register(payload: {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  password: string
  programme_name: string
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  })
}

export async function login(email: string, password: string) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  })

  const accessToken =
    data?.data?.access_token || data?.access_token || data?.data?.token || data?.token

  if (accessToken) setToken(accessToken) 
  return data
}

export function logout() {
  return apiFetch("/auth/logout", { method: "POST" }).finally(clearToken)
}

export function verifyEmail(email: string, otp: string) {
  return apiFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
    auth: false,
  })
}

export const initProfile = () =>
  apiFetch("/admission/profile", { method: "POST", body: JSON.stringify({}) })

export const getProfile = () => apiFetch("/admission/profile", { method: "GET" })

export const updateProfile = (payload: Record<string, any>) =>
  apiFetch("/admission/profile", { method: "PATCH", body: JSON.stringify(payload) })

// ---------- Documents ----------
export async function uploadDocument(file: File, documentType: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("document_type", documentType)
  return apiFetch("/admission/upload", { method: "POST", body: formData })
}

// ---------- Applications ----------
export const createApplication = (programmeName: string) =>
  apiFetch("/admission/applications", {
    method: "POST",
    body: JSON.stringify({ programme_name: programmeName }),
  })

export const getApplications = () =>
  apiFetch("/admission/applications", { method: "GET" })

export const submitApplication = (applicationId: string) =>
  apiFetch(`/admission/applications/${applicationId}/submit`, { method: "POST" })

export const acceptAdmission = (applicationId: string) =>
  apiFetch(`/admission/applications/${applicationId}/accept`, { method: "POST" })

// ---------- Finance ----------
export const getInvoices = () => apiFetch("/finance/invoices", { method: "GET" })

export const initializeInvoicePayment = (invoiceId: string) =>
  apiFetch(`/finance/invoices/${invoiceId}/initialize`, {
    method: "POST",
    body: JSON.stringify({ payment_gateway: "paystack" }),
  })

export const verifyPayment = (reference: string) =>
  apiFetch(`/finance/transactions/${reference}/verify`, { method: "POST" })

// ---------- Notifications ----------
export const getNotifications = () =>
  apiFetch("/admission/notifications", { method: "GET" })

export const getUnreadNotifications = () =>
  apiFetch("/admission/notifications/unread", { method: "GET" })

export const markNotificationAsRead = (notificationId: string) =>
  apiFetch(`/admission/notifications/${notificationId}/read`, { method: "GET" })
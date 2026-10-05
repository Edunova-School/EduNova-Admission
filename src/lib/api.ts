const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api/v1"
const TOKEN_KEY = "edunova_token"
const REFRESH_TOKEN_KEY = "edunova_refresh_token"

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      return null
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      let data: any = null

      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (!res.ok) {
        return null
      }

      const newAccessToken =
        data?.data?.access_token ||
        data?.access_token ||
        data?.data?.token ||
        data?.token

      const newRefreshToken =
        data?.data?.refresh_token ||
        data?.refresh_token

      if (!newAccessToken) {
        return null
      }

      setToken(newAccessToken)

      // Supports refresh-token rotation if the backend returns a new one.
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken)
      }

      return newAccessToken
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
interface ApiOptions extends RequestInit {
  auth?: boolean
  skipRefresh?: boolean
}
async function apiFetch(
  path: string,
  options: ApiOptions = {}
): Promise<any> {
  const {
    auth = true,
    skipRefresh = false,
    headers,
    ...rest
  } = options

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  if (rest.body && !(rest.body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = getToken()

    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  })

  let data: any = null

  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const isTokenExpired =
      res.status === 401 &&
      (
        data?.msg === "Token has expired" ||
        data?.message === "Token has expired" ||
        data?.error === "Token has expired"
      )

    const isUnauthorized =
      res.status === 401 &&
      (
        data?.msg === "Missing Authorization Header" ||
        data?.message === "Missing Authorization Header"
      )

    // Try refreshing the access token once.
    if (isTokenExpired && auth && !skipRefresh) {
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        const retryHeaders: Record<string, string> = {
          ...(headers as Record<string, string>),
          Authorization: `Bearer ${newAccessToken}`,
        }

        if (rest.body && !(rest.body instanceof FormData)) {
          retryHeaders["Content-Type"] = "application/json"
        }

        const retryRes = await fetch(`${BASE_URL}${path}`, {
          ...rest,
          headers: retryHeaders,
        })

        let retryData: any = null

        try {
          retryData = await retryRes.json()
        } catch {
          retryData = null
        }

        if (retryRes.ok) {
          return retryData
        }

        throw new Error(
          retryData?.message ||
          retryData?.error ||
          retryData?.msg ||
          `Request failed (${retryRes.status})`
        )
      }

      // Refresh failed — the session is genuinely expired.
      clearToken()

      sessionStorage.setItem(
        "session_expired",
        "Your session has expired. Please login again to continue."
      )

      sessionStorage.setItem("show_session_message", "true")

      if (window.location.pathname !== "/") {
        window.location.replace("/")
      }

      throw new Error("Session expired")
    }

    if (isUnauthorized) {
      clearToken()
      throw new Error("Not authenticated")
    }

    throw new Error(
      data?.message ||
      data?.error ||
      data?.msg ||
      `Request failed (${res.status})`
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
    auth: false
  })
}

export async function login(email: string, password: string) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
    skipRefresh: true,
  })

  const accessToken =
    data?.data?.access_token ||
    data?.access_token ||
    data?.data?.token ||
    data?.token

  const refreshToken =
    data?.data?.refresh_token ||
    data?.refresh_token

  if (accessToken) {
    setToken(accessToken)
  }

  if (refreshToken) {
    setRefreshToken(refreshToken)
  }

  return data
}

export function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  }).finally(clearToken)
}

export function verifyEmail(email: string, otp: string) {
  return apiFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
    auth: false,
  })
}

// ---- Applicant profile ----
export const initProfile = () => apiFetch("/admission/profile", { method: "POST", body: JSON.stringify({}) })
export const getProfile = () => apiFetch("/admission/profile", { method: "GET" })
export const updateProfile = (payload: Record<string, any>) => apiFetch("/admission/profile", { method: "PATCH", body: JSON.stringify(payload) })

// ---- Documents ----
export async function uploadDocument(file: File, documentType: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("document_type", documentType)
  return apiFetch("/admission/upload", { method: "POST", body: formData })
}

// ---- Applications ----
export const createApplication = (programmeName: string) =>
  apiFetch("/admission/applications", {
    method: "POST",
    body: JSON.stringify({
      programme_name: programmeName,
    }),
  })
  export const getInvoices = () =>
  apiFetch("/finance/invoices", {
    method: "GET",
  })

export const initializeInvoicePayment = (invoiceId: string) =>
  apiFetch(`/finance/invoices/${invoiceId}/initialize`, {
    method: "POST",
    body: JSON.stringify({
      payment_gateway: "paystack",
    }),
  })

export const verifyPayment = (reference: string) =>
  apiFetch(`/finance/transactions/${reference}/verify`, {
    method: "POST",
  })
export const getApplications = () => apiFetch("/admission/applications", { method: "GET" })
export const submitApplication = (applicationId: string) => apiFetch(`/admission/applications/${applicationId}/submit`, { method: "POST" })
export const acceptAdmission = (applicationId: string) => apiFetch(`/admission/applications/${applicationId}/accept`, { method: "POST" })
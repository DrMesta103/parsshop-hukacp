const DEFAULT_API_ORIGIN = 'https://parsshop-back.mugit.ir'
const DEFAULT_API_PREFIX = '/api'

const normalizeBaseUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return `${DEFAULT_API_ORIGIN}${DEFAULT_API_PREFIX}`

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

export const API_BASE_URL = normalizeBaseUrl(envBaseUrl || `${DEFAULT_API_ORIGIN}${DEFAULT_API_PREFIX}`)

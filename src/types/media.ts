export type MediaSection = 'image' | 'gallery' | 'audio' | 'video' | 'model3d' | 'document'

export interface MediaItem {
  id: string
  section: MediaSection
  folder?: string | null
  originalName: string
  objectName: string
  url: string
  bucket?: string | null
  mimeType?: string | null
  extension?: string | null
  size?: number | null
  title?: string | null
  alt?: string | null
  caption?: string | null
  metadata?: Record<string, unknown> | null
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MediaOverviewSection {
  section: MediaSection
  total: number
  folders: Array<{
    folder: string
    total: number
  }>
}

export interface MediaOverview {
  total: number
  sections: MediaOverviewSection[]
}

export interface MediaListFilters {
  section?: MediaSection | ''
  folder?: string
  search?: string
  page?: number
  limit?: number
}

export interface MediaUploadPayload {
  files: File[]
  section: MediaSection
  folder?: string
  title?: string
  alt?: string
  caption?: string
  metadata?: Record<string, unknown>
  isPublic?: boolean
}

export interface MediaUpdatePayload {
  title?: string
  alt?: string
  caption?: string
  metadata?: Record<string, unknown>
  isPublic?: boolean
}

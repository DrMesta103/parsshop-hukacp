import apiService from '@/services/api'
import { buildQueryParams, normalizePaginatedResult } from '@/services/admin-api'
import type { DeleteResult, PaginatedResult } from '@/types/product'
import type {
  MediaItem,
  MediaListFilters,
  MediaOverview,
  MediaSection,
  MediaUpdatePayload,
  MediaUploadPayload,
} from '@/types/media'

const mediaSections: MediaSection[] = ['image', 'gallery', 'audio', 'video', 'model3d', 'document']

const normalizeOverview = (payload: unknown): MediaOverview => {
  const source = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>
  const sectionSource = Array.isArray(source.sections) ? source.sections : mediaSections.map((section) => ({
    section,
    total: Number((source as Record<string, unknown>)[section] || 0),
    folders: [],
  }))

  const sections = sectionSource.map((entry) => {
    const item = entry as Record<string, unknown>
    const folderSource = Array.isArray(item.folders) ? item.folders : []

    return {
      section: (item.section as MediaSection) || 'image',
      total: Number(item.total || 0),
      folders: folderSource.map((folder) => {
        const folderItem = folder as Record<string, unknown>
        return {
          folder: String(folderItem.folder || ''),
          total: Number(folderItem.total || 0),
        }
      }),
    }
  })

  return {
    total: Number(source.total || sections.reduce((sum, item) => sum + item.total, 0)),
    sections,
  }
}

const buildUploadFormData = (payload: MediaUploadPayload) => {
  const formData = new FormData()

  payload.files.forEach((file) => {
    formData.append('files', file)
  })

  formData.append('section', payload.section)

  if (payload.folder) {
    formData.append('folder', payload.folder)
  }

  if (payload.title) {
    formData.append('title', payload.title)
  }

  if (payload.alt) {
    formData.append('alt', payload.alt)
  }

  if (payload.caption) {
    formData.append('caption', payload.caption)
  }

  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    formData.append('metadata', JSON.stringify(payload.metadata))
  }

  formData.append('isPublic', String(payload.isPublic ?? true))

  return formData
}

class MediaService {
  async getOverview(): Promise<MediaOverview> {
    const payload = await apiService.get<unknown>('/admin/media/overview')
    return normalizeOverview(payload)
  }

  async getMedia(filters: MediaListFilters): Promise<PaginatedResult<MediaItem>> {
    const payload = await apiService.get<unknown>('/admin/media', {
      params: buildQueryParams(filters as Record<string, unknown>),
    })

    return normalizePaginatedResult<MediaItem>(payload)
  }

  async uploadMedia(payload: MediaUploadPayload): Promise<MediaItem[]> {
    return apiService.postForm<MediaItem[]>('/admin/media/upload', buildUploadFormData(payload))
  }

  async getMediaById(id: string): Promise<MediaItem> {
    return apiService.get<MediaItem>(`/admin/media/${id}`)
  }

  async updateMedia(id: string, payload: MediaUpdatePayload): Promise<MediaItem> {
    return apiService.patch<MediaItem, MediaUpdatePayload>(`/admin/media/${id}`, payload)
  }

  async deleteMedia(id: string): Promise<DeleteResult> {
    return apiService.delete<DeleteResult>(`/admin/media/${id}`)
  }
}

export const mediaService = new MediaService()
export default mediaService

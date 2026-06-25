import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api'
import type {
  BrandPayload,
  PaginatedMeta,
  PaginatedResult,
  CategoryPayload,
  ProductAttributeAssignment,
  ProductMeta,
  ProductAttributes,
  ProductFormPayload,
} from '@/types/product'

type QueryPrimitive = string | number | boolean | null | undefined
export type QueryValue = QueryPrimitive | string[] | ProductAttributes | ProductAttributeAssignment[] | ProductMeta | Record<string, unknown>

export const buildQueryParams = (params: Record<string, unknown>) => {
  const query: Record<string, string | number | boolean> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        query[key] = JSON.stringify(value as QueryValue)
      }
      return
    }

    if (typeof value === 'object') {
      if (Object.keys(value).length > 0) {
        query[key] = JSON.stringify(value as QueryValue)
      }
      return
    }

    query[key] = value as string | number | boolean
  })

  return query
}

export const normalizePaginatedResult = <T>(payload: any): PaginatedResult<T> => {
  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : []

  const metaSource = payload?.meta ?? payload ?? {}
  const total = Number(metaSource.total ?? items.length ?? 0)
  const page = Number(metaSource.page ?? 1)
  const limit = Number(metaSource.limit ?? items.length ?? 1)
  const totalPages = Number(metaSource.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1))))

  const meta: PaginatedMeta = {
    total,
    page,
    limit,
    totalPages,
  }

  return { items, meta }
}

export const buildProductFormData = (payload: ProductFormPayload): FormData => {
  const formData = new FormData()
  const normalizedMeta: ProductMeta = {
    shortDescription: payload.meta?.shortDescription ?? payload.summary ?? '',
    description: payload.meta?.description ?? payload.description ?? '',
    metaTitle: payload.meta?.metaTitle ?? '',
    metaDescription: payload.meta?.metaDescription ?? '',
    shareTitle: payload.meta?.shareTitle ?? '',
    shareDescription: payload.meta?.shareDescription ?? '',
    shareImageUrl: payload.meta?.shareImageUrl ?? '',
  }

  formData.append('sku', payload.sku)
  formData.append('title', payload.title)
  formData.append('slug', payload.slug)
  formData.append('summary', payload.meta?.shortDescription ?? payload.summary ?? '')
  formData.append('description', payload.meta?.description ?? payload.description ?? '')
  formData.append('meta', JSON.stringify(normalizedMeta))
  formData.append('technicalCode', payload.technicalCode)
  if (payload.brandId !== undefined && String(payload.brandId).trim() !== '') {
    formData.append('brandId', payload.brandId)
  }
  if (payload.brand) {
    formData.append('brand', payload.brand)
  }
  formData.append('basePriceUSD', String(payload.basePriceUSD))
  formData.append('stock', String(payload.stock))
  formData.append('featured', String(payload.featured))
  formData.append('type', payload.type)
  formData.append('status', payload.status)
  formData.append('attributes', JSON.stringify(payload.attributes || []))
  formData.append('tags', JSON.stringify(payload.tags || []))
  formData.append('categoryIds', JSON.stringify(payload.categoryIds || []))
  formData.append('existingGalleryUrls', JSON.stringify(payload.existingGalleryUrls || []))

  if (payload.salePriceUSD !== undefined && payload.salePriceUSD !== null) {
    formData.append('salePriceUSD', String(payload.salePriceUSD))
  }

  if (payload.primaryCategoryId !== undefined) {
    formData.append('primaryCategoryId', payload.primaryCategoryId || '')
    formData.append('categoryId', payload.primaryCategoryId || '')
  }

  if (payload.existingMainImageUrl !== undefined) {
    formData.append('existingMainImageUrl', payload.existingMainImageUrl)
  }

  if (payload.existingThreeDModelUrl !== undefined) {
    formData.append('existingThreeDModelUrl', payload.existingThreeDModelUrl)
  }

  if (payload.mainImage) {
    formData.append('mainImage', payload.mainImage)
  }

  ;(payload.images || []).forEach((file) => {
    formData.append('images', file)
  })

  if (payload.model3d) {
    formData.append('model3d', payload.model3d)
  }

  return formData
}

export const buildCategoryFormData = (payload: Partial<CategoryPayload>): FormData => {
  const formData = new FormData()

  if (payload.name !== undefined) {
    formData.append('name', payload.name)
  }

  if (payload.slug !== undefined) {
    formData.append('slug', payload.slug)
  }

  if (payload.type !== undefined) {
    formData.append('type', payload.type)
  }

  if (payload.parentId) {
    formData.append('parentId', payload.parentId)
  }

  if (payload.existingImageUrl !== undefined) {
    formData.append('existingImageUrl', payload.existingImageUrl)
  }

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export const buildBrandFormData = (payload: Partial<BrandPayload>): FormData => {
  const formData = new FormData()

  if (payload.name !== undefined) {
    formData.append('name', payload.name)
  }

  if (payload.slug !== undefined) {
    formData.append('slug', payload.slug)
  }

  if (payload.type !== undefined) {
    formData.append('type', payload.type)
  }

  if (payload.existingImageUrl !== undefined) {
    formData.append('existingImageUrl', payload.existingImageUrl)
  }

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export const extractApiErrorMessage = (error: unknown, fallback = 'خطای ناشناخته ای رخ داد') => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const message = axiosError?.response?.data?.message

  if (Array.isArray(message)) {
    return message.join('، ')
  }

  if (typeof message === 'string' && message.trim()) {
    return message
  }

  if (axiosError?.response?.status === 403) {
    return 'دسترسی لازم برای این عملیات را ندارید'
  }

  if (axiosError?.response?.status === 401) {
    return 'نشست شما منقضی شده است. دوباره وارد شوید'
  }

  return fallback
}

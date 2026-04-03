export type ProductStatus = 'draft' | 'published' | 'archived'
export type ProductType = 'Industrial' | 'Automotive'
export type ProductAttributeDataType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json'

export type ProductAttributes = Record<string, string | number | boolean | null>

export interface ProductMeta {
  shortDescription: string
  description: string
  metaTitle: string
  metaDescription: string
  shareTitle: string
  shareDescription: string
  shareImageUrl: string
}

export interface ProductAttributeOption {
  label: string
  value: string
}

export interface ProductAttributeAssignment {
  attributeId?: string
  displayOrder?: number
  name?: string
  slug?: string
  dataType?: ProductAttributeDataType
  unit?: string
  options?: ProductAttributeOption[]
  isFilterable?: boolean
  isVisible?: boolean
  defaultValueText?: string | null
  defaultValueNumber?: number | null
  defaultValueBoolean?: boolean | null
  defaultValueJson?: unknown
  valueText?: string | null
  valueNumber?: number | null
  valueBoolean?: boolean | null
  valueJson?: unknown
  overrideUnit?: string
}

export interface ReusableProductAttribute {
  id: string
  name: string
  slug: string
  dataType: ProductAttributeDataType
  unit?: string | null
  options: ProductAttributeOption[]
  isFilterable: boolean
  isVisible: boolean
  defaultValueText?: string | null
  defaultValueNumber?: number | null
  defaultValueBoolean?: boolean | null
  defaultValueJson?: unknown
  createdAt?: string
  updatedAt?: string
}

export interface CreateReusableProductAttributePayload {
  name: string
  slug: string
  dataType: ProductAttributeDataType
  unit?: string
  options?: ProductAttributeOption[]
  isFilterable: boolean
  isVisible: boolean
  defaultValueText?: string | null
  defaultValueNumber?: number | null
  defaultValueBoolean?: boolean | null
  defaultValueJson?: unknown
}

export interface Category {
  id: string
  name: string
  slug: string
  type: ProductType
  imageUrl?: string | null
  parent?: Category | null
  children?: Category[]
  createdAt?: string
  updatedAt?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  type: ProductType
  createdAt?: string
  updatedAt?: string
}

export interface ProductBrandInfo {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  type: ProductType
}

export interface ProductReview {
  id: string
  name: string
  email?: string | null
  rating: number
  title?: string | null
  comment: string
  isApproved: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
  product?: ProductListItem
}

export interface ProductListItem {
  id: string
  sku: string
  title: string
  slug: string
  summary?: string | null
  description?: string | null
  technicalCode: string
  brandId?: string | null
  brand: string
  brandInfo?: ProductBrandInfo | null
  basePriceUSD: number
  salePriceUSD?: number | null | ''
  stock: number
  featured: boolean
  type: ProductType
  status: ProductStatus
  meta?: Partial<ProductMeta> | null
  mainImageUrl?: string | null
  imageGalleryUrls: string[]
  threeDModelUrl?: string | null
  attributes: ProductAttributes | ProductAttributeAssignment[]
  tags: string[]
  averageRating: number
  reviewsCount: number
  category?: Category | null
  createdAt?: string
  updatedAt?: string
}

export interface PublicProductDetail extends ProductListItem {
  approvedReviews: ProductReview[]
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginatedMeta
}

export interface ProductListFilters {
  search?: string
  type?: ProductType | ''
  categoryId?: string
  brandId?: string
  brand?: string
  attributes?: ProductAttributes
  tags?: string[]
  featured?: boolean | null
  page?: number
  limit?: number
}

export interface AdminProductListFilters extends ProductListFilters {
  status?: ProductStatus | ''
}

export interface AdminReviewFilters {
  productId?: string
  isApproved?: boolean | null
  isPinned?: boolean | null
  page?: number
  limit?: number
}

export interface ProductReviewPayload {
  name: string
  email: string
  rating: number
  title: string
  comment: string
}

export interface ModerateReviewPayload {
  isApproved?: boolean
  isPinned?: boolean
}

export interface ProductFormPayload {
  sku: string
  title: string
  slug: string
  summary?: string
  description?: string
  meta?: ProductMeta
  technicalCode: string
  brandId?: string
  brand?: string
  basePriceUSD: number
  salePriceUSD?: number | null | ''
  stock: number
  featured: boolean
  type: ProductType
  status: ProductStatus
  categoryId?: string
  primaryCategoryId?: string
  categoryIds?: string[]
  attributes: ProductAttributes | ProductAttributeAssignment[]
  tags: string[]
  existingMainImageUrl?: string
  existingGalleryUrls?: string[]
  existingThreeDModelUrl?: string
  mainImage?: File | null
  images?: File[]
  model3d?: File | null
}

export interface CategoryPayload {
  name: string
  slug: string
  type: ProductType
  parentId?: string
  existingImageUrl?: string
  image?: File | null
}

export interface BrandPayload {
  name: string
  slug: string
  type: ProductType
  existingImageUrl?: string
  image?: File | null
}

export interface ReviewSubmissionResult {
  message: string
  reviewId: string
}

export interface DeleteResult {
  message: string
}

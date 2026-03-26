import type {
  Brand,
  Category,
  ProductAttributeAssignment,
  ProductAttributes,
  ProductFormPayload,
  ProductListItem,
  ProductStatus,
  ProductType,
} from '@/types/product'

export interface AttributeEntry {
  key: string
  value: string
}

export const productTypeOptions: Array<{ label: string; value: ProductType }> = [
  { label: 'صنعتی', value: 'Industrial' },
  { label: 'خودرویی', value: 'Automotive' },
]

export const productTypeLabelMap = productTypeOptions.reduce<Record<ProductType, string>>(
  (result, option) => {
    result[option.value] = option.label
    return result
  },
  {
    Industrial: 'Industrial',
    Automotive: 'Automotive',
  },
)

export const productStatusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: 'پیش نویس', value: 'draft' },
  { label: 'منتشر شده', value: 'published' },
  { label: 'آرشیو شده', value: 'archived' },
]

export const createEmptyProductForm = (): ProductFormPayload => ({
  sku: '',
  title: '',
  slug: '',
  summary: '',
  description: '',
  meta: {
    shortDescription: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    shareTitle: '',
    shareDescription: '',
    shareImageUrl: '',
  },
  technicalCode: '',
  brandId: undefined,
  brand: '',
  basePriceUSD: 0,
  salePriceUSD: null,
  stock: 0,
  featured: false,
  type: 'Industrial',
  status: 'draft',
  categoryId: undefined,
  attributes: {},
  tags: [],
  existingMainImageUrl: undefined,
  existingGalleryUrls: [],
  existingThreeDModelUrl: undefined,
  mainImage: null,
  images: [],
  model3d: null,
})

export const mapProductToForm = (product: ProductListItem): ProductFormPayload => ({
  sku: product.sku,
  title: product.title,
  slug: product.slug,
  summary: product.summary || '',
  description: product.description || '',
  meta: {
    shortDescription: product.meta?.shortDescription || product.summary || '',
    description: product.meta?.description || product.description || '',
    metaTitle: product.meta?.metaTitle || '',
    metaDescription: product.meta?.metaDescription || '',
    shareTitle: product.meta?.shareTitle || '',
    shareDescription: product.meta?.shareDescription || '',
    shareImageUrl: product.meta?.shareImageUrl || product.mainImageUrl || '',
  },
  technicalCode: product.technicalCode,
  brandId: product.brandId || product.brandInfo?.id || undefined,
  brand: product.brandInfo?.name || product.brand || '',
  basePriceUSD: Number(product.basePriceUSD || 0),
  salePriceUSD: product.salePriceUSD ?? null,
  stock: Number(product.stock || 0),
  featured: product.featured,
  type: product.type,
  status: product.status,
  categoryId: product.category?.id,
  attributes: normalizeAttributes(product.attributes),
  tags: [...(product.tags || [])],
  existingMainImageUrl: product.mainImageUrl || '',
  existingGalleryUrls: [...(product.imageGalleryUrls || [])],
  existingThreeDModelUrl: product.threeDModelUrl || '',
  mainImage: null,
  images: [],
  model3d: null,
})

export const normalizeAttributes = (attributes?: Record<string, unknown> | ProductAttributeAssignment[]): ProductAttributes => {
  if (Array.isArray(attributes)) {
    return attributes.reduce<ProductAttributes>((result, item, index) => {
      const entry = item as ProductAttributeAssignment
      const key = entry.name?.trim() || entry.slug?.trim() || entry.attributeId?.trim() || `attribute_${index + 1}`
      const value =
        entry.valueText ??
        entry.valueNumber ??
        entry.valueBoolean ??
        (entry.valueJson !== undefined ? JSON.stringify(entry.valueJson) : null)

      if (key) {
        result[key] = value === null || value === undefined ? '' : String(value)
      }

      return result
    }, {})
  }

  if (!attributes || typeof attributes !== 'object') {
    return {}
  }

  return Object.entries(attributes).reduce<ProductAttributes>((result, [key, value]) => {
    if (value === undefined) {
      return result
    }

    result[key] = value === null ? '' : String(value)
    return result
  }, {})
}

export const attributesToEntries = (attributes?: ProductAttributes | ProductAttributeAssignment[]): AttributeEntry[] => {
  const normalizedAttributes = normalizeAttributes(attributes)
  const entries = Object.entries(normalizedAttributes).map(([key, value]) => ({
    key,
    value: value === null || value === undefined ? '' : String(value),
  }))

  return entries.length > 0 ? entries : [{ key: '', value: '' }]
}

export const attributeEntriesToObject = (entries: AttributeEntry[]): ProductAttributes => {
  return entries.reduce<ProductAttributes>((result, entry) => {
    const key = entry.key.trim()
    const value = entry.value.trim()

    if (key) {
      result[key] = value
    }

    return result
  }, {})
}

const persianDigraphMap: Array<[RegExp, string]> = [
  [/چ/g, 'ch'],
  [/ش/g, 'sh'],
  [/خ/g, 'kh'],
  [/غ/g, 'gh'],
  [/ژ/g, 'zh'],
]

const persianCharMap: Record<string, string> = {
  ا: 'a',
  آ: 'a',
  ب: 'b',
  پ: 'p',
  ت: 't',
  ث: 's',
  ج: 'j',
  ح: 'h',
  د: 'd',
  ذ: 'z',
  ر: 'r',
  ز: 'z',
  س: 's',
  ص: 's',
  ض: 'z',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  ف: 'f',
  ق: 'gh',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  م: 'm',
  ن: 'n',
  و: 'v',
  ه: 'h',
  ی: 'y',
  ئ: 'y',
  ء: '',
  ة: 'h',
  ي: 'y',
  ك: 'k',
  _: ' ',
}

const persianNumberMap: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
}

export const transliteratePersianToLatin = (value: string) => {
  let normalized = value.trim()

  persianDigraphMap.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement)
  })

  normalized = normalized
    .split('')
    .map((character) => {
      if (persianNumberMap[character]) {
        return persianNumberMap[character]
      }

      if (persianCharMap[character] !== undefined) {
        return persianCharMap[character]
      }

      return character
    })
    .join('')

  return normalized
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const normalizeEnglishSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const generateEnglishSlug = (value: string) => normalizeEnglishSlug(transliteratePersianToLatin(value))

export const formatCurrency = (value?: number | null | '') => {
  const safeValue = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(safeValue)
}

export const formatDateTime = (value?: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fa-IR')
}

export const getStatusBadgeClass = (status: ProductStatus) => {
  switch (status) {
    case 'published':
      return 'bg-success/20 text-success'
    case 'archived':
      return 'bg-danger/20 text-danger'
    default:
      return 'bg-warning/20 text-warning'
  }
}

export const getStockBadgeClass = (stock: number) => {
  if (stock <= 0) return 'bg-danger/20 text-danger'
  if (stock < 10) return 'bg-warning/20 text-warning'
  return 'bg-success/20 text-success'
}

export const getRatingLabel = (rating: number) => `${Number(rating || 0).toFixed(1)} / 5`

export const filterCategoriesByType = (categories: Category[], type: ProductType) =>
  categories.filter((category) => category.type === type)

export const getProductBrandName = (product?: Pick<ProductListItem, 'brand' | 'brandInfo'> | null) =>
  product?.brandInfo?.name || product?.brand || '-'

export const filterBrandsByProductType = (brands: Brand[], type: ProductType) => {
  const normalizedType = type.toLowerCase()
  const matched = brands.filter((brand) => brand.type?.toLowerCase() === normalizedType)
  return matched.length > 0 ? matched : brands
}

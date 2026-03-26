import apiService from '@/services/api'
import type {
  CreateReusableProductAttributePayload,
  ProductAttributeDataType,
  ProductAttributeOption,
  ReusableProductAttribute,
} from '@/types/product'

const normalizeOptions = (value: unknown): ProductAttributeOption[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return {
          label: String(item),
          value: String(item),
        }
      }

      if (item && typeof item === 'object') {
        const option = item as Record<string, unknown>
        const rawValue = option.value ?? option.id ?? option.slug ?? option.label ?? option.name ?? ''
        const rawLabel = option.label ?? option.name ?? option.title ?? rawValue

        return {
          label: String(rawLabel || ''),
          value: String(rawValue || ''),
        }
      }

      return null
    })
    .filter((item): item is ProductAttributeOption => Boolean(item?.value))
}

const normalizeAttribute = (payload: unknown): ReusableProductAttribute => {
  const source = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>

  return {
    id: String(source.id ?? source._id ?? ''),
    name: String(source.name ?? ''),
    slug: String(source.slug ?? ''),
    dataType: String(source.dataType ?? source.type ?? 'text') as ProductAttributeDataType,
    unit: source.unit ? String(source.unit) : null,
    options: normalizeOptions(source.options),
    isFilterable: Boolean(source.isFilterable),
    isVisible: source.isVisible === undefined ? true : Boolean(source.isVisible),
    defaultValueText: typeof source.defaultValueText === 'string' ? source.defaultValueText : null,
    defaultValueNumber: typeof source.defaultValueNumber === 'number' ? source.defaultValueNumber : null,
    defaultValueBoolean: typeof source.defaultValueBoolean === 'boolean' ? source.defaultValueBoolean : null,
    defaultValueJson: source.defaultValueJson ?? null,
    createdAt: source.createdAt ? String(source.createdAt) : undefined,
    updatedAt: source.updatedAt ? String(source.updatedAt) : undefined,
  }
}

class ProductAttributeService {
  async getReusableAttributes(): Promise<ReusableProductAttribute[]> {
    const payload = await apiService.get<unknown>('/admin/product-attributes')
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as Record<string, unknown>)?.items)
        ? ((payload as Record<string, unknown>).items as unknown[])
        : Array.isArray((payload as Record<string, unknown>)?.data)
          ? ((payload as Record<string, unknown>).data as unknown[])
          : []

    return items.map(normalizeAttribute).filter((item) => item.id && item.name)
  }

  async createReusableAttribute(payload: CreateReusableProductAttributePayload): Promise<ReusableProductAttribute> {
    const response = await apiService.post<unknown, CreateReusableProductAttributePayload>('/admin/product-attributes', payload)
    return normalizeAttribute(response)
  }
}

export const productAttributeService = new ProductAttributeService()
export default productAttributeService

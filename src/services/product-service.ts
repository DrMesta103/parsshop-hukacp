import apiService from '@/services/api'
import {
  buildProductFormData,
  buildQueryParams,
  normalizePaginatedResult,
} from '@/services/admin-api'
import type {
  AdminProductListFilters,
  AdminReviewFilters,
  DeleteResult,
  ModerateReviewPayload,
  PaginatedResult,
  ProductFormPayload,
  ProductListFilters,
  ProductListItem,
  ProductReview,
  ProductReviewPayload,
  PublicProductDetail,
  ReviewSubmissionResult,
} from '@/types/product'

class ProductService {
  async getPublicProducts(filters: ProductListFilters): Promise<PaginatedResult<ProductListItem>> {
    const payload = await apiService.get<unknown>('/products', {
      params: buildQueryParams(filters as Record<string, unknown>),
    })

    return normalizePaginatedResult<ProductListItem>(payload)
  }

  async getPublicProduct(id: string): Promise<PublicProductDetail> {
    return apiService.get<PublicProductDetail>(`/products/${id}`)
  }

  async getPublicProductReviews(productId: string): Promise<ProductReview[]> {
    return apiService.get<ProductReview[]>(`/products/${productId}/reviews`)
  }

  async submitProductReview(productId: string, payload: ProductReviewPayload): Promise<ReviewSubmissionResult> {
    return apiService.post<ReviewSubmissionResult, ProductReviewPayload>(`/products/${productId}/reviews`, payload)
  }

  async getAdminProducts(filters: AdminProductListFilters): Promise<PaginatedResult<ProductListItem>> {
    const payload = await apiService.get<unknown>('/admin/products', {
      params: buildQueryParams(filters as Record<string, unknown>),
    })

    return normalizePaginatedResult<ProductListItem>(payload)
  }

  async getAdminProduct(id: string): Promise<ProductListItem> {
    return apiService.get<ProductListItem>(`/admin/products/${id}`)
  }

  async checkAdminProductSlug(slug: string, excludeId?: string): Promise<boolean> {
    return apiService.get<boolean>('/admin/products/check-slug', {
      params: {
        slug,
        ...(excludeId ? { excludeId } : {}),
      },
    })
  }

  async createAdminProduct(payload: ProductFormPayload): Promise<ProductListItem> {
    return apiService.postForm<ProductListItem>('/admin/products', buildProductFormData(payload))
  }

  async updateAdminProduct(id: string, payload: ProductFormPayload): Promise<ProductListItem> {
    return apiService.patchForm<ProductListItem>(`/admin/products/${id}`, buildProductFormData(payload))
  }

  async deleteAdminProduct(id: string): Promise<DeleteResult> {
    return apiService.delete<DeleteResult>(`/admin/products/${id}`)
  }

  async getAdminProductReviews(filters: AdminReviewFilters): Promise<PaginatedResult<ProductReview>> {
    const payload = await apiService.get<unknown>('/admin/products/reviews/list', {
      params: buildQueryParams(filters as Record<string, unknown>),
    })

    return normalizePaginatedResult<ProductReview>(payload)
  }

  async updateAdminReview(reviewId: string, payload: ModerateReviewPayload): Promise<ProductReview> {
    return apiService.patch<ProductReview, ModerateReviewPayload>(`/admin/products/reviews/${reviewId}`, payload)
  }

  async deleteAdminReview(reviewId: string): Promise<DeleteResult> {
    return apiService.delete<DeleteResult>(`/admin/products/reviews/${reviewId}`)
  }
}

export const productService = new ProductService()
export default productService

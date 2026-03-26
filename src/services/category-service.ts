import apiService from '@/services/api'
import { buildCategoryFormData } from '@/services/admin-api'
import type { Category, CategoryPayload, DeleteResult } from '@/types/product'

class CategoryService {
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories')
  }

  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`)
  }

  async createCategory(payload: CategoryPayload): Promise<Category> {
    return apiService.postForm<Category>('/categories', buildCategoryFormData(payload))
  }

  async updateCategory(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
    return apiService.patchForm<Category>(`/categories/${id}`, buildCategoryFormData(payload))
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    return apiService.delete<DeleteResult>(`/categories/${id}`)
  }
}

export const categoryService = new CategoryService()
export default categoryService

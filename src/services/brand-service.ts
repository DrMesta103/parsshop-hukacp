import apiService from '@/services/api'
import { buildBrandFormData } from '@/services/admin-api'
import type { Brand, BrandPayload, DeleteResult } from '@/types/product'

class BrandService {
  async getBrands(): Promise<Brand[]> {
    return apiService.get<Brand[]>('/brands')
  }

  async getBrand(id: string): Promise<Brand> {
    return apiService.get<Brand>(`/brands/${id}`)
  }

  async createBrand(payload: BrandPayload): Promise<Brand> {
    return apiService.postForm<Brand>('/brands', buildBrandFormData(payload))
  }

  async updateBrand(id: string, payload: Partial<BrandPayload>): Promise<Brand> {
    return apiService.patchForm<Brand>(`/brands/${id}`, buildBrandFormData(payload))
  }

  async deleteBrand(id: string): Promise<DeleteResult> {
    return apiService.delete<DeleteResult>(`/brands/${id}`)
  }
}

export const brandService = new BrandService()
export default brandService

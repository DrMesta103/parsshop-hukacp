import apiService from '@/services/api'
import type { ShippingMethod, ShippingMethodPayload } from '@/types/checkout'

class CheckoutService {
  async getShippingMethods(): Promise<ShippingMethod[]> {
    return apiService.get<ShippingMethod[]>('/admin/checkout/shipping-methods')
  }

  async createShippingMethod(payload: ShippingMethodPayload): Promise<ShippingMethod> {
    return apiService.post<ShippingMethod, ShippingMethodPayload>('/admin/checkout/shipping-methods', payload)
  }

  async updateShippingMethod(shippingMethodId: string, payload: Partial<ShippingMethodPayload>): Promise<ShippingMethod> {
    return apiService.patch<ShippingMethod, Partial<ShippingMethodPayload>>(`/admin/checkout/shipping-methods/${shippingMethodId}`, payload)
  }
}

export const checkoutService = new CheckoutService()
export default checkoutService

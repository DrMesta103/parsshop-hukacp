import apiService from '@/services/api'
import type {
  BankSlipOrdersResponse,
  PaymentMethod,
  PaymentMethodCode,
  ReviewBankSlipPayload,
  ReviewBankSlipResponse,
  UpdatePaymentMethodPayload,
} from '@/types/payment'

class PaymentService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return apiService.get<PaymentMethod[]>('/admin/payments/methods')
  }

  async updatePaymentMethod(code: PaymentMethodCode, payload: UpdatePaymentMethodPayload): Promise<PaymentMethod> {
    return apiService.patch<PaymentMethod, UpdatePaymentMethodPayload>(`/admin/payments/methods/${code}`, payload)
  }

  async getBankSlipOrders(): Promise<BankSlipOrdersResponse> {
    return apiService.get<BankSlipOrdersResponse>('/admin/payments/bank-slip/orders')
  }

  async reviewBankSlipOrder(orderId: string, payload: ReviewBankSlipPayload): Promise<ReviewBankSlipResponse> {
    return apiService.patch<ReviewBankSlipResponse, ReviewBankSlipPayload>(`/admin/payments/bank-slip/orders/${orderId}/review`, payload)
  }
}

export const paymentService = new PaymentService()
export default paymentService

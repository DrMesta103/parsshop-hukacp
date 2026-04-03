export type PaymentMethodCode =
  | 'zarinpal'
  | 'saman'
  | 'mellat'
  | 'pasargad'
  | 'bank_slip'
  | 'cash_on_delivery'

export type PaymentMethodType = 'online' | 'bank_slip' | 'cash_on_delivery'

export interface PaymentMethod {
  id: string
  code: PaymentMethodCode
  type: PaymentMethodType
  title: string
  isEnabled: boolean
  isSandboxEnabled: boolean
  displayOrder: number
  description: string | null
  instructions: string | null
  callbackUrl: string | null
  zarinpalMerchantId: string | null
  samanTerminalId: string | null
  mellatTerminalId: string | null
  mellatUsername: string | null
  mellatPassword: string | null
  pasargadMerchantCode: string | null
  pasargadTerminalCode: string | null
  pasargadCertificatePem: string | null
  bankName: string | null
  accountHolderName: string | null
  accountNumber: string | null
  cardNumber: string | null
  shebaNumber: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdatePaymentMethodPayload {
  isEnabled?: boolean
  isSandboxEnabled?: boolean
  displayOrder?: number
  title?: string
  description?: string | null
  instructions?: string | null
  callbackUrl?: string | null
  zarinpalMerchantId?: string | null
  samanTerminalId?: string | null
  mellatTerminalId?: string | null
  mellatUsername?: string | null
  mellatPassword?: string | null
  pasargadMerchantCode?: string | null
  pasargadTerminalCode?: string | null
  pasargadCertificatePem?: string | null
  bankName?: string | null
  accountHolderName?: string | null
  accountNumber?: string | null
  cardNumber?: string | null
  shebaNumber?: string | null
}

export interface BankSlipOrderUser {
  id: string
  fullName: string | null
  phone: string | null
  username: string | null
}

export interface BankSlipOrder {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentGateway: string | null
  totalAmount: number
  currency: string
  bankSlipTrackingNumber: string | null
  bankSlipImageUrl: string | null
  bankSlipSubmittedAt: string | null
  paymentVerifiedAt: string | null
  paymentReviewedAt: string | null
  paymentMetadata: Record<string, unknown> | null
  updatedAt: string
  user: BankSlipOrderUser | null
}

export interface BankSlipOrdersResponse {
  items: BankSlipOrder[]
}

export interface ReviewBankSlipPayload {
  approved: boolean
  adminNote: string
}

export interface ReviewBankSlipResponse {
  message: string
  order: BankSlipOrder
}

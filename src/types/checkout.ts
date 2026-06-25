export interface ShippingMethod {
  id: string
  code: string
  title: string
  description: string | null
  isEnabled: boolean
  feeAmount: number
  estimatedDeliveryDaysMin: number
  estimatedDeliveryDaysMax: number
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface ShippingMethodPayload {
  code: string
  title: string
  description?: string | null
  isEnabled: boolean
  feeAmount: number
  estimatedDeliveryDaysMin: number
  estimatedDeliveryDaysMax: number
  displayOrder: number
}

export interface CheckoutSummaryQuery {
  addressId?: string
  shippingMethodId?: string
  paymentMethodCode?: string
}

export interface CheckoutPaymentMethod {
  id?: string
  code: string
  title: string
  description?: string | null
  isEnabled?: boolean
  feeAmount?: number | null
}

export interface CheckoutAddress {
  id: string
  title?: string | null
  recipientName?: string | null
  phone?: string | null
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  [key: string]: unknown
}

export interface CheckoutCartItem {
  id?: string
  productId?: string
  title?: string
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  [key: string]: unknown
}

export interface CheckoutCart {
  items?: CheckoutCartItem[]
  itemsCount?: number
  currency_unit?: string
  currency_label?: string
  [key: string]: unknown
}

export interface CheckoutShippingSection {
  selectedMethod?: ShippingMethod | null
  methods?: ShippingMethod[]
  [key: string]: unknown
}

export interface CheckoutPaymentSection {
  selectedMethod?: CheckoutPaymentMethod | null
  methods?: CheckoutPaymentMethod[]
  [key: string]: unknown
}

export interface CheckoutPricing {
  subtotal?: number
  levelDiscount?: number
  payableSubtotal?: number
  shipping?: number
  tax?: number
  total?: number
  taxPercent?: number
  currency_unit?: string
  currency_label?: string
  [key: string]: unknown
}

export interface CheckoutNotes {
  orderWillNotBeCreated?: boolean
  requiresAddressSelection?: boolean
  [key: string]: unknown
}

export interface CheckoutSummaryResponse {
  reviewReady?: boolean
  cart?: CheckoutCart | null
  address?: CheckoutAddress | null
  availableAddresses?: CheckoutAddress[]
  shipping?: CheckoutShippingSection
  payment?: CheckoutPaymentSection
  pricing?: CheckoutPricing
  notes?: CheckoutNotes
  [key: string]: unknown
}

export interface CheckoutEndpointDocField {
  key: string
  type: string
  description: string
}

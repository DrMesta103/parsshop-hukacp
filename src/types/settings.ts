export type CurrencyDisplay = 'IRR' | 'TOMAN'

export interface PricingSettings {
  id: string
  usdToIrrRate: number
  defaultCurrencyDisplay: CurrencyDisplay
  createdAt: string
  updatedAt: string
}

export interface UpdatePricingSettingsPayload {
  usdToIrrRate: number
  defaultCurrencyDisplay: CurrencyDisplay
}

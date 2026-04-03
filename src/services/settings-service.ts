import apiService from '@/services/api'
import type { PricingSettings, UpdatePricingSettingsPayload } from '@/types/settings'

class SettingsService {
  async getPricingSettings(): Promise<PricingSettings> {
    return apiService.get<PricingSettings>('/admin/settings/pricing')
  }

  async updatePricingSettings(payload: UpdatePricingSettingsPayload): Promise<PricingSettings> {
    return apiService.patch<PricingSettings, UpdatePricingSettingsPayload>('/admin/settings/pricing', payload)
  }
}

export const settingsService = new SettingsService()
export default settingsService

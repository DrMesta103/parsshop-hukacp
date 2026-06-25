<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">تنظیمات سیستم</h1>
        <p class="mt-1 text-white-dark">تنظیمات مالی فروشگاه را از این بخش مدیریت کنید تا قیمت‌گذاری محصولات بر اساس نرخ واحد انجام شود.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn btn-outline-secondary" :disabled="isLoading || isSubmitting" @click="loadPricingSettings">
          بارگذاری مجدد
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <router-link to="/admin/settings/shipping-methods" class="panel transition hover:-translate-y-0.5 hover:border-primary/40">
        <div class="text-xs text-primary">Checkout</div>
        <div class="mt-2 text-lg font-semibold text-black dark:text-white">Shipping Methods</div>
        <p class="mt-2 text-sm text-white-dark">مدیریت روش‌های ارسال، وضعیت فعال/غیرفعال و ترتیب نمایش در checkout.</p>
      </router-link>

      <router-link to="/admin/settings/payment-gateways" class="panel transition hover:-translate-y-0.5 hover:border-primary/40">
        <div class="text-xs text-primary">Payments</div>
        <div class="mt-2 text-lg font-semibold text-black dark:text-white">Payment Gateways</div>
        <p class="mt-2 text-sm text-white-dark">هماهنگی تنظیمات پرداخت با preview checkout و روش‌های قابل انتخاب کاربر.</p>
      </router-link>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
      <div class="panel">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <div class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">مالی</div>
            <h2 class="mt-3 text-xl font-semibold text-black dark:text-white">تنظیمات قیمت</h2>
            <p class="mt-1 text-sm text-white-dark">نرخ تبدیل دلار به ریال و واحد نمایش پیش‌فرض قیمت محصولات را مشخص کنید.</p>
          </div>
        </div>

        <div v-if="errorMessage" class="mb-5 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
          <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
        </div>

        <form v-else class="space-y-5" @submit.prevent="submitPricingSettings">
          <div class="grid gap-5 lg:grid-cols-2">
            <div>
              <label for="pricing-usd-rate">نرخ دلار به ریال</label>
              <input
                id="pricing-usd-rate"
                v-model.number="form.usdToIrrRate"
                type="number"
                min="0"
                step="1"
                class="form-input"
                placeholder="مثلاً 925000"
              />
              <p class="mt-2 text-xs text-white-dark">این عدد مبنای تبدیل قیمت دلاری محصولات در کل فروشگاه است.</p>
            </div>

            <div>
              <label for="pricing-currency-display">واحد نمایش پیش‌فرض</label>
              <select id="pricing-currency-display" v-model="form.defaultCurrencyDisplay" class="form-select">
                <option v-for="option in currencyDisplayOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <p class="mt-2 text-xs text-white-dark">کاربران قیمت‌ها را به‌صورت پیش‌فرض با این واحد می‌بینند.</p>
            </div>
          </div>

          <div class="rounded-2xl border border-white-light bg-white-light/30 px-4 py-4 dark:border-[#1b2e4b] dark:bg-[#060818]">
            <div class="mb-3 text-sm font-semibold text-black dark:text-white">پیش‌نمایش سریع</div>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-xl bg-white px-4 py-4 shadow-sm dark:bg-[#0e1726]">
                <div class="text-xs text-white-dark">نرخ فعلی</div>
                <div class="mt-2 text-lg font-bold text-black dark:text-white">{{ formatNumber(form.usdToIrrRate) }} ریال</div>
              </div>
              <div class="rounded-xl bg-white px-4 py-4 shadow-sm dark:bg-[#0e1726]">
                <div class="text-xs text-white-dark">نمایش پیش‌فرض</div>
                <div class="mt-2 text-lg font-bold text-black dark:text-white">{{ selectedCurrencyLabel }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white-light pt-5 dark:border-[#1b2e4b]">
            <div class="text-xs leading-6 text-white-dark">
              <div>ایجاد: {{ pricingSettings ? formatDateTime(pricingSettings.createdAt) : '-' }}</div>
              <div>آخرین بروزرسانی: {{ pricingSettings ? formatDateTime(pricingSettings.updatedAt) : '-' }}</div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn btn-outline-secondary" :disabled="isSubmitting" @click="resetForm">بازنشانی</button>
              <button type="submit" class="btn btn-primary min-w-[140px]" :disabled="isSubmitting">
                <span v-if="isSubmitting">در حال ذخیره...</span>
                <span v-else>ذخیره تنظیمات</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="space-y-6">
        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">نکات این بخش</h3>
          <div class="mt-4 space-y-3 text-sm leading-7 text-white-dark">
            <p>بعد از ذخیره موفق، بک‌اند cache قیمت محصولات را invalidate می‌کند و نیازی به refresh دستی از سمت فرانت نیست.</p>
            <p>اگر هنوز تنظیمی در دیتابیس نباشد، بک‌اند یک رکورد پیش‌فرض می‌سازد و این صفحه همان را لود می‌کند.</p>
            <p>برای جلوگیری از خطای اعتبارسنجی، نرخ دلار فقط باید عددی بزرگ‌تر یا مساوی صفر باشد.</p>
          </div>
        </div>

        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">واحدهای مجاز</h3>
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-white-light px-4 py-4 dark:border-[#1b2e4b]">
              <div class="text-sm font-semibold text-black dark:text-white">IRR</div>
              <div class="mt-1 text-xs text-white-dark">نمایش قیمت بر اساس ریال</div>
            </div>
            <div class="rounded-xl border border-white-light px-4 py-4 dark:border-[#1b2e4b]">
              <div class="text-sm font-semibold text-black dark:text-white">TOMAN</div>
              <div class="mt-1 text-xs text-white-dark">نمایش قیمت بر اساس تومان</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import { extractApiErrorMessage } from '@/services/admin-api'
import settingsService from '@/services/settings-service'
import type { CurrencyDisplay, PricingSettings } from '@/types/settings'

const currencyDisplayOptions: Array<{ value: CurrencyDisplay; label: string }> = [
  { value: 'IRR', label: 'IRR' },
  { value: 'TOMAN', label: 'TOMAN' },
]

const pricingSettings = ref<PricingSettings | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive<{
  usdToIrrRate: number
  defaultCurrencyDisplay: CurrencyDisplay
}>({
  usdToIrrRate: 0,
  defaultCurrencyDisplay: 'IRR',
})

const selectedCurrencyLabel = computed(() => {
  return currencyDisplayOptions.find((option) => option.value === form.defaultCurrencyDisplay)?.label || form.defaultCurrencyDisplay
})

const syncForm = (settings: PricingSettings) => {
  pricingSettings.value = settings
  form.usdToIrrRate = Number(settings.usdToIrrRate ?? 0)
  form.defaultCurrencyDisplay = settings.defaultCurrencyDisplay
}

const loadPricingSettings = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await settingsService.getPricingSettings()
    syncForm(response)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری تنظیمات قیمت انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  if (!pricingSettings.value) return
  syncForm(pricingSettings.value)
  errorMessage.value = ''
}

const formatNumber = (value: number) => new Intl.NumberFormat('fa-IR').format(Number(value || 0))

const formatDateTime = (value: string) => {
  if (!value) return '-'

  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const submitPricingSettings = async () => {
  errorMessage.value = ''

  if (!Number.isFinite(Number(form.usdToIrrRate)) || Number(form.usdToIrrRate) < 0) {
    errorMessage.value = 'نرخ دلار به ریال باید عددی معتبر و بزرگ‌تر یا مساوی صفر باشد'
    return
  }

  isSubmitting.value = true

  try {
    const response = await settingsService.updatePricingSettings({
      usdToIrrRate: Number(form.usdToIrrRate),
      defaultCurrencyDisplay: form.defaultCurrencyDisplay,
    })

    syncForm(response)

    await Swal.fire({
      icon: 'success',
      title: 'تنظیمات ذخیره شد',
      text: 'تنظیمات قیمت با موفقیت بروزرسانی شد',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'ذخیره تنظیمات قیمت انجام نشد')
    await Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: errorMessage.value,
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadPricingSettings()
})
</script>

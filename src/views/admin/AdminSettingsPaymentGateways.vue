<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">درگاه های پرداخت</h1>
        <p class="mt-1 text-white-dark">درگاه‌های بانکی را به‌صورت کارت‌های مستقل مدیریت کنید. هر کارت با کلیک باز می‌شود و فقط فیلدهای خودش را نشان می‌دهد.</p>
      </div>
      <button type="button" class="btn btn-outline-secondary" :disabled="isLoading" @click="loadPaymentMethods">بارگذاری مجدد</button>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <div class="panel">
        <div class="text-xs text-white-dark">کل درگاه‌ها</div>
        <div class="mt-2 text-2xl font-bold text-black dark:text-white">{{ paymentMethods.length }}</div>
      </div>
      <div class="panel">
        <div class="text-xs text-white-dark">فعال</div>
        <div class="mt-2 text-2xl font-bold text-success">{{ enabledCount }}</div>
      </div>
      <div class="panel">
        <div class="text-xs text-white-dark">حالت تست</div>
        <div class="mt-2 text-2xl font-bold text-primary">{{ sandboxEnabledCount }}</div>
      </div>
      <div class="panel">
        <div class="text-xs text-white-dark">مرتب‌سازی</div>
        <div class="mt-2 text-2xl font-bold text-warning">{{ sortedMethods.length ? sortedMethods[0].displayOrder : 0 }}+</div>
      </div>
    </div>

    <div v-if="pageErrorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
      {{ pageErrorMessage }}
    </div>

    <div v-if="isLoading" class="panel grid min-h-[320px] place-content-center">
      <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
    </div>

    <div v-else class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_340px]">
      <div class="space-y-4">
        <article
          v-for="method in sortedMethods"
          :key="method.code"
          class="overflow-hidden rounded-3xl border border-white-light bg-white shadow-sm transition dark:border-[#1b2e4b] dark:bg-[#060818]"
        >
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 px-5 py-5 text-right transition hover:bg-white-light/30 dark:hover:bg-white/5"
            @click="toggleMethod(method.code)"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold text-black dark:text-white">{{ methodDrafts[method.code].title || method.title }}</h2>
                <span class="badge bg-primary/10 text-primary">{{ method.code }}</span>
                <span class="badge" :class="methodDrafts[method.code].isEnabled ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'">
                  {{ methodDrafts[method.code].isEnabled ? 'فعال' : 'غیرفعال' }}
                </span>
                <span v-if="method.type === 'online' && methodDrafts[method.code].isSandboxEnabled" class="badge bg-warning/15 text-warning">Sandbox</span>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-white-dark">
                <span>ترتیب {{ methodDrafts[method.code].displayOrder }}</span>
                <span>{{ methodDrafts[method.code].description || 'توضیحی ثبت نشده است.' }}</span>
              </div>
            </div>
            <span class="text-xl leading-none text-white-dark transition" :class="openMethodCode === method.code ? 'rotate-45 text-primary' : ''">+</span>
          </button>

          <div v-if="openMethodCode === method.code" class="border-t border-white-light px-5 py-5 dark:border-[#1b2e4b]">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block">عنوان</label>
                <input v-model.trim="methodDrafts[method.code].title" type="text" class="form-input" />
              </div>
              <div>
                <label class="mb-2 block">ترتیب نمایش</label>
                <input v-model.number="methodDrafts[method.code].displayOrder" type="number" min="0" class="form-input" />
              </div>
            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label class="flex items-center gap-3 rounded-2xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
                <input v-model="methodDrafts[method.code].isEnabled" type="checkbox" class="form-checkbox outline-primary" />
                <span class="text-sm text-black dark:text-white">فعال باشد</span>
              </label>
              <label
                v-if="method.type === 'online'"
                class="flex items-center gap-3 rounded-2xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]"
              >
                <input v-model="methodDrafts[method.code].isSandboxEnabled" type="checkbox" class="form-checkbox outline-primary" />
                <span class="text-sm text-black dark:text-white">حالت آزمایشی</span>
              </label>
            </div>

            <div class="mt-4">
              <label class="mb-2 block">توضیحات</label>
              <textarea v-model.trim="methodDrafts[method.code].description" rows="3" class="form-textarea"></textarea>
            </div>

            <div class="mt-4">
              <label class="mb-2 block">راهنما</label>
              <textarea v-model.trim="methodDrafts[method.code].instructions" rows="3" class="form-textarea"></textarea>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2">
              <div v-if="showsField(method.code, 'callbackUrl')">
                <label class="mb-2 block">Callback URL</label>
                <input v-model.trim="methodDrafts[method.code].callbackUrl" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'zarinpalMerchantId')">
                <label class="mb-2 block">Merchant ID</label>
                <input v-model.trim="methodDrafts[method.code].zarinpalMerchantId" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'samanTerminalId')">
                <label class="mb-2 block">Terminal ID</label>
                <input v-model.trim="methodDrafts[method.code].samanTerminalId" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'mellatTerminalId')">
                <label class="mb-2 block">Terminal ID</label>
                <input v-model.trim="methodDrafts[method.code].mellatTerminalId" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'mellatUsername')">
                <label class="mb-2 block">Username</label>
                <input v-model.trim="methodDrafts[method.code].mellatUsername" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'mellatPassword')">
                <label class="mb-2 block">Password</label>
                <input v-model.trim="methodDrafts[method.code].mellatPassword" type="password" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'pasargadMerchantCode')">
                <label class="mb-2 block">Merchant Code</label>
                <input v-model.trim="methodDrafts[method.code].pasargadMerchantCode" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'pasargadTerminalCode')">
                <label class="mb-2 block">Terminal Code</label>
                <input v-model.trim="methodDrafts[method.code].pasargadTerminalCode" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'bankName')">
                <label class="mb-2 block">نام بانک</label>
                <input v-model.trim="methodDrafts[method.code].bankName" type="text" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'accountHolderName')">
                <label class="mb-2 block">نام صاحب حساب</label>
                <input v-model.trim="methodDrafts[method.code].accountHolderName" type="text" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'accountNumber')">
                <label class="mb-2 block">شماره حساب</label>
                <input v-model.trim="methodDrafts[method.code].accountNumber" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'cardNumber')">
                <label class="mb-2 block">شماره کارت</label>
                <input v-model.trim="methodDrafts[method.code].cardNumber" type="text" dir="ltr" class="form-input" />
              </div>

              <div v-if="showsField(method.code, 'shebaNumber')" class="md:col-span-2">
                <label class="mb-2 block">شماره شبا</label>
                <input v-model.trim="methodDrafts[method.code].shebaNumber" type="text" dir="ltr" class="form-input" />
              </div>
            </div>

            <div v-if="showsField(method.code, 'pasargadCertificatePem')" class="mt-4">
              <label class="mb-2 block">Certificate PEM</label>
              <textarea v-model.trim="methodDrafts[method.code].pasargadCertificatePem" rows="6" class="form-textarea font-mono text-sm" dir="ltr"></textarea>
            </div>

            <div class="mt-5 flex flex-wrap justify-end gap-2 border-t border-white-light pt-4 dark:border-[#1b2e4b]">
              <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isMethodSaving(method.code)" @click="resetMethodDraft(method.code)">بازنشانی</button>
              <button type="button" class="btn btn-primary btn-sm" :disabled="isMethodSaving(method.code)" @click="saveMethod(method.code)">
                <span v-if="isMethodSaving(method.code)">در حال ذخیره...</span>
                <span v-else>ذخیره تنظیمات</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <aside class="space-y-6">
        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">راهنمای سریع</h3>
          <div class="mt-4 space-y-3 text-sm leading-7 text-white-dark">
            <p>هر درگاه یک کارت دارد و با کلیک باز می‌شود.</p>
            <p>فقط فیلدهای مرتبط با همان `code` نمایش داده می‌شوند.</p>
            <p>در صورت فعال‌سازی با داده ناقص، بک‌اند خطای `400` برمی‌گرداند.</p>
          </div>
        </div>

        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">حداقل داده لازم</h3>
          <div class="mt-4 space-y-3 text-sm leading-7 text-white-dark">
            <p>زرین‌پال: `Merchant ID` و `Callback URL`</p>
            <p>سامان: `Terminal ID` و `Callback URL`</p>
            <p>ملت: `Terminal ID`، `Username`، `Password` و `Callback URL`</p>
            <p>پاسارگاد: `Merchant Code`، `Terminal Code`، `Certificate PEM` و `Callback URL`</p>
            <p>فیش بانکی: `نام بانک`، `نام صاحب حساب` و `شماره حساب`</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import { extractApiErrorMessage } from '@/services/admin-api'
import paymentService from '@/services/payment-service'
import type { PaymentMethod, PaymentMethodCode } from '@/types/payment'

type PaymentMethodDraft = {
  title: string
  isEnabled: boolean
  isSandboxEnabled: boolean
  displayOrder: number
  description: string
  instructions: string
  callbackUrl: string
  zarinpalMerchantId: string
  samanTerminalId: string
  mellatTerminalId: string
  mellatUsername: string
  mellatPassword: string
  pasargadMerchantCode: string
  pasargadTerminalCode: string
  pasargadCertificatePem: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  cardNumber: string
  shebaNumber: string
}

const paymentMethods = ref<PaymentMethod[]>([])
const isLoading = ref(true)
const pageErrorMessage = ref('')
const savingMethodCodes = ref<string[]>([])
const openMethodCode = ref<PaymentMethodCode | ''>('')
const methodDrafts = reactive<Record<string, PaymentMethodDraft>>({})

const toDraft = (method: PaymentMethod): PaymentMethodDraft => ({
  title: method.title || '',
  isEnabled: Boolean(method.isEnabled),
  isSandboxEnabled: Boolean(method.isSandboxEnabled),
  displayOrder: Number(method.displayOrder ?? 0),
  description: method.description || '',
  instructions: method.instructions || '',
  callbackUrl: method.callbackUrl || '',
  zarinpalMerchantId: method.zarinpalMerchantId || '',
  samanTerminalId: method.samanTerminalId || '',
  mellatTerminalId: method.mellatTerminalId || '',
  mellatUsername: method.mellatUsername || '',
  mellatPassword: method.mellatPassword || '',
  pasargadMerchantCode: method.pasargadMerchantCode || '',
  pasargadTerminalCode: method.pasargadTerminalCode || '',
  pasargadCertificatePem: method.pasargadCertificatePem || '',
  bankName: method.bankName || '',
  accountHolderName: method.accountHolderName || '',
  accountNumber: method.accountNumber || '',
  cardNumber: method.cardNumber || '',
  shebaNumber: method.shebaNumber || '',
})

const syncMethodDraft = (method: PaymentMethod) => {
  methodDrafts[method.code] = toDraft(method)
}

const sortedMethods = computed(() => [...paymentMethods.value].sort((a, b) => a.displayOrder - b.displayOrder))
const enabledCount = computed(() => paymentMethods.value.filter((method) => method.isEnabled).length)
const sandboxEnabledCount = computed(() => paymentMethods.value.filter((method) => method.isSandboxEnabled).length)

const isMethodSaving = (code: string) => savingMethodCodes.value.includes(code)

const showsField = (code: PaymentMethodCode, field: string) => {
  const fieldMap: Record<PaymentMethodCode, string[]> = {
    zarinpal: ['callbackUrl', 'zarinpalMerchantId'],
    saman: ['callbackUrl', 'samanTerminalId'],
    mellat: ['callbackUrl', 'mellatTerminalId', 'mellatUsername', 'mellatPassword'],
    pasargad: ['callbackUrl', 'pasargadMerchantCode', 'pasargadTerminalCode', 'pasargadCertificatePem'],
    bank_slip: ['bankName', 'accountHolderName', 'accountNumber', 'cardNumber', 'shebaNumber'],
    cash_on_delivery: [],
  }

  return fieldMap[code].includes(field)
}

const loadPaymentMethods = async () => {
  isLoading.value = true
  pageErrorMessage.value = ''

  try {
    const response = await paymentService.getPaymentMethods()
    paymentMethods.value = response
    response.forEach(syncMethodDraft)
    if (!openMethodCode.value && response.length) {
      openMethodCode.value = response[0].code
    }
  } catch (error) {
    pageErrorMessage.value = extractApiErrorMessage(error, 'بارگذاری روش‌های پرداخت انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const toggleMethod = (code: PaymentMethodCode) => {
  openMethodCode.value = openMethodCode.value === code ? '' : code
}

const resetMethodDraft = (code: PaymentMethodCode) => {
  const method = paymentMethods.value.find((item) => item.code === code)
  if (!method) return
  syncMethodDraft(method)
}

const buildPayload = (code: PaymentMethodCode) => {
  const draft = methodDrafts[code]

  return {
    title: draft.title.trim(),
    isEnabled: draft.isEnabled,
    isSandboxEnabled: draft.isSandboxEnabled,
    displayOrder: Math.max(0, Number(draft.displayOrder || 0)),
    description: draft.description.trim() || null,
    instructions: draft.instructions.trim() || null,
    callbackUrl: draft.callbackUrl.trim() || null,
    zarinpalMerchantId: draft.zarinpalMerchantId.trim() || null,
    samanTerminalId: draft.samanTerminalId.trim() || null,
    mellatTerminalId: draft.mellatTerminalId.trim() || null,
    mellatUsername: draft.mellatUsername.trim() || null,
    mellatPassword: draft.mellatPassword.trim() || null,
    pasargadMerchantCode: draft.pasargadMerchantCode.trim() || null,
    pasargadTerminalCode: draft.pasargadTerminalCode.trim() || null,
    pasargadCertificatePem: draft.pasargadCertificatePem.trim() || null,
    bankName: draft.bankName.trim() || null,
    accountHolderName: draft.accountHolderName.trim() || null,
    accountNumber: draft.accountNumber.trim() || null,
    cardNumber: draft.cardNumber.trim() || null,
    shebaNumber: draft.shebaNumber.trim() || null,
  }
}

const saveMethod = async (code: PaymentMethodCode) => {
  savingMethodCodes.value = [...savingMethodCodes.value, code]

  try {
    const updatedMethod = await paymentService.updatePaymentMethod(code, buildPayload(code))
    paymentMethods.value = paymentMethods.value.map((item) => (item.code === code ? updatedMethod : item))
    syncMethodDraft(updatedMethod)

    await Swal.fire({
      icon: 'success',
      title: 'ذخیره شد',
      text: `تنظیمات ${updatedMethod.title} بروزرسانی شد`,
      timer: 1400,
      showConfirmButton: false,
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: extractApiErrorMessage(error, 'ذخیره روش پرداخت انجام نشد'),
    })
  } finally {
    savingMethodCodes.value = savingMethodCodes.value.filter((item) => item !== code)
  }
}

onMounted(async () => {
  await loadPaymentMethods()
})
</script>

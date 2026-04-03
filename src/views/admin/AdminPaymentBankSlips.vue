<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">فیش های بانکی ارسالی</h1>
        <p class="mt-1 text-white-dark">فیش‌های ثبت‌شده را بررسی کن، تصویر و شماره پیگیری را ببین و نتیجه را ثبت کن.</p>
      </div>
      <button type="button" class="btn btn-outline-secondary" :disabled="isLoading" @click="loadOrders">بارگذاری مجدد</button>
    </div>

    <div v-if="errorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="panel grid min-h-[320px] place-content-center">
      <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
    </div>

    <div v-else-if="orders.length === 0" class="panel rounded-3xl border border-dashed border-white-light px-4 py-12 text-center text-sm text-white-dark dark:border-[#1b2e4b]">
      موردی برای بررسی وجود ندارد.
    </div>

    <div v-else class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <article
        v-for="order in orders"
        :key="order.id"
        class="overflow-hidden rounded-3xl border border-white-light bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#060818]"
      >
        <div class="border-b border-white-light px-5 py-4 dark:border-[#1b2e4b]">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-black dark:text-white">{{ order.orderNumber }}</h2>
              <div class="mt-1 text-xs text-white-dark">{{ order.paymentStatus }} / {{ order.status }}</div>
            </div>
            <span class="badge bg-warning/10 text-warning">منتظر بررسی</span>
          </div>
        </div>

        <div class="grid gap-5 p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div class="overflow-hidden rounded-2xl border border-white-light dark:border-[#1b2e4b]">
            <img v-if="order.bankSlipImageUrl" :src="order.bankSlipImageUrl" alt="bank slip" class="h-full w-full object-cover" />
            <div v-else class="grid h-[220px] place-content-center text-sm text-white-dark">تصویر ندارد</div>
          </div>

          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
                <div class="text-xs text-white-dark">مبلغ</div>
                <div class="mt-1 font-semibold text-black dark:text-white">{{ formatMoney(order.totalAmount, order.currency) }}</div>
              </div>
              <div class="rounded-2xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
                <div class="text-xs text-white-dark">شماره پیگیری</div>
                <div class="mt-1 font-semibold text-black dark:text-white">{{ order.bankSlipTrackingNumber || '-' }}</div>
              </div>
            </div>

            <div class="rounded-2xl border border-white-light px-4 py-4 dark:border-[#1b2e4b]">
              <div class="mb-2 text-sm font-semibold text-black dark:text-white">کاربر</div>
              <div class="grid gap-2 text-sm text-white-dark">
                <div>نام: {{ order.user?.fullName || '-' }}</div>
                <div>موبایل: {{ order.user?.phone || '-' }}</div>
                <div>نام کاربری: {{ order.user?.username || '-' }}</div>
              </div>
            </div>

            <div class="rounded-2xl border border-white-light px-4 py-4 dark:border-[#1b2e4b]">
              <div class="mb-2 text-sm font-semibold text-black dark:text-white">یادداشت مشتری</div>
              <p class="text-sm leading-7 text-white-dark">{{ getCustomerNote(order) || 'یادداشتی ثبت نشده است.' }}</p>
            </div>

            <div>
              <label class="mb-2 block">یادداشت ادمین</label>
              <textarea v-model.trim="reviewDrafts[order.id]" rows="4" class="form-textarea" placeholder="تایید شد یا دلیل رد را بنویسید"></textarea>
            </div>

            <div class="flex flex-wrap gap-2">
              <a v-if="order.bankSlipImageUrl" :href="order.bankSlipImageUrl" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">نمایش تصویر</a>
              <button type="button" class="btn btn-outline-danger btn-sm" :disabled="isSaving(order.id)" @click="reviewOrder(order, false)">رد فیش</button>
              <button type="button" class="btn btn-success btn-sm" :disabled="isSaving(order.id)" @click="reviewOrder(order, true)">تایید فیش</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import { extractApiErrorMessage } from '@/services/admin-api'
import paymentService from '@/services/payment-service'
import type { BankSlipOrder } from '@/types/payment'

const orders = ref<BankSlipOrder[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const savingOrderIds = ref<string[]>([])
const reviewDrafts = reactive<Record<string, string>>({})

const isSaving = (orderId: string) => savingOrderIds.value.includes(orderId)

const loadOrders = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await paymentService.getBankSlipOrders()
    orders.value = response.items || []
    orders.value.forEach((order) => {
      if (reviewDrafts[order.id] === undefined) reviewDrafts[order.id] = ''
    })
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری فیش‌های بانکی انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const reviewOrder = async (order: BankSlipOrder, approved: boolean) => {
  savingOrderIds.value = [...savingOrderIds.value, order.id]

  try {
    const response = await paymentService.reviewBankSlipOrder(order.id, {
      approved,
      adminNote: reviewDrafts[order.id]?.trim() || (approved ? 'تایید شد' : 'رد شد'),
    })

    orders.value = orders.value.filter((item) => item.id !== order.id)
    delete reviewDrafts[order.id]

    await Swal.fire({
      icon: 'success',
      title: approved ? 'فیش تایید شد' : 'فیش رد شد',
      text: response.message,
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: extractApiErrorMessage(error, 'ثبت نتیجه بررسی فیش بانکی انجام نشد'),
    })
  } finally {
    savingOrderIds.value = savingOrderIds.value.filter((item) => item !== order.id)
  }
}

const getCustomerNote = (order: BankSlipOrder) => (typeof order.paymentMetadata?.bankSlipNotes === 'string' ? order.paymentMetadata.bankSlipNotes : '')

const formatMoney = (amount: number, currency: string) => {
  const formatted = new Intl.NumberFormat('fa-IR').format(Number(amount || 0))
  return `${formatted} ${currency === 'TOMAN' ? 'تومان' : currency === 'IRR' ? 'ریال' : currency}`
}

onMounted(async () => {
  await loadOrders()
})
</script>

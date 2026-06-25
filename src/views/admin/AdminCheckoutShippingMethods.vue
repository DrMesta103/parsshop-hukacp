<template>
  <div class="space-y-6">
    <CheckoutManagementHeader
      section="Shipping Methods"
      title="مدیریت روش‌های ارسال"
      description="روش‌های ارسال در checkout تعیین می‌کنند کاربر چه گزینه‌هایی برای تحویل سفارش ببیند و breakdown هزینه نهایی چگونه محاسبه شود."
    >
      <template #actions>
        <button type="button" class="btn btn-primary" @click="openCreateModal">ایجاد روش ارسال</button>
      </template>
    </CheckoutManagementHeader>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.85fr)]">
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="panel">
            <div class="text-xs text-white-dark">کل روش‌ها</div>
            <div class="mt-2 text-2xl font-bold text-black dark:text-white">{{ shippingMethods.length }}</div>
          </div>
          <div class="panel">
            <div class="text-xs text-white-dark">فعال</div>
            <div class="mt-2 text-2xl font-bold text-success">{{ enabledCount }}</div>
          </div>
          <div class="panel">
            <div class="text-xs text-white-dark">میانگین هزینه</div>
            <div class="mt-2 text-2xl font-bold text-primary">{{ averageFeeLabel }}</div>
          </div>
        </div>

        <ShippingMethodsTable
          :items="sortedShippingMethods"
          :is-loading="isLoading"
          :error-message="pageErrorMessage"
          :busy-ids="busyShippingMethodIds"
          @edit="openEditModal"
          @toggle-status="toggleShippingMethodStatus"
        />
      </div>

      <div class="space-y-6">
        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">نقش Shipping Methods در Checkout</h3>
          <div class="mt-4 space-y-3 text-sm leading-7 text-white-dark">
            <p>هر روش ارسال در endpoint `GET /api/checkout/summary` داخل `shipping.methods` برمی‌گردد و بر مبلغ `pricing.shipping` اثر می‌گذارد.</p>
            <p>غیرفعال بودن یک روش ارسال باعث می‌شود در preview checkout دیده نشود، اما رکورد برای گزارش‌گیری و تنظیمات باقی بماند.</p>
            <p>برای تجربه بهتر ادمین، ترتیب نمایش را طوری تنظیم کنید که گزینه‌های اصلی مثل پست و اکسپرس در بالای لیست قرار بگیرند.</p>
          </div>
        </div>

        <div class="panel">
          <h3 class="text-lg font-semibold text-black dark:text-white">Pricing Breakdown</h3>
          <div class="mt-4 space-y-3 text-sm text-white-dark">
            <div class="rounded-xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <div class="font-semibold text-black dark:text-white">pricing.subtotal</div>
              <div class="mt-1">جمع محصولات پیش از تخفیف و ارسال</div>
            </div>
            <div class="rounded-xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <div class="font-semibold text-black dark:text-white">pricing.shipping</div>
              <div class="mt-1">هزینه روش ارسال انتخاب‌شده در checkout summary</div>
            </div>
            <div class="rounded-xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <div class="font-semibold text-black dark:text-white">pricing.tax / pricing.total</div>
              <div class="mt-1">مالیات و مبلغ نهایی قابل پرداخت پس از اعمال تخفیف و حمل</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ShippingMethodFormModal
      :open="isModalOpen"
      :mode="modalMode"
      :model-value="selectedShippingMethod"
      :is-submitting="isSubmitting"
      :form-error-message="formErrorMessage"
      @close="closeModal"
      @submit="submitShippingMethod"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import CheckoutManagementHeader from '@/components/admin/checkout/CheckoutManagementHeader.vue'
import ShippingMethodFormModal from '@/components/admin/checkout/ShippingMethodFormModal.vue'
import ShippingMethodsTable from '@/components/admin/checkout/ShippingMethodsTable.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import checkoutService from '@/services/checkout-service'
import type { ShippingMethod, ShippingMethodPayload } from '@/types/checkout'

useMeta({ title: 'مدیریت روش‌های ارسال' })

const shippingMethods = ref<ShippingMethod[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const pageErrorMessage = ref('')
const formErrorMessage = ref('')
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedShippingMethod = ref<ShippingMethod | null>(null)
const busyShippingMethodIds = ref<string[]>([])

const sortedShippingMethods = computed(() => [...shippingMethods.value].sort((a, b) => a.displayOrder - b.displayOrder))
const enabledCount = computed(() => shippingMethods.value.filter((item) => item.isEnabled).length)
const averageFeeLabel = computed(() => {
  if (!shippingMethods.value.length) return '0'
  const total = shippingMethods.value.reduce((sum, item) => sum + Number(item.feeAmount || 0), 0)
  return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(Math.round(total / shippingMethods.value.length))
})

const loadShippingMethods = async () => {
  isLoading.value = true
  pageErrorMessage.value = ''

  try {
    shippingMethods.value = await checkoutService.getShippingMethods()
  } catch (error) {
    pageErrorMessage.value = extractApiErrorMessage(error, 'بارگذاری روش‌های ارسال انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedShippingMethod.value = null
  formErrorMessage.value = ''
  isModalOpen.value = true
}

const openEditModal = (item: ShippingMethod) => {
  modalMode.value = 'edit'
  selectedShippingMethod.value = item
  formErrorMessage.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  if (isSubmitting.value) return
  isModalOpen.value = false
  selectedShippingMethod.value = null
  formErrorMessage.value = ''
}

const submitShippingMethod = async (payload: ShippingMethodPayload) => {
  formErrorMessage.value = ''
  isSubmitting.value = true

  try {
    if (modalMode.value === 'create') {
      await checkoutService.createShippingMethod(payload)
      await Swal.fire({
        icon: 'success',
        title: 'روش ارسال ایجاد شد',
        text: 'روش ارسال جدید با موفقیت ثبت شد.',
        timer: 1500,
        showConfirmButton: false,
      })
    } else if (selectedShippingMethod.value) {
      await checkoutService.updateShippingMethod(selectedShippingMethod.value.id, payload)
      await Swal.fire({
        icon: 'success',
        title: 'روش ارسال بروزرسانی شد',
        text: 'تغییرات این روش ارسال ذخیره شد.',
        timer: 1500,
        showConfirmButton: false,
      })
    }

    closeModal()
    await loadShippingMethods()
  } catch (error) {
    formErrorMessage.value = extractApiErrorMessage(error, 'ذخیره روش ارسال انجام نشد')
  } finally {
    isSubmitting.value = false
  }
}

const toggleShippingMethodStatus = async (item: ShippingMethod) => {
  busyShippingMethodIds.value = [...busyShippingMethodIds.value, item.id]

  try {
    await checkoutService.updateShippingMethod(item.id, { isEnabled: !item.isEnabled })
    await loadShippingMethods()
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: extractApiErrorMessage(error, 'تغییر وضعیت روش ارسال انجام نشد'),
    })
  } finally {
    busyShippingMethodIds.value = busyShippingMethodIds.value.filter((id) => id !== item.id)
  }
}

onMounted(loadShippingMethods)
</script>

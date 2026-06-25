<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-black dark:text-white">{{ mode === 'create' ? 'ایجاد روش ارسال' : 'ویرایش روش ارسال' }}</h2>
          <p class="mt-1 text-sm text-white-dark">اطلاعات روش ارسال را برای نمایش در checkout و محاسبه preview سفارش ثبت کنید.</p>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isSubmitting" @click="$emit('close')">بستن</button>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid gap-5 md:grid-cols-2">
          <div :class="{ 'has-error': validation.code }">
            <label for="shipping-code">Code</label>
            <input id="shipping-code" v-model.trim="form.code" type="text" dir="ltr" class="form-input" placeholder="post-express" :disabled="mode === 'edit'" />
            <p v-if="validation.code" class="mt-1 text-xs text-danger">{{ validation.code }}</p>
          </div>

          <div :class="{ 'has-error': validation.title }">
            <label for="shipping-title">عنوان</label>
            <input id="shipping-title" v-model.trim="form.title" type="text" class="form-input" placeholder="ارسال پیشتاز" />
            <p v-if="validation.title" class="mt-1 text-xs text-danger">{{ validation.title }}</p>
          </div>
        </div>

        <div>
          <label for="shipping-description">توضیحات</label>
          <textarea id="shipping-description" v-model.trim="form.description" rows="3" class="form-textarea" placeholder="توضیح کوتاه برای نمایش به ادمین یا کاربر checkout"></textarea>
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div :class="{ 'has-error': validation.feeAmount }">
            <label for="shipping-fee">هزینه</label>
            <input id="shipping-fee" v-model.number="form.feeAmount" type="number" min="0" step="1" class="form-input" />
            <p v-if="validation.feeAmount" class="mt-1 text-xs text-danger">{{ validation.feeAmount }}</p>
          </div>

          <div :class="{ 'has-error': validation.estimatedDeliveryDaysMin }">
            <label for="shipping-min-days">حداقل روز تحویل</label>
            <input id="shipping-min-days" v-model.number="form.estimatedDeliveryDaysMin" type="number" min="0" step="1" class="form-input" />
            <p v-if="validation.estimatedDeliveryDaysMin" class="mt-1 text-xs text-danger">{{ validation.estimatedDeliveryDaysMin }}</p>
          </div>

          <div :class="{ 'has-error': validation.estimatedDeliveryDaysMax }">
            <label for="shipping-max-days">حداکثر روز تحویل</label>
            <input id="shipping-max-days" v-model.number="form.estimatedDeliveryDaysMax" type="number" min="0" step="1" class="form-input" />
            <p v-if="validation.estimatedDeliveryDaysMax" class="mt-1 text-xs text-danger">{{ validation.estimatedDeliveryDaysMax }}</p>
          </div>

          <div :class="{ 'has-error': validation.displayOrder }">
            <label for="shipping-order">ترتیب نمایش</label>
            <input id="shipping-order" v-model.number="form.displayOrder" type="number" min="0" step="1" class="form-input" />
            <p v-if="validation.displayOrder" class="mt-1 text-xs text-danger">{{ validation.displayOrder }}</p>
          </div>
        </div>

        <label class="flex items-center gap-3 rounded-2xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
          <input v-model="form.isEnabled" type="checkbox" class="form-checkbox outline-primary" />
          <div>
            <div class="text-sm font-semibold text-black dark:text-white">فعال باشد</div>
            <div class="text-xs text-white-dark">در صورت غیرفعال بودن، این روش در checkout preview پیشنهاد نمی‌شود.</div>
          </div>
        </label>

        <div v-if="formErrorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
          {{ formErrorMessage }}
        </div>

        <div class="flex gap-3 border-t border-white-light pt-5 dark:border-[#1b2e4b]">
          <button type="submit" class="btn btn-primary flex-1" :disabled="isSubmitting || hasValidationError">
            {{ isSubmitting ? 'در حال ذخیره...' : mode === 'create' ? 'ایجاد روش ارسال' : 'ذخیره تغییرات' }}
          </button>
          <button type="button" class="btn btn-outline-secondary" :disabled="isSubmitting" @click="$emit('close')">انصراف</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { ShippingMethod, ShippingMethodPayload } from '@/types/checkout'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  modelValue: ShippingMethod | null
  isSubmitting: boolean
  formErrorMessage: string
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: ShippingMethodPayload]
}>()

const createInitialForm = (): ShippingMethodPayload => ({
  code: '',
  title: '',
  description: '',
  isEnabled: true,
  feeAmount: 0,
  estimatedDeliveryDaysMin: 0,
  estimatedDeliveryDaysMax: 0,
  displayOrder: 0,
})

const form = reactive<ShippingMethodPayload>(createInitialForm())

const syncForm = (value: ShippingMethod | null) => {
  const next = value
    ? {
        code: value.code,
        title: value.title,
        description: value.description || '',
        isEnabled: value.isEnabled,
        feeAmount: Number(value.feeAmount ?? 0),
        estimatedDeliveryDaysMin: Number(value.estimatedDeliveryDaysMin ?? 0),
        estimatedDeliveryDaysMax: Number(value.estimatedDeliveryDaysMax ?? 0),
        displayOrder: Number(value.displayOrder ?? 0),
      }
    : createInitialForm()

  Object.assign(form, next)
}

watch(
  () => [props.open, props.modelValue],
  () => {
    if (props.open) syncForm(props.modelValue)
  },
  { immediate: true },
)

const validation = computed(() => {
  const errors: Record<string, string> = {
    code: '',
    title: '',
    feeAmount: '',
    estimatedDeliveryDaysMin: '',
    estimatedDeliveryDaysMax: '',
    displayOrder: '',
  }

  if (!form.code.trim()) errors.code = 'code الزامی است'
  if (!form.title.trim()) errors.title = 'عنوان الزامی است'
  if (Number(form.feeAmount) < 0) errors.feeAmount = 'هزینه نمی‌تواند منفی باشد'
  if (Number(form.estimatedDeliveryDaysMin) < 0) errors.estimatedDeliveryDaysMin = 'حداقل روز نمی‌تواند منفی باشد'
  if (Number(form.estimatedDeliveryDaysMax) < 0) errors.estimatedDeliveryDaysMax = 'حداکثر روز نمی‌تواند منفی باشد'
  if (Number(form.estimatedDeliveryDaysMin) > Number(form.estimatedDeliveryDaysMax)) {
    errors.estimatedDeliveryDaysMax = 'حداکثر روز باید بزرگ‌تر یا مساوی حداقل روز باشد'
  }
  if (Number(form.displayOrder) < 0) errors.displayOrder = 'ترتیب نمایش نمی‌تواند منفی باشد'

  return errors
})

const hasValidationError = computed(() => Object.values(validation.value).some(Boolean))

const handleSubmit = () => {
  if (hasValidationError.value) return

  emit('submit', {
    code: form.code.trim(),
    title: form.title.trim(),
    description: form.description?.trim() || null,
    isEnabled: Boolean(form.isEnabled),
    feeAmount: Number(form.feeAmount || 0),
    estimatedDeliveryDaysMin: Number(form.estimatedDeliveryDaysMin || 0),
    estimatedDeliveryDaysMax: Number(form.estimatedDeliveryDaysMax || 0),
    displayOrder: Number(form.displayOrder || 0),
  })
}
</script>

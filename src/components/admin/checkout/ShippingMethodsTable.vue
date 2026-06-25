<template>
  <div class="panel p-0">
    <div class="border-b border-white-light px-5 py-4 dark:border-[#1b2e4b]">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-black dark:text-white">لیست روش‌های ارسال</h2>
          <p class="mt-1 text-sm text-white-dark">روش‌های فعال در checkout summary از همین لیست تغذیه می‌شوند.</p>
        </div>
        <div class="text-sm text-white-dark">مجموع: {{ items.length }} روش ارسال</div>
      </div>
    </div>

    <div v-if="isLoading" class="p-5">
      <div class="space-y-3">
        <div v-for="index in 5" :key="index" class="h-14 animate-pulse rounded-2xl bg-white-light/70 dark:bg-[#0e1726]"></div>
      </div>
    </div>

    <div v-else-if="errorMessage" class="p-5">
      <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
    </div>

    <div v-else-if="items.length === 0" class="p-5">
      <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
        هنوز هیچ روش ارسالی ثبت نشده است.
      </div>
    </div>

    <div v-else class="table-responsive">
      <table class="table-hover">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>code</th>
            <th>وضعیت</th>
            <th>هزینه</th>
            <th>بازه زمان تحویل</th>
            <th>ترتیب نمایش</th>
            <th>تاریخ بروزرسانی</th>
            <th class="text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="min-w-[220px]">
              <div class="font-semibold text-black dark:text-white">{{ item.title }}</div>
              <div class="mt-1 text-xs text-white-dark">{{ item.description || 'بدون توضیح' }}</div>
            </td>
            <td dir="ltr" class="text-left">{{ item.code }}</td>
            <td>
              <span class="badge" :class="item.isEnabled ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'">
                {{ item.isEnabled ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td>{{ formatNumber(item.feeAmount) }}</td>
            <td>{{ item.estimatedDeliveryDaysMin }} تا {{ item.estimatedDeliveryDaysMax }} روز</td>
            <td>{{ item.displayOrder }}</td>
            <td>{{ formatDateTime(item.updatedAt) }}</td>
            <td>
              <div class="flex items-center justify-center gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="$emit('edit', item)">ویرایش</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="busyIds.includes(item.id)" @click="$emit('toggle-status', item)">
                  {{ item.isEnabled ? 'غیرفعال‌سازی' : 'فعال‌سازی' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingMethod } from '@/types/checkout'
import { formatDateTime } from '@/utils/product'

defineProps<{
  items: ShippingMethod[]
  isLoading: boolean
  errorMessage: string
  busyIds: string[]
}>()

defineEmits<{
  edit: [item: ShippingMethod]
  'toggle-status': [item: ShippingMethod]
}>()

const formatNumber = (value: number) =>
  new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
</script>

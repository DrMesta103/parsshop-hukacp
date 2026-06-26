<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">لیست علاقه‌مندی‌ها</h1>
        <p class="mt-1 text-white-dark">مشاهده محصولات محبوب که توسط کاربران بیشتر لایک شده‌اند (به ترتیب محبوبیت)</p>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">آمار علاقه‌مندی‌ها</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="stats.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          هنوز هیچ محصولی توسط کاربران لایک نشده است.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th class="w-16">رتبه</th>
              <th>محصول</th>
              <th>SKU</th>
              <th class="text-center">تعداد لایک (علاقه‌مندی)</th>
              <th class="text-center">لینک محصول</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stat, index) in stats" :key="stat.productId">
              <td class="font-bold text-center">
                <span v-if="index === 0" class="text-warning text-xl">🥇</span>
                <span v-else-if="index === 1" class="text-gray-400 text-xl">🥈</span>
                <span v-else-if="index === 2" class="text-amber-700 text-xl">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <img
                    :src="stat.mainImageUrl || fallbackProductImage"
                    alt="product"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <div class="font-semibold text-black dark:text-white">
                    {{ stat.title }}
                  </div>
                </div>
              </td>
              <td class="text-left ltr" dir="ltr">{{ stat.sku || '-' }}</td>
              <td class="text-center">
                <span class="badge bg-danger/20 text-danger rounded-full px-3 py-1 text-base">
                  ❤️ {{ stat.count }}
                </span>
              </td>
              <td class="text-center">
                <router-link :to="`/admin/products/${stat.productId}`" class="btn btn-outline-primary btn-sm">مشاهده</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'لیست علاقه‌مندی‌ها' });

const fallbackProductImage = '/assets/images/product-headphones.jpg';
const stats = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchStats = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any[]>('/admin/customers/wishlists/stats');
    stats.value = res || [];
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت آمار علاقه‌مندی‌ها';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>

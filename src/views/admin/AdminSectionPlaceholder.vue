<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-2 text-3xl font-bold text-black dark:text-white">{{ title }}</h1>
      <p class="text-white-dark">{{ description }}</p>
    </div>

    <div class="panel">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-black dark:text-white">این بخش آماده توسعه است</h2>
          <p class="mt-1 text-sm text-white-dark">منو و مسیر برای این قسمت اضافه شده تا بتوانید مرحله بعد صفحه و API آن را پیاده سازی کنید.</p>
        </div>
        <span class="badge bg-primary/10 px-3 py-1 text-primary">{{ route.path }}</span>
      </div>

      <div class="rounded-xl border border-white-light p-4 dark:border-[#1b2e4b]">
        <p class="text-sm leading-7 text-white-dark">
          عنوان این صفحه از `meta` مسیر خوانده می شود. هر زمان برای این بخش ویوی اختصاصی ساختید، کافی است route را به کامپوننت واقعی وصل کنید.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => String(route.meta.title || 'بخش مدیریت'))
const description = computed(() => String(route.meta.description || 'مدیریت این قسمت از فروشگاه اینترنتی'))
</script>

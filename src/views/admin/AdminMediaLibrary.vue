<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">کتابخانه رسانه</h1>
        <p class="mt-1 text-white-dark">مدیریت فایل‌های پنل ادمین، جستجو، فیلتر، آپلود، ویرایش و حذف رسانه‌ها</p>
      </div>
    </div>

    <MediaLibraryBrowser />
  </div>
</template>

<script setup lang="ts">
import MediaLibraryBrowser from '@/components/admin/media/MediaLibraryBrowser.vue'
import { useMeta } from '@/composables/use-meta'

useMeta({ title: 'کتابخانه رسانه' })
</script>

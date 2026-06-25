<template>
  <div class="space-y-4">
    <nav class="flex flex-wrap items-center gap-2 text-sm text-white-dark">
      <router-link to="/admin/dashboard" class="transition hover:text-primary">داشبورد</router-link>
      <span>/</span>
      <router-link to="/admin/settings" class="transition hover:text-primary">تنظیمات</router-link>
      <span>/</span>
      <span class="text-black dark:text-white">{{ section }}</span>
    </nav>

    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="max-w-3xl">
        <div class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Checkout Management</div>
        <h1 class="mt-3 text-3xl font-bold text-black dark:text-white">{{ title }}</h1>
        <p class="mt-2 text-white-dark">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap gap-3">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  section: string
  description: string
}>()
</script>

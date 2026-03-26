<template>
  <section class="panel rounded-2xl border border-white-light/70 bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#0e1726]">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-start gap-4">
        <div v-if="$slots.icon" class="grid h-11 w-11 shrink-0 place-content-center rounded-2xl border border-white-light bg-white-light/40 text-black dark:border-[#1b2e4b] dark:bg-[#060818] dark:text-white">
          <slot name="icon" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-black dark:text-white">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm leading-6 text-white-dark">{{ description }}</p>
        </div>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

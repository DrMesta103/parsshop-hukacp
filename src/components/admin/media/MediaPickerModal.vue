<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
    <div class="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 class="text-xl font-semibold text-black dark:text-white">{{ title }}</h3>
          <p v-if="description" class="mt-1 text-sm text-white-dark">{{ description }}</p>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="$emit('close')">بستن</button>
      </div>

      <MediaLibraryBrowser
        :selectable="true"
        :multiple="multiple"
        :initial-section="initialSection"
        :allowed-sections="allowedSections"
        :selected-urls="selectedUrls"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaLibraryBrowser from '@/components/admin/media/MediaLibraryBrowser.vue'
import type { MediaItem, MediaSection } from '@/types/media'

defineProps<{
  open: boolean
  title: string
  description?: string
  multiple?: boolean
  initialSection?: MediaSection | ''
  allowedSections?: MediaSection[]
  selectedUrls?: string[]
}>()

defineEmits<{
  (event: 'close'): void
  (event: 'select', items: MediaItem[]): void
}>()
</script>

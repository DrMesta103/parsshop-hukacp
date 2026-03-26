<template>
  <div class="flex items-center gap-1">
    <span
      v-for="index in 5"
      :key="index"
      class="text-sm"
      :class="index <= roundedRating ? 'text-warning' : 'text-[#cbd5e1]'"
    >
      ★
    </span>
    <span v-if="showLabel" class="text-xs text-white-dark">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rating?: number
    showLabel?: boolean
    label?: string
  }>(),
  {
    rating: 0,
    showLabel: false,
    label: '',
  },
)

const roundedRating = computed(() => Math.round(props.rating || 0))
</script>

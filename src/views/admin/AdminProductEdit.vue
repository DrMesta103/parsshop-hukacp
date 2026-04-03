<template>
  <AdminProductCreateForm mode="edit" :product-id="String(route.params.id || '')" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdminProductCreateForm from '@/components/admin/products/AdminProductCreateForm.vue'
import { useMeta } from '@/composables/use-meta'

const route = useRoute()

useMeta({ title: 'ویرایش محصول' })
</script>

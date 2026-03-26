<template>
  <AdminProductCreateForm />
</template>

<script setup lang="ts">
import AdminProductCreateForm from '@/components/admin/products/AdminProductCreateForm.vue'
import { useMeta } from '@/composables/use-meta'

useMeta({ title: 'ایجاد محصول' })
</script>

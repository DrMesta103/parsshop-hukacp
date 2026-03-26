<template>
  <ProductForm mode="edit" :product-id="String(route.params.id)" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProductForm from '@/components/admin/products/ProductForm.vue'
import { useMeta } from '@/composables/use-meta'

const route = useRoute()

useMeta({ title: 'ویرایش محصول' })
</script>

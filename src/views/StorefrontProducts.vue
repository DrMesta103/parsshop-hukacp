<template>
  <div class="space-y-6">
    <div class="panel overflow-hidden !rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#0ea5e9] text-white">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h1 class="text-3xl font-bold leading-tight sm:text-4xl">کاتالوگ محصولات فروشگاه</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            لیست محصولات منتشرشده به صورت مستقیم از API عمومی خوانده می شود و فیلترها، دسته بندی و جزئیات رسانه ها آماده استفاده هستند.
          </p>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-2xl bg-white/10 p-4">
            <div class="text-sm text-white/70">محصولات</div>
            <div class="mt-2 text-2xl font-bold">{{ pagination.total }}</div>
          </div>
          <div class="rounded-2xl bg-white/10 p-4">
            <div class="text-sm text-white/70">صفحه</div>
            <div class="mt-2 text-2xl font-bold">{{ pagination.page }}</div>
          </div>
          <div class="rounded-2xl bg-white/10 p-4">
            <div class="text-sm text-white/70">دسته بندی</div>
            <div class="mt-2 text-2xl font-bold">{{ categories.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside class="space-y-6">
        <div class="panel">
          <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">فیلتر محصولات</h2>
          <div class="space-y-4">
            <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجو در عنوان یا برند" @keyup.enter="applyFilters" />
            <select v-model="filters.type" class="form-select" @change="applyFilters">
              <option value="">همه نوع ها</option>
              <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
            <select v-model="filters.categoryId" class="form-select" @change="applyFilters">
              <option value="">همه دسته بندی ها</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <input v-model.trim="filters.brand" type="text" class="form-input" placeholder="برند" @keyup.enter="applyFilters" />
            <select v-model="featuredFilter" class="form-select" @change="applyFilters">
              <option value="">همه</option>
              <option value="true">فقط ویژه</option>
              <option value="false">فقط عادی</option>
            </select>
            <div class="flex gap-3">
              <button type="button" class="btn btn-primary flex-1" @click="applyFilters">اعمال</button>
              <button type="button" class="btn btn-outline-secondary" @click="resetFilters">پاکسازی</button>
            </div>
          </div>
        </div>
      </aside>

      <section class="space-y-6">
        <div v-if="isLoading" class="panel">
          <div class="grid min-h-[360px] place-content-center">
            <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
          </div>
        </div>

        <div v-else-if="errorMessage" class="panel">
          <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
        </div>

        <div v-else-if="products.length === 0" class="panel">
          <div class="rounded-md border border-dashed border-white-light px-4 py-16 text-center text-white-dark dark:border-[#1b2e4b]">
            محصولی با این فیلترها پیدا نشد.
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <router-link
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="panel block overflow-hidden !p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img :src="product.mainImageUrl || fallbackProductImage" alt="product" class="h-56 w-full object-cover" />
            <div class="space-y-4 p-5">
              <div class="flex items-center gap-2">
                <span v-if="product.category?.name" class="badge bg-primary/15 text-primary">{{ product.category.name }}</span>
                <span v-if="product.featured" class="badge bg-warning/15 text-warning">ویژه</span>
              </div>
              <div>
                <h3 class="line-clamp-2 text-lg font-semibold text-black dark:text-white">{{ product.title }}</h3>
                <p v-if="product.summary" class="mt-2 line-clamp-2 text-sm leading-7 text-white-dark" v-html="product.summary"></p>
                <p v-else class="mt-2 line-clamp-2 text-sm leading-7 text-white-dark">بدون خلاصه</p>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-white-dark">{{ getProductBrandName(product) }}</div>
                  <div class="mt-1 text-xl font-bold text-primary">{{ formatCurrency(product.salePriceUSD ?? product.basePriceUSD) }}</div>
                </div>
                <StarRating :rating="product.averageRating" :show-label="true" :label="`${product.reviewsCount} نظر`" />
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="pagination.totalPages > 1" class="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-white-dark">صفحه {{ pagination.page }} از {{ pagination.totalPages }}</p>
          <div class="flex items-center gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page <= 1 || isLoading" @click="changePage(pagination.page - 1)">
              قبلی
            </button>
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page >= pagination.totalPages || isLoading" @click="changePage(pagination.page + 1)">
              بعدی
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import StarRating from '@/components/products/StarRating.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import categoryService from '@/services/category-service'
import productService from '@/services/product-service'
import type { Category, ProductListItem } from '@/types/product'
import { formatCurrency, getProductBrandName, productTypeOptions } from '@/utils/product'

useMeta({ title: 'محصولات فروشگاه' })

const fallbackProductImage = '/assets/images/product-laptop.jpg'
const categories = ref<Category[]>([])
const products = ref<ProductListItem[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
})

const filters = reactive({
  search: '',
  type: '' as '' | 'Industrial' | 'Automotive',
  categoryId: '',
  brand: '',
  featured: null as boolean | null,
  page: 1,
  limit: 9,
})

const featuredFilter = computed({
  get: () => (filters.featured === null ? '' : String(filters.featured)),
  set: (value: string) => {
    filters.featured = value === '' ? null : value === 'true'
  },
})

const loadCategories = async () => {
  categories.value = await categoryService.getCategories()
}

const loadProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await productService.getPublicProducts(filters)
    products.value = response.items
    Object.assign(pagination, response.meta)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری محصولات فروشگاه انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const applyFilters = async () => {
  filters.page = 1
  await loadProducts()
}

const resetFilters = async () => {
  filters.search = ''
  filters.type = ''
  filters.categoryId = ''
  filters.brand = ''
  filters.featured = null
  filters.page = 1
  await loadProducts()
}

const changePage = async (page: number) => {
  filters.page = page
  await loadProducts()
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()])
})
</script>

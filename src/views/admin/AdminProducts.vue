<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">مدیریت محصولات</h1>
        <p class="mt-1 text-white-dark">اتصال مستقیم به API ادمین با فیلتر، صفحه بندی و اکشن های CRUD</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <router-link to="/products" class="btn btn-outline-secondary">مشاهده استور</router-link>
        <router-link to="/admin/products/reviews" class="btn btn-outline-warning">مدیریت نظرات</router-link>
        <router-link to="/admin/products/create" class="btn btn-primary">افزودن محصول</router-link>
      </div>
    </div>

    <div class="panel">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-black dark:text-white">فیلترها</h2>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجو در عنوان، اسلاگ، برند..." @keyup.enter="applyFilters" />
        <select v-model="filters.type" class="form-select" @change="applyFilters">
          <option value="">همه نوع ها</option>
          <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <select v-model="filters.status" class="form-select" @change="applyFilters">
          <option value="">همه وضعیت ها</option>
          <option v-for="item in productStatusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <select v-model="filters.categoryId" class="form-select" @change="applyFilters">
          <option value="">همه دسته بندی ها</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <input v-model.trim="filters.brand" type="text" class="form-input" placeholder="برند" @keyup.enter="applyFilters" />
        <select v-model="featuredFilter" class="form-select" @change="applyFilters">
          <option value="">همه</option>
          <option value="true">ویژه</option>
          <option value="false">عادی</option>
        </select>
      </div>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary btn-sm" @click="applyFilters">اعمال فیلتر</button>
        <div class="rounded-md bg-white-light/30 px-3 py-2 text-sm text-white-dark dark:bg-[#060818]">
          مجموع محصولات: <span class="font-semibold text-black dark:text-white">{{ pagination.total }}</span>
        </div>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست محصولات</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="products.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          محصولی با فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>محصول</th>
              <th>SKU</th>
              <th>برند</th>
              <th>موجودی</th>
              <th>وضعیت</th>
              <th>امتیاز</th>
              <th>قیمت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="min-w-[280px]">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.mainImageUrl || fallbackProductImage"
                    alt="product"
                    class="h-14 w-14 rounded-xl object-cover"
                  />
                  <div class="min-w-0">
                    <router-link :to="`/admin/products/${product.id}`" class="block truncate font-semibold text-black hover:text-primary dark:text-white">
                      {{ product.title }}
                    </router-link>
                    <div class="mt-1 flex flex-wrap items-center gap-2">
                      <span class="badge bg-info/15 text-info">{{ product.type }}</span>
                      <span v-if="product.featured" class="badge bg-warning/15 text-warning">ویژه</span>
                      <span class="text-xs text-white-dark">{{ product.primaryCategory?.name || product.category?.name || 'بدون دسته بندی' }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ product.sku }}</td>
              <td>{{ getProductBrandName(product) }}</td>
              <td>
                <span class="badge rounded-full px-3 py-1 hover:top-0" :class="getStockBadgeClass(product.stock)">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span class="badge rounded-full px-3 py-1 hover:top-0" :class="getStatusBadgeClass(product.status)">
                  {{ statusLabelMap[product.status] }}
                </span>
              </td>
              <td>
                <StarRating :rating="product.averageRating" :show-label="true" :label="`${product.reviewsCount} نظر`" />
              </td>
              <td>
                <div class="space-y-1">
                  <div class="font-semibold text-black dark:text-white">{{ formatCurrency(product.salePriceUSD ?? product.basePriceUSD) }}</div>
                  <div v-if="product.salePriceUSD" class="text-xs text-white-dark line-through">{{ formatCurrency(product.basePriceUSD) }}</div>
                </div>
              </td>
              <td>
                <div class="flex items-center justify-center gap-2">
                  <router-link :to="`/admin/products/${product.id}`" class="btn btn-outline-info btn-sm">جزئیات</router-link>
                  <router-link :to="`/admin/products/${product.id}/edit`" class="btn btn-outline-primary btn-sm">ویرایش</router-link>
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="confirmDelete(product.id)">حذف</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex flex-col gap-3 border-t border-white-light px-5 py-4 dark:border-[#1b2e4b] sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white-dark">
          صفحه {{ pagination.page }} از {{ pagination.totalPages }}
        </p>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page <= 1 || isLoading" @click="changePage(pagination.page - 1)">
            قبلی
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page >= pagination.totalPages || isLoading" @click="changePage(pagination.page + 1)">
            بعدی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import StarRating from '@/components/products/StarRating.vue'
import { useMeta } from '@/composables/use-meta'
import categoryService from '@/services/category-service'
import { extractApiErrorMessage } from '@/services/admin-api'
import productService from '@/services/product-service'
import type { Category, ProductListItem } from '@/types/product'
import {
  formatCurrency,
  getProductBrandName,
  getStatusBadgeClass,
  getStockBadgeClass,
  productStatusOptions,
  productTypeOptions,
} from '@/utils/product'

useMeta({ title: 'مدیریت محصولات' })

const fallbackProductImage = '/assets/images/product-headphones.jpg'

const filters = reactive({
  search: '',
  type: '' as '' | 'Industrial' | 'Automotive',
  status: '' as '' | 'draft' | 'published' | 'archived',
  categoryId: '',
  brand: '',
  featured: null as boolean | null,
  page: 1,
  limit: 10,
})

const statusLabelMap = {
  draft: 'پیش نویس',
  published: 'منتشر شده',
  archived: 'آرشیو شده',
}

const featuredFilter = computed({
  get: () => (filters.featured === null ? '' : String(filters.featured)),
  set: (value: string) => {
    filters.featured = value === '' ? null : value === 'true'
  },
})

const categories = ref<Category[]>([])
const products = ref<ProductListItem[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
})

const loadCategories = async () => {
  categories.value = await categoryService.getCategories()
}

const loadProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await productService.getAdminProducts(filters)
    products.value = result.items
    Object.assign(pagination, result.meta)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری لیست محصولات انجام نشد')
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
  filters.status = ''
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

const confirmDelete = async (productId: string) => {
  const result = await Swal.fire({
    title: 'حذف محصول',
    text: 'این عملیات قابل بازگشت نیست. آیا ادامه می دهید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف شود',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })

  if (!result.isConfirmed) return

  try {
    await productService.deleteAdminProduct(productId)
    await Swal.fire({
      title: 'حذف شد',
      text: 'محصول با موفقیت حذف شد',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
    })

    if (products.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }

    await loadProducts()
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'حذف محصول انجام نشد'),
      icon: 'error',
    })
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()])
})
</script>

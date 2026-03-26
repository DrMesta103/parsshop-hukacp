<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">مدیریت نظرات محصولات</h1>
        <p class="mt-1 text-white-dark">تایید، سنجاق و حذف نظرات با refresh state و فیلتر سمت سرور</p>
      </div>
      <router-link to="/admin/products" class="btn btn-outline-secondary">بازگشت به محصولات</router-link>
    </div>

    <div class="panel">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <select v-model="filters.productId" class="form-select" @change="applyFilters">
          <option value="">همه محصولات</option>
          <option v-for="product in productOptions" :key="product.id" :value="product.id">{{ product.title }}</option>
        </select>
        <select v-model="approvedFilter" class="form-select" @change="applyFilters">
          <option value="">همه وضعیت های تایید</option>
          <option value="true">تایید شده</option>
          <option value="false">در انتظار تایید</option>
        </select>
        <select v-model="pinnedFilter" class="form-select" @change="applyFilters">
          <option value="">همه وضعیت های سنجاق</option>
          <option value="true">سنجاق شده</option>
          <option value="false">سنجاق نشده</option>
        </select>
        <button type="button" class="btn btn-outline-secondary" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
    </div>

    <div class="panel p-0">
      <div v-if="isLoading" class="grid min-h-[280px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="reviews.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          نظری برای نمایش وجود ندارد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover">
          <thead>
            <tr>
              <th>محصول</th>
              <th>کاربر</th>
              <th>امتیاز</th>
              <th>عنوان</th>
              <th>متن</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in reviews" :key="review.id">
              <td>
                <router-link :to="`/admin/products/${review.product?.id}`" class="font-semibold text-black hover:text-primary dark:text-white">
                  {{ review.product?.title || '-' }}
                </router-link>
              </td>
              <td>
                <div class="space-y-1">
                  <div class="font-semibold text-black dark:text-white">{{ review.name }}</div>
                  <div class="text-xs text-white-dark">{{ review.email || 'بدون ایمیل' }}</div>
                </div>
              </td>
              <td>
                <StarRating :rating="review.rating" />
              </td>
              <td>{{ review.title || 'بدون عنوان' }}</td>
              <td class="max-w-[320px]">
                <p class="line-clamp-3 leading-7 text-white-dark">{{ review.comment }}</p>
              </td>
              <td>
                <div class="flex flex-col gap-2">
                  <span class="badge rounded-full px-3 py-1 hover:top-0" :class="review.isApproved ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'">
                    {{ review.isApproved ? 'تایید شده' : 'در انتظار تایید' }}
                  </span>
                  <span class="badge rounded-full px-3 py-1 hover:top-0" :class="review.isPinned ? 'bg-info/20 text-info' : 'bg-dark/20 text-dark dark:text-white-dark'">
                    {{ review.isPinned ? 'سنجاق شده' : 'عادی' }}
                  </span>
                </div>
              </td>
              <td>{{ formatDateTime(review.createdAt) }}</td>
              <td>
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-success btn-sm"
                    :disabled="busyReviewId === review.id"
                    @click="toggleApproval(review)"
                  >
                    {{ review.isApproved ? 'لغو تایید' : 'تایید' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-info btn-sm"
                    :disabled="busyReviewId === review.id"
                    @click="togglePinned(review)"
                  >
                    {{ review.isPinned ? 'لغو سنجاق' : 'سنجاق' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    :disabled="busyReviewId === review.id"
                    @click="deleteReview(review.id)"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex flex-col gap-3 border-t border-white-light px-5 py-4 dark:border-[#1b2e4b] sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import StarRating from '@/components/products/StarRating.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import productService from '@/services/product-service'
import type { ProductListItem, ProductReview } from '@/types/product'
import { formatDateTime } from '@/utils/product'

useMeta({ title: 'مدیریت نظرات محصولات' })

const route = useRoute()

const filters = reactive({
  productId: typeof route.query.productId === 'string' ? route.query.productId : '',
  isApproved: null as boolean | null,
  isPinned: null as boolean | null,
  page: 1,
  limit: 10,
})

const approvedFilter = computed({
  get: () => (filters.isApproved === null ? '' : String(filters.isApproved)),
  set: (value: string) => {
    filters.isApproved = value === '' ? null : value === 'true'
  },
})

const pinnedFilter = computed({
  get: () => (filters.isPinned === null ? '' : String(filters.isPinned)),
  set: (value: string) => {
    filters.isPinned = value === '' ? null : value === 'true'
  },
})

const productOptions = ref<ProductListItem[]>([])
const reviews = ref<ProductReview[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const busyReviewId = ref('')
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
})

const loadProducts = async () => {
  const response = await productService.getAdminProducts({ page: 1, limit: 100 })
  productOptions.value = response.items
}

const loadReviews = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await productService.getAdminProductReviews(filters)
    reviews.value = response.items
    Object.assign(pagination, response.meta)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری نظرات انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const applyFilters = async () => {
  filters.page = 1
  await loadReviews()
}

const changePage = async (page: number) => {
  filters.page = page
  await loadReviews()
}

const resetFilters = async () => {
  filters.productId = ''
  filters.isApproved = null
  filters.isPinned = null
  filters.page = 1
  await loadReviews()
}

const patchReview = async (reviewId: string, payload: { isApproved?: boolean; isPinned?: boolean }) => {
  busyReviewId.value = reviewId
  try {
    const updated = await productService.updateAdminReview(reviewId, payload)
    const index = reviews.value.findIndex((review) => review.id === reviewId)
    if (index >= 0) {
      reviews.value[index] = { ...reviews.value[index], ...updated }
    }
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'بروزرسانی نظر انجام نشد'),
      icon: 'error',
    })
  } finally {
    busyReviewId.value = ''
  }
}

const toggleApproval = async (review: ProductReview) => {
  await patchReview(review.id, { isApproved: !review.isApproved })
}

const togglePinned = async (review: ProductReview) => {
  await patchReview(review.id, { isPinned: !review.isPinned })
}

const deleteReview = async (reviewId: string) => {
  const result = await Swal.fire({
    title: 'حذف نظر',
    text: 'این نظر به صورت کامل حذف می شود.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })

  if (!result.isConfirmed) return

  busyReviewId.value = reviewId
  try {
    await productService.deleteAdminReview(reviewId)
    reviews.value = reviews.value.filter((review) => review.id !== reviewId)
    await Swal.fire({
      title: 'حذف شد',
      text: 'نظر با موفقیت حذف شد',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    await loadReviews()
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'حذف نظر انجام نشد'),
      icon: 'error',
    })
  } finally {
    busyReviewId.value = ''
  }
}

onMounted(async () => {
  await Promise.all([loadProducts(), loadReviews()])
})
</script>

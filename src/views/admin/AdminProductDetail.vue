<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">جزئیات محصول</h1>
        <p class="mt-1 text-white-dark">نمایش اطلاعات کامل، گالری، مدل سه بعدی و خلاصه نظرات</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <router-link to="/admin/products" class="btn btn-outline-secondary">بازگشت</router-link>
        <router-link :to="`/admin/products/${route.params.id}/edit`" class="btn btn-primary">ویرایش محصول</router-link>
        <router-link :to="`/admin/products/reviews?productId=${route.params.id}`" class="btn btn-outline-warning">مدیریت نظرات</router-link>
      </div>
    </div>

    <div v-if="isLoading" class="panel">
      <div class="grid min-h-[280px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>
    </div>

    <div v-else-if="errorMessage" class="panel">
      <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
    </div>

    <template v-else-if="product">
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <div class="panel overflow-hidden !p-0">
            <img :src="selectedImage" alt="product" class="h-[360px] w-full object-cover" />
            <div v-if="galleryImages.length > 1" class="grid grid-cols-4 gap-3 p-5">
              <button
                v-for="image in galleryImages"
                :key="image"
                type="button"
                class="overflow-hidden rounded-xl border"
                :class="selectedImage === image ? 'border-primary' : 'border-white-light dark:border-[#1b2e4b]'"
                @click="selectedImage = image"
              >
                <img :src="image" alt="gallery" class="h-20 w-full object-cover" />
              </button>
            </div>
          </div>

          <div class="panel">
            <div class="mb-4 flex flex-wrap items-center gap-3">
              <span class="badge rounded-full px-3 py-1 hover:top-0" :class="getStatusBadgeClass(product.status)">{{ statusLabelMap[product.status] }}</span>
              <span class="badge bg-info/20 px-3 py-1 text-info hover:top-0">{{ product.type }}</span>
              <span v-if="product.featured" class="badge bg-warning/20 px-3 py-1 text-warning hover:top-0">ویژه</span>
              <StarRating :rating="product.averageRating" :show-label="true" :label="`${product.reviewsCount} نظر`" />
            </div>
            <h2 class="text-2xl font-bold text-black dark:text-white">{{ product.title }}</h2>
            <div v-if="product.summary" class="mt-3 leading-8 text-white-dark" v-html="product.summary"></div>
            <p v-else class="mt-3 leading-8 text-white-dark">خلاصه ای برای این محصول ثبت نشده است.</p>
            <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-xl bg-white-light/30 p-4 dark:bg-[#060818]">
                <div class="text-sm text-white-dark">قیمت پایه</div>
                <div class="mt-1 text-xl font-bold text-black dark:text-white">{{ formatCurrency(product.basePriceUSD) }}</div>
              </div>
              <div class="rounded-xl bg-white-light/30 p-4 dark:bg-[#060818]">
                <div class="text-sm text-white-dark">قیمت فروش</div>
                <div class="mt-1 text-xl font-bold text-primary">{{ formatCurrency(product.salePriceUSD ?? product.basePriceUSD) }}</div>
              </div>
            </div>
            <div class="mt-5">
              <h3 class="mb-3 text-lg font-semibold text-black dark:text-white">توضیحات کامل</h3>
              <div v-if="product.description" class="leading-8 text-white-dark" v-html="product.description"></div>
              <p v-else class="leading-8 text-white-dark">توضیحات کامل ثبت نشده است.</p>
            </div>
          </div>

          <div class="panel">
            <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">مشخصات فنی</h3>
            <div v-if="attributeEntries.length" class="table-responsive">
              <table class="table-striped">
                <tbody>
                  <tr v-for="[key, value] in attributeEntries" :key="key">
                    <td class="w-[220px] font-semibold">{{ key }}</td>
                    <td>{{ String(value) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="rounded-md border border-dashed border-white-light px-4 py-6 text-sm text-white-dark dark:border-[#1b2e4b]">
              مشخصات فنی ثبت نشده است.
            </div>
          </div>

          <div class="panel">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-black dark:text-white">خلاصه نظرات</h3>
              <router-link :to="`/admin/products/reviews?productId=${product.id}`" class="btn btn-outline-primary btn-sm">مدیریت همه</router-link>
            </div>
            <div v-if="reviewsLoading" class="grid min-h-[120px] place-content-center">
              <span class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
            </div>
            <div v-else-if="reviews.length === 0" class="rounded-md border border-dashed border-white-light px-4 py-6 text-sm text-white-dark dark:border-[#1b2e4b]">
              هنوز نظری برای این محصول ثبت نشده است.
            </div>
            <div v-else class="space-y-4">
              <div v-for="review in reviews.slice(0, 5)" :key="review.id" class="rounded-xl border border-white-light p-4 dark:border-[#1b2e4b]">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div class="font-semibold text-black dark:text-white">{{ review.title || 'بدون عنوان' }}</div>
                    <div class="text-sm text-white-dark">{{ review.name }} · {{ formatDateTime(review.createdAt) }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <StarRating :rating="review.rating" />
                    <span v-if="review.isPinned" class="badge bg-warning/20 text-warning">سنجاق شده</span>
                    <span class="badge" :class="review.isApproved ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'">
                      {{ review.isApproved ? 'تایید شده' : 'در انتظار تایید' }}
                    </span>
                  </div>
                </div>
                <p class="mt-3 leading-7 text-white-dark">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="panel">
            <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">اطلاعات سریع</h3>
            <div class="space-y-4 text-sm">
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">SKU</span>
                <span class="font-semibold text-black dark:text-white">{{ product.sku }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">اسلاگ</span>
                <span class="font-semibold text-black dark:text-white">{{ product.slug }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">کد فنی</span>
                <span class="font-semibold text-black dark:text-white">{{ product.technicalCode }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">برند</span>
                <span class="font-semibold text-black dark:text-white">{{ getProductBrandName(product) }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">دسته بندی</span>
                <span class="font-semibold text-black dark:text-white">{{ product.category?.name || '-' }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">موجودی</span>
                <span class="badge rounded-full px-3 py-1 hover:top-0" :class="getStockBadgeClass(product.stock)">{{ product.stock }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">تاریخ ایجاد</span>
                <span class="font-semibold text-black dark:text-white">{{ formatDateTime(product.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-white-dark">آخرین بروزرسانی</span>
                <span class="font-semibold text-black dark:text-white">{{ formatDateTime(product.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="panel">
            <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">برچسب ها</h3>
            <div v-if="product.tags.length" class="flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag" class="badge bg-primary/15 px-3 py-1 text-primary">{{ tag }}</span>
            </div>
            <div v-else class="text-sm text-white-dark">برچسبی ثبت نشده است.</div>
          </div>

          <div class="panel">
            <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">مدل سه بعدی</h3>
            <div v-if="product.threeDModelUrl" class="space-y-3">
              <div class="rounded-xl border border-dashed border-white-light px-4 py-8 text-center text-white-dark dark:border-[#1b2e4b]">
                پیش نمایش سه بعدی در این نسخه پیاده نشده و لینک فایل آماده است.
              </div>
              <a :href="product.threeDModelUrl" target="_blank" class="btn btn-outline-primary w-full">دانلود / مشاهده فایل مدل</a>
            </div>
            <div v-else class="rounded-md border border-dashed border-white-light px-4 py-6 text-sm text-white-dark dark:border-[#1b2e4b]">
              مدل سه بعدی برای این محصول ثبت نشده است.
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StarRating from '@/components/products/StarRating.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import productService from '@/services/product-service'
import type { ProductListItem, ProductReview } from '@/types/product'
import { formatCurrency, formatDateTime, getProductBrandName, getStatusBadgeClass, getStockBadgeClass, normalizeAttributes } from '@/utils/product'

useMeta({ title: 'جزئیات محصول' })

const route = useRoute()
const product = ref<ProductListItem | null>(null)
const reviews = ref<ProductReview[]>([])
const selectedImage = ref('')
const isLoading = ref(false)
const reviewsLoading = ref(false)
const errorMessage = ref('')

const statusLabelMap = {
  draft: 'پیش نویس',
  published: 'منتشر شده',
  archived: 'آرشیو شده',
}

const galleryImages = computed(() => {
  const productValue = product.value
  if (!productValue) return []

  return [productValue.mainImageUrl, ...(productValue.imageGalleryUrls || [])].filter(Boolean) as string[]
})

const attributeEntries = computed(() => Object.entries(normalizeAttributes(product.value?.attributes)))

const loadProduct = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await productService.getAdminProduct(String(route.params.id))
    product.value = response
    selectedImage.value = response.mainImageUrl || response.imageGalleryUrls?.[0] || '/assets/images/product-headphones.jpg'
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری محصول انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const loadReviews = async () => {
  reviewsLoading.value = true
  try {
    const response = await productService.getAdminProductReviews({
      productId: String(route.params.id),
      page: 1,
      limit: 5,
    })
    reviews.value = response.items
  } catch {
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadProduct(), loadReviews()])
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <router-link to="/products" class="btn btn-outline-secondary btn-sm">بازگشت به لیست</router-link>
      <router-link v-if="product" :to="`/admin/products/${product.id}`" class="btn btn-outline-primary btn-sm">نسخه ادمین</router-link>
    </div>

    <div v-if="isLoading" class="panel">
      <div class="grid min-h-[360px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>
    </div>

    <div v-else-if="errorMessage" class="panel">
      <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
    </div>

    <template v-else-if="product">
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div class="space-y-6">
          <div class="panel overflow-hidden !p-0">
            <img :src="selectedImage" alt="product" class="h-[420px] w-full object-cover" />
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
            <h2 class="mb-4 text-lg font-semibold text-black dark:text-white">مشخصات فنی</h2>
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
            <h2 class="mb-4 text-lg font-semibold text-black dark:text-white">نظرات کاربران</h2>
            <div v-if="reviewsLoading" class="grid min-h-[120px] place-content-center">
              <span class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
            </div>
            <div v-else-if="reviews.length === 0" class="rounded-md border border-dashed border-white-light px-4 py-8 text-sm text-white-dark dark:border-[#1b2e4b]">
              هنوز نظر تاییدشده ای برای این محصول وجود ندارد.
            </div>
            <div v-else class="space-y-4">
              <div v-for="review in reviews" :key="review.id" class="rounded-xl border border-white-light p-4 dark:border-[#1b2e4b]">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-black dark:text-white">{{ review.title || 'بدون عنوان' }}</h3>
                      <span v-if="review.isPinned" class="badge bg-warning/20 text-warning">پیشنهادی</span>
                    </div>
                    <p class="mt-1 text-sm text-white-dark">{{ review.name }} · {{ formatDateTime(review.createdAt) }}</p>
                  </div>
                  <StarRating :rating="review.rating" />
                </div>
                <p class="mt-3 leading-8 text-white-dark">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="panel">
            <div class="mb-4 flex flex-wrap items-center gap-2">
              <span v-if="product.primaryCategory?.name" class="badge bg-primary/15 text-primary">{{ product.primaryCategory.name }}</span>
              <span v-if="product.featured" class="badge bg-warning/15 text-warning">محصول ویژه</span>
              <span class="badge bg-info/15 text-info">{{ product.type }}</span>
            </div>
            <h1 class="text-3xl font-bold text-black dark:text-white">{{ product.title }}</h1>
            <p class="mt-2 text-white-dark">{{ getProductBrandName(product) }} · {{ product.technicalCode }}</p>
            <div class="mt-5 flex items-center gap-4">
              <div class="text-3xl font-bold text-primary">{{ formatCurrency(product.salePriceUSD ?? product.basePriceUSD) }}</div>
              <div v-if="product.salePriceUSD" class="text-sm text-white-dark line-through">{{ formatCurrency(product.basePriceUSD) }}</div>
            </div>
            <div class="mt-4">
              <StarRating :rating="product.averageRating" :show-label="true" :label="`${product.reviewsCount} نظر تاییدشده`" />
            </div>
            <div v-if="product.summary" class="mt-5 leading-8 text-white-dark" v-html="product.summary"></div>
            <p v-else class="mt-5 leading-8 text-white-dark">خلاصه ای برای این محصول ثبت نشده است.</p>
            <div class="mt-6 rounded-xl bg-white-light/30 p-4 dark:bg-[#060818]">
              <div class="flex items-center justify-between">
                <span class="text-white-dark">موجودی</span>
                <span class="badge rounded-full px-3 py-1" :class="getStockBadgeClass(product.stock)">
                  {{ product.stock > 0 ? `${product.stock} عدد` : 'ناموجود' }}
                </span>
              </div>
            </div>
            <div class="mt-6">
              <h2 class="mb-3 text-lg font-semibold text-black dark:text-white">توضیحات</h2>
              <div v-if="product.description" class="leading-8 text-white-dark" v-html="product.description"></div>
              <p v-else class="leading-8 text-white-dark">توضیحات کامل ثبت نشده است.</p>
            </div>
            <div v-if="product.tags.length" class="mt-6 flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag" class="badge bg-secondary/15 text-secondary">{{ tag }}</span>
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-4 text-lg font-semibold text-black dark:text-white">مدل سه بعدی</h2>
            <div v-if="product.threeDModelUrl" class="space-y-3">
              <div class="rounded-xl border border-dashed border-white-light px-4 py-8 text-center text-white-dark dark:border-[#1b2e4b]">
                در این مرحله لینک فایل 3D آماده است و می تواند به viewer اختصاصی متصل شود.
              </div>
              <a :href="product.threeDModelUrl" target="_blank" class="btn btn-outline-primary w-full">مشاهده فایل سه بعدی</a>
            </div>
            <div v-else class="rounded-md border border-dashed border-white-light px-4 py-6 text-sm text-white-dark dark:border-[#1b2e4b]">
              مدل سه بعدی برای این محصول وجود ندارد.
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">ثبت نظر</h2>
            <form class="space-y-4" @submit.prevent="submitReview">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input v-model.trim="reviewForm.name" type="text" class="form-input" placeholder="نام شما" />
                <input v-model.trim="reviewForm.email" type="email" class="form-input" placeholder="ایمیل" />
              </div>
              <input v-model.trim="reviewForm.title" type="text" class="form-input" placeholder="عنوان نظر" />
              <select v-model.number="reviewForm.rating" class="form-select">
                <option :value="5">5 ستاره</option>
                <option :value="4">4 ستاره</option>
                <option :value="3">3 ستاره</option>
                <option :value="2">2 ستاره</option>
                <option :value="1">1 ستاره</option>
              </select>
              <textarea v-model.trim="reviewForm.comment" rows="5" class="form-textarea" placeholder="تجربه خرید یا استفاده از محصول"></textarea>
              <div v-if="reviewError" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ reviewError }}</div>
              <div v-if="reviewSuccess" class="rounded-md border border-success bg-success/10 px-4 py-3 text-sm text-success">{{ reviewSuccess }}</div>
              <button type="submit" class="btn btn-primary w-full" :disabled="isSubmittingReview">
                {{ isSubmittingReview ? 'در حال ثبت...' : 'ارسال نظر' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import StarRating from '@/components/products/StarRating.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import productService from '@/services/product-service'
import type { PublicProductDetail, ProductReview } from '@/types/product'
import { formatCurrency, formatDateTime, getProductBrandName, getStockBadgeClass, normalizeAttributes } from '@/utils/product'

useMeta({ title: 'جزئیات محصول' })

const route = useRoute()
const product = ref<PublicProductDetail | null>(null)
const reviews = ref<ProductReview[]>([])
const selectedImage = ref('')
const isLoading = ref(false)
const reviewsLoading = ref(false)
const errorMessage = ref('')
const isSubmittingReview = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')
const reviewForm = reactive({
  name: '',
  email: '',
  rating: 5,
  title: '',
  comment: '',
})

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
    const response = await productService.getPublicProduct(String(route.params.id))
    product.value = response
    selectedImage.value = response.mainImageUrl || response.imageGalleryUrls?.[0] || '/assets/images/product-camera.jpg'
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری اطلاعات محصول انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const loadReviews = async () => {
  reviewsLoading.value = true
  try {
    reviews.value = await productService.getPublicProductReviews(String(route.params.id))
  } catch {
    reviews.value = product.value?.approvedReviews || []
  } finally {
    reviewsLoading.value = false
  }
}

const submitReview = async () => {
  reviewError.value = ''
  reviewSuccess.value = ''

  if (!reviewForm.name || !reviewForm.email || !reviewForm.comment) {
    reviewError.value = 'نام، ایمیل و متن نظر الزامی است'
    return
  }

  isSubmittingReview.value = true
  try {
    const response = await productService.submitProductReview(String(route.params.id), reviewForm)
    reviewSuccess.value = response.message
    reviewForm.name = ''
    reviewForm.email = ''
    reviewForm.rating = 5
    reviewForm.title = ''
    reviewForm.comment = ''
  } catch (error) {
    reviewError.value = extractApiErrorMessage(error, 'ارسال نظر انجام نشد')
  } finally {
    isSubmittingReview.value = false
  }
}

onMounted(async () => {
  await loadProduct()
  await loadReviews()
})
</script>

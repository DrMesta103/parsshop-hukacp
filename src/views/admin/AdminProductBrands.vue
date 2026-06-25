<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">مدیریت برندها</h1>
        <p class="mt-1 text-white-dark">لیست برندها، تصویر، نوع و اتصال آن‌ها به محصول را از این بخش مدیریت کنید.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary" @click="openCreateModal">ایجاد برند</button>
        <router-link to="/admin/products" class="btn btn-outline-secondary">بازگشت به محصولات</router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
      <div class="panel">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label for="brand-search">جستجو</label>
              <input id="brand-search" v-model.trim="filters.search" type="text" class="form-input" placeholder="نام، اسلاگ یا نوع..." />
            </div>
            <div>
              <label for="brand-type-filter">نوع</label>
              <select id="brand-type-filter" v-model="filters.type" class="form-select">
                <option value="">همه نوع‌ها</option>
                <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>
            <div>
              <label for="brand-page-size">تعداد در صفحه</label>
              <select id="brand-page-size" v-model.number="pageSize" class="form-select">
                <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }} ردیف</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلتر</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="loadBrands">بارگذاری مجدد</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">کل برندها</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ brands.length }}</div>
          </div>
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">پس از فیلتر</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ filteredBrands.length }}</div>
          </div>
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">نوع یکتا</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ uniqueTypesCount }}</div>
          </div>
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">صفحه</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ currentPage }} / {{ totalPages }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light px-5 py-4 dark:border-[#1b2e4b]">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-black dark:text-white">لیست برندها</h2>
            <p class="mt-1 text-sm text-white-dark">برای اتصال به محصول، همین برندها در select فرم محصول نمایش داده می‌شوند.</p>
          </div>
          <div class="text-sm text-white-dark">نمایش {{ pageStartIndex }} تا {{ pageEndIndex }} از {{ filteredBrands.length }} ردیف</div>
        </div>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="pageErrorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ pageErrorMessage }}</div>
      </div>

      <div v-else-if="paginatedBrands.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          برندی مطابق فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover">
          <thead>
            <tr>
              <th>برند</th>
              <th>تصویر</th>
              <th>اسلاگ</th>
              <th>نوع</th>
              <th>بروزرسانی</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in paginatedBrands" :key="brand.id">
              <td class="min-w-[240px]">
                <div class="font-semibold text-black dark:text-white">{{ brand.name }}</div>
                <div class="mt-1 text-xs text-white-dark">ID: {{ brand.id }}</div>
              </td>
              <td>
                <div class="h-12 w-12 overflow-hidden rounded-xl border border-white-light dark:border-[#1b2e4b]">
                  <img v-if="brand.imageUrl" :src="brand.imageUrl" alt="brand" class="h-full w-full object-cover" />
                  <div v-else class="grid h-full w-full place-content-center text-xs text-white-dark">-</div>
                </div>
              </td>
              <td dir="ltr" class="text-left">{{ brand.slug }}</td>
              <td><span class="badge bg-info/20 text-info">{{ productTypeLabelMap[brand.type] || brand.type }}</span></td>
              <td>{{ formatDateTime(brand.updatedAt || brand.createdAt) }}</td>
              <td>
                <div class="flex items-center justify-center gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="startEdit(brand)">ویرایش</button>
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteBrand(brand.id)">حذف</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 border-t border-white-light px-5 py-4 dark:border-[#1b2e4b] sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white-dark">صفحه {{ currentPage }} از {{ totalPages }}</p>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="currentPage === 1" @click="currentPage -= 1">قبلی</button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            class="btn btn-sm"
            :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="currentPage === totalPages" @click="currentPage += 1">بعدی</button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-black dark:text-white">{{ editingBrandId ? 'ویرایش برند' : 'ایجاد برند' }}</h2>
            <p class="mt-1 text-sm text-white-dark">نام، اسلاگ، نوع و تصویر برند را اینجا مدیریت کنید.</p>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isSubmitting" @click="closeModal">بستن</button>
        </div>

        <form class="space-y-5" @submit.prevent="submitBrand">
          <div>
            <label for="modal-brand-name">نام برند</label>
            <input id="modal-brand-name" v-model.trim="form.name" type="text" class="form-input" placeholder="مثلاً SKF" />
          </div>

          <div>
            <label for="modal-brand-slug">اسلاگ انگلیسی</label>
            <div class="flex gap-2">
              <input
                id="modal-brand-slug"
                v-model="form.slug"
                type="text"
                dir="ltr"
                inputmode="text"
                class="form-input"
                placeholder="skf"
                @input="sanitizeSlugInput"
              />
              <button type="button" class="btn btn-outline-secondary !px-4" @click="generateSlug">تولید</button>
            </div>
            <div v-if="suggestedSlugs.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span class="text-xs text-danger mt-1">پیشنهادها:</span>
              <button
                v-for="slug in suggestedSlugs"
                :key="slug"
                type="button"
                class="badge bg-primary/20 text-primary cursor-pointer hover:bg-primary hover:text-white transition"
                @click="applySuggestedSlug(slug)"
              >
                {{ slug }}
              </button>
            </div>
          </div>

          <div>
            <label for="modal-brand-type">نوع</label>
            <select id="modal-brand-type" v-model="form.type" class="form-select">
              <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </div>

          <div class="rounded-2xl border border-white-light p-4 dark:border-[#1b2e4b]">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-black dark:text-white">تصویر برند</h3>
                <p class="mt-1 text-xs text-white-dark">از Media Library انتخاب کنید یا فایل جدید آپلود کنید.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div class="overflow-hidden rounded-xl border border-dashed border-white-light bg-white-light/20 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <img v-if="brandImagePreview" :src="brandImagePreview" alt="brand" class="h-44 w-full object-cover" />
                <div v-else class="grid h-44 place-content-center text-sm text-white-dark">تصویری انتخاب نشده است</div>
              </div>

              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="isImagePickerOpen = true">انتخاب از رسانه</button>
                  <label class="btn btn-outline-secondary btn-sm cursor-pointer">
                    آپلود جدید
                    <input type="file" accept="image/*" class="hidden" @change="onBrandImageSelected" />
                  </label>
                  <button v-if="brandImagePreview" type="button" class="btn btn-outline-danger btn-sm" @click="clearBrandImage">حذف تصویر</button>
                </div>

                <div class="rounded-xl bg-white-light/40 px-4 py-3 text-sm text-white-dark dark:bg-[#060818]">
                  <div>منبع فعلی: {{ brandImageSourceLabel }}</div>
                  <div v-if="form.existingImageUrl" class="mt-1 break-all text-xs" dir="ltr">{{ form.existingImageUrl }}</div>
                  <div v-else-if="form.image" class="mt-1 text-xs">{{ form.image.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="formErrorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
            {{ formErrorMessage }}
          </div>

          <div class="flex gap-3">
            <button type="submit" class="btn btn-primary flex-1" :disabled="isSubmitting">
              {{ isSubmitting ? 'در حال ذخیره...' : editingBrandId ? 'ذخیره تغییرات' : 'ایجاد برند' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" :disabled="isSubmitting" @click="closeModal">انصراف</button>
          </div>
        </form>
      </div>
    </div>

    <MediaPickerModal
      :open="isImagePickerOpen"
      title="انتخاب تصویر برند"
      description="یک تصویر موجود را انتخاب کنید یا تصویر جدید آپلود کنید."
      :allowed-sections="['image']"
      initial-section="image"
      :selected-urls="form.existingImageUrl ? [form.existingImageUrl] : []"
      @close="isImagePickerOpen = false"
      @select="handleBrandMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import MediaPickerModal from '@/components/admin/media/MediaPickerModal.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import brandService from '@/services/brand-service'
import type { MediaItem } from '@/types/media'
import type { Brand, BrandPayload, ProductType } from '@/types/product'
import { formatDateTime, generateEnglishSlug, normalizeEnglishSlug, productTypeLabelMap, productTypeOptions } from '@/utils/product'

useMeta({ title: 'مدیریت برندها' })

const brands = ref<Brand[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const isImagePickerOpen = ref(false)
const editingBrandId = ref('')
const formErrorMessage = ref('')
const pageErrorMessage = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const brandImagePreview = ref('')
const pageSizeOptions = [10, 20, 30, 50]
const suggestedSlugs = ref<string[]>([])

const applySuggestedSlug = (slug: string) => {
  form.slug = slug
  suggestedSlugs.value = []
  formErrorMessage.value = ''
}

const filters = reactive({
  search: '',
  type: '' as ProductType | '',
})

const form = reactive<BrandPayload>({
  name: '',
  slug: '',
  type: 'Industrial',
  existingImageUrl: '',
  image: null,
})

const englishSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const filteredBrands = computed(() => {
  const search = filters.search.trim().toLowerCase()
  const type = filters.type

  return [...brands.value]
    .filter((brand) => {
      const searchableText = [brand.name, brand.slug, brand.type].join(' ').toLowerCase()
      if (type && brand.type !== type) return false
      return !search || searchableText.includes(search)
    })
    .sort((first, second) => first.name.localeCompare(second.name, 'fa'))
})

const uniqueTypesCount = computed(() => new Set(brands.value.map((brand) => brand.type).filter(Boolean)).size)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredBrands.value.length / pageSize.value)))
const paginatedBrands = computed(() => filteredBrands.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))
const pageStartIndex = computed(() => (filteredBrands.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0))
const pageEndIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredBrands.value.length))
const pageNumbers = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page += 1) pages.push(page)
  return pages
})
const brandImageSourceLabel = computed(() => {
  if (form.image) return 'فایل جدید'
  if (form.existingImageUrl) return 'کتابخانه رسانه / تصویر موجود'
  return 'بدون تصویر'
})

const sanitizeSlugInput = () => {
  form.slug = normalizeEnglishSlug(form.slug || '')
}

const generateSlug = () => {
  form.slug = generateEnglishSlug(form.name)
}

const resetForm = () => {
  editingBrandId.value = ''
  form.name = ''
  form.slug = ''
  form.type = 'Industrial'
  form.existingImageUrl = ''
  form.image = null
  brandImagePreview.value = ''
  formErrorMessage.value = ''
  suggestedSlugs.value = []
}

const closeModal = () => {
  if (isSubmitting.value) return
  isModalOpen.value = false
  isImagePickerOpen.value = false
  resetForm()
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const clearBrandImage = () => {
  form.image = null
  form.existingImageUrl = ''
  brandImagePreview.value = ''
}

const onBrandImageSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  form.image = file
  form.existingImageUrl = ''
  brandImagePreview.value = URL.createObjectURL(file)
}

const handleBrandMediaSelect = (items: MediaItem[]) => {
  const selected = items[0]
  if (!selected) return
  form.image = null
  form.existingImageUrl = selected.url
  brandImagePreview.value = selected.url
  isImagePickerOpen.value = false
}

const startEdit = (brand: Brand) => {
  editingBrandId.value = brand.id
  form.name = brand.name
  form.slug = normalizeEnglishSlug(brand.slug)
  form.type = brand.type
  form.existingImageUrl = brand.imageUrl || ''
  form.image = null
  brandImagePreview.value = brand.imageUrl || ''
  formErrorMessage.value = ''
  isModalOpen.value = true
}

const resetFilters = () => {
  filters.search = ''
  filters.type = ''
  currentPage.value = 1
}

const loadBrands = async () => {
  isLoading.value = true
  pageErrorMessage.value = ''

  try {
    brands.value = await brandService.getBrands()
  } catch (error) {
    pageErrorMessage.value = extractApiErrorMessage(error, 'بارگذاری برندها انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const submitBrand = async () => {
  formErrorMessage.value = ''
  form.slug = normalizeEnglishSlug(form.slug || generateEnglishSlug(form.name))

  if (!form.name.trim() || !form.slug.trim()) {
    formErrorMessage.value = 'نام، اسلاگ و نوع برند الزامی است'
    return
  }

  if (!englishSlugPattern.test(form.slug)) {
    formErrorMessage.value = 'اسلاگ باید فقط با حروف انگلیسی کوچک، عدد و خط فاصله وارد شود'
    return
  }

  isSubmitting.value = true
  try {
    const payload: BrandPayload = {
      name: form.name.trim(),
      slug: form.slug,
      type: form.type,
      existingImageUrl: form.image ? '' : form.existingImageUrl || '',
      image: form.image || null,
    }

    if (editingBrandId.value) {
      await brandService.updateBrand(editingBrandId.value, payload)
    } else {
      await brandService.createBrand(payload)
    }

    isModalOpen.value = false
    resetForm()
    await loadBrands()
  } catch (error) {
    const msg = extractApiErrorMessage(error, 'ذخیره برند انجام نشد')
    formErrorMessage.value = msg
    if (msg.includes('اسلاگ')) {
      const baseSlug = form.slug || 'brand'
      suggestedSlugs.value = [
        `${baseSlug}-1`,
        `${baseSlug}-${Math.floor(10 + Math.random() * 90)}`,
        `${baseSlug}-${Date.now().toString().slice(-4)}`
      ]
    }
  } finally {
    isSubmitting.value = false
  }
}

const deleteBrand = async (id: string) => {
  const result = await Swal.fire({
    title: 'حذف برند',
    text: 'آیا از حذف این برند مطمئن هستید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })

  if (!result.isConfirmed) return

  try {
    await brandService.deleteBrand(id)
    if (editingBrandId.value === id) closeModal()
    await loadBrands()
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'حذف برند انجام نشد'),
      icon: 'error',
    })
  }
}

watch([() => filters.search, () => filters.type, pageSize], () => {
  currentPage.value = 1
})

watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value
})

onMounted(loadBrands)
</script>

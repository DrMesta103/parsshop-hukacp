<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">{{ pageTitle }}</h1>
        <p class="mt-1 text-white-dark">{{ pageDescription }}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <router-link to="/admin/products" class="btn btn-outline-primary">بازگشت به لیست محصولات</router-link>
        <router-link v-if="props.mode === 'edit' && props.productId" :to="`/admin/products/${props.productId}`" class="btn btn-outline-secondary">
          مشاهده جزئیات
        </router-link>
      </div>
    </div>

    <div v-if="isBootLoading" class="panel">
      <div class="grid min-h-[240px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>
    </div>

    <form v-else class="space-y-6" @submit.prevent="submitForm">
      <div v-if="errorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">اطلاعات اصلی محصول</h2>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label for="title">عنوان محصول</label>
                <input id="title" v-model="form.title" type="text" class="form-input" placeholder="مثلاً بلبرینگ SKF 6006-2RS" />
              </div>
              <div>
                <label for="sku">SKU</label>
                <input id="sku" v-model="form.sku" type="text" class="form-input" placeholder="BRG-6006-2RS" />
              </div>
              <div>
                <label for="slug">اسلاگ</label>
                <div class="flex gap-2">
                  <input id="slug" v-model="form.slug" type="text" class="form-input" placeholder="skf-6006-2rs" />
                  <button type="button" class="btn btn-outline-secondary !px-4" @click="generateSlug">تولید</button>
                </div>
              </div>
              <div>
                <label for="technical-code">کد فنی</label>
                <input id="technical-code" v-model="form.technicalCode" type="text" class="form-input" placeholder="SKF-6006" />
              </div>
              <div>
                <label for="brand">برند</label>
                <select id="brand" v-model="form.brandId" class="form-select">
                  <option value="">یک برند انتخاب کنید</option>
                  <option v-for="brand in filteredBrands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
                <p v-if="form.brand && !form.brandId" class="mt-2 text-xs text-warning">Fallback brand: {{ form.brand }}</p>
              </div>
              <div>
                <label for="category">دسته بندی</label>
                <select id="category" v-model="form.categoryId" class="form-select">
                  <option value="">بدون دسته بندی</option>
                  <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="type">نوع محصول</label>
                <select id="type" v-model="form.type" class="form-select">
                  <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>
              <div>
                <label for="status">وضعیت</label>
                <select id="status" v-model="form.status" class="form-select">
                  <option v-for="item in productStatusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>
              <div>
                <label for="base-price">قیمت پایه (USD)</label>
                <input id="base-price" v-model.number="form.basePriceUSD" type="number" min="0" step="0.01" class="form-input" />
              </div>
              <div>
                <label for="sale-price">قیمت فروش (USD)</label>
                <input id="sale-price" v-model.number="form.salePriceUSD" type="number" min="0" step="0.01" class="form-input" />
              </div>
              <div>
                <label for="stock">موجودی</label>
                <input id="stock" v-model.number="form.stock" type="number" min="0" step="1" class="form-input" />
              </div>
              <div class="flex items-center gap-3 pt-8">
                <input id="featured" v-model="form.featured" type="checkbox" class="form-checkbox outline-primary" />
                <label for="featured" class="!mb-0">محصول ویژه</label>
              </div>
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">محتوا و توضیحات</h2>
            <div class="space-y-5">
              <div>
                <label for="summary">خلاصه</label>
                <textarea id="summary" v-model="form.summary" rows="3" class="form-textarea" placeholder="خلاصه کوتاه برای لیست محصولات"></textarea>
              </div>
              <div>
                <label for="description">توضیحات کامل</label>
                <textarea id="description" v-model="form.description" rows="8" class="form-textarea" placeholder="توضیحات کامل محصول"></textarea>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-black dark:text-white">ویژگی ها و مشخصات</h2>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="addAttribute">افزودن ردیف</button>
            </div>
            <div class="space-y-3">
              <div v-for="(attribute, index) in attributeEntries" :key="`attribute-${index}`" class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input v-model="attribute.key" type="text" class="form-input" placeholder="کلید، مثل innerDiameter" />
                <input v-model="attribute.value" type="text" class="form-input" placeholder="مقدار، مثل 30mm" />
                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeAttribute(index)">حذف</button>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-black dark:text-white">برچسب ها</h2>
              <span class="text-xs text-white-dark">برای افزودن، اینتر بزنید</span>
            </div>
            <div class="space-y-4">
              <input v-model="tagInput" type="text" class="form-input" placeholder="مثلاً bearing" @keydown.enter.prevent="addTag" />
              <div v-if="form.tags.length" class="flex flex-wrap gap-2">
                <button
                  v-for="tag in form.tags"
                  :key="tag"
                  type="button"
                  class="badge bg-primary/15 px-3 py-1 text-primary hover:bg-primary hover:text-white"
                  @click="removeTag(tag)"
                >
                  {{ tag }} ×
                </button>
              </div>
              <div v-else class="rounded-md border border-dashed border-white-light px-4 py-3 text-sm text-white-dark dark:border-[#1b2e4b]">
                هنوز برچسبی ثبت نشده است.
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">تصویر اصلی</h2>
            <div class="space-y-4">
              <div class="overflow-hidden rounded-xl border border-dashed border-white-light bg-white-light/20 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <img v-if="mainImagePreview" :src="mainImagePreview" alt="main" class="h-56 w-full object-cover" />
                <div v-else class="grid h-56 place-content-center text-sm text-white-dark">تصویر اصلی انتخاب نشده است</div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('main')">انتخاب از رسانه</button>
                <span class="pt-2 text-xs text-white-dark">یا فایل جدید را مستقیم آپلود کنید</span>
              </div>
              <input type="file" accept="image/*" class="form-input" @change="onMainImageSelected" />
              <button v-if="mainImagePreview" type="button" class="btn btn-outline-danger btn-sm w-full" @click="clearMainImage">حذف تصویر اصلی</button>
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">گالری تصاویر</h2>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('gallery')">انتخاب از رسانه</button>
                <span class="pt-2 text-xs text-white-dark">برای انتخاب چندتایی از کتابخانه رسانه استفاده کنید</span>
              </div>
              <input type="file" accept="image/*" multiple class="form-input" @change="onGallerySelected" />
              <div v-if="galleryItems.length" class="grid grid-cols-2 gap-3">
                <div v-for="item in galleryItems" :key="item.id" class="overflow-hidden rounded-xl border border-white-light dark:border-[#1b2e4b]">
                  <img :src="item.preview" alt="gallery" class="h-28 w-full object-cover" />
                  <button type="button" class="btn btn-outline-danger btn-sm m-2 w-[calc(100%-1rem)]" @click="removeGalleryItem(item.id)">حذف</button>
                </div>
              </div>
              <div v-else class="rounded-md border border-dashed border-white-light px-4 py-3 text-sm text-white-dark dark:border-[#1b2e4b]">
                هنوز تصویری در گالری وجود ندارد.
              </div>
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-5 text-lg font-semibold text-black dark:text-white">مدل سه بعدی</h2>
            <div class="space-y-4">
              <div class="rounded-xl border border-dashed border-white-light px-4 py-4 dark:border-[#1b2e4b]">
                <div v-if="modelPreviewName" class="space-y-2">
                  <p class="font-semibold text-black dark:text-white">{{ modelPreviewName }}</p>
                  <a v-if="existingModelLink" :href="existingModelLink" target="_blank" class="text-sm text-primary hover:underline">مشاهده فایل فعلی</a>
                </div>
                <div v-else class="text-sm text-white-dark">مدل سه بعدی ثبت نشده است.</div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('model')">انتخاب از رسانه</button>
                <span class="pt-2 text-xs text-white-dark">یا فایل جدید مدل را مستقیم آپلود کنید</span>
              </div>
              <input type="file" accept=".glb,.gltf,.obj,.usdz,.zip,model/*" class="form-input" @change="onModelSelected" />
              <button v-if="modelPreviewName" type="button" class="btn btn-outline-danger btn-sm w-full" @click="clearModel">حذف مدل سه بعدی</button>
            </div>
          </div>

          <div class="panel">
            <h2 class="mb-4 text-lg font-semibold text-black dark:text-white">اقدامات</h2>
            <div class="space-y-3">
              <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
                <span v-if="isSubmitting">در حال ذخیره...</span>
                <span v-else>{{ submitLabel }}</span>
              </button>
              <button type="button" class="btn btn-outline-secondary w-full" :disabled="isSubmitting" @click="resetForm">بازنشانی فرم</button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <MediaPickerModal
      :open="isMediaPickerOpen"
      :title="pickerTitle"
      :description="pickerDescription"
      :multiple="mediaPickerKind === 'gallery'"
      :initial-section="pickerInitialSection"
      :allowed-sections="pickerAllowedSections"
      :selected-urls="pickerSelectedUrls"
      @close="isMediaPickerOpen = false"
      @select="handleMediaPickerSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import MediaPickerModal from '@/components/admin/media/MediaPickerModal.vue'
import brandService from '@/services/brand-service'
import categoryService from '@/services/category-service'
import productService from '@/services/product-service'
import { extractApiErrorMessage } from '@/services/admin-api'
import type { MediaItem, MediaSection } from '@/types/media'
import type { Brand, Category, ProductFormPayload } from '@/types/product'
import {
  attributeEntriesToObject,
  attributesToEntries,
  createEmptyProductForm,
  filterBrandsByProductType,
  filterCategoriesByType,
  mapProductToForm,
  productStatusOptions,
  productTypeOptions,
  slugify,
  type AttributeEntry,
} from '@/utils/product'

type GalleryItem = {
  id: string
  preview: string
  file?: File
  existingUrl?: string
}

const props = defineProps<{
  mode: 'create' | 'edit'
  productId?: string
}>()

const router = useRouter()

const form = reactive<ProductFormPayload>(createEmptyProductForm())
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const attributeEntries = ref<AttributeEntry[]>(attributesToEntries())
const tagInput = ref('')
const isSubmitting = ref(false)
const isBootLoading = ref(false)
const errorMessage = ref('')
const mainImagePreview = ref('')
const galleryItems = ref<GalleryItem[]>([])
const modelPreviewName = ref('')
const existingModelLink = ref('')
const isMediaPickerOpen = ref(false)
const mediaPickerKind = ref<'main' | 'gallery' | 'model'>('main')

const pageTitle = computed(() => (props.mode === 'create' ? 'افزودن محصول جدید' : 'ویرایش محصول'))
const pageDescription = computed(() =>
  props.mode === 'create' ? 'اطلاعات محصول، رسانه ها و مشخصات فنی را ثبت کنید' : 'اطلاعات محصول را با حفظ فایل های قبلی ویرایش کنید',
)
const submitLabel = computed(() => (props.mode === 'create' ? 'ایجاد محصول' : 'ذخیره تغییرات'))
const filteredCategories = computed(() => filterCategoriesByType(categories.value, form.type))
const filteredBrands = computed(() => filterBrandsByProductType(brands.value, form.type))
const selectedBrand = computed(() => brands.value.find((brand) => brand.id === form.brandId))

watch(
  () => form.type,
  () => {
    if (form.categoryId && !filteredCategories.value.some((category) => category.id === form.categoryId)) {
      form.categoryId = undefined
    }
    if (form.brandId && !filteredBrands.value.some((brand) => brand.id === form.brandId)) {
      form.brandId = undefined
    }
  },
)

const syncAttributeObject = () => {
  form.attributes = attributeEntriesToObject(attributeEntries.value)
}

watch(
  attributeEntries,
  () => syncAttributeObject(),
  { deep: true },
)

const loadCategories = async () => {
  categories.value = await categoryService.getCategories()
}

const loadBrands = async () => {
  brands.value = await brandService.getBrands()
}

const loadProduct = async () => {
  if (!props.productId) return

  const product = await productService.getAdminProduct(props.productId)
  const mapped = mapProductToForm(product)
  Object.assign(form, mapped)
  attributeEntries.value = attributesToEntries(mapped.attributes)
  mainImagePreview.value = mapped.existingMainImageUrl || ''
  galleryItems.value = (mapped.existingGalleryUrls || []).map((url, index) => ({
    id: `existing-${index}`,
    preview: url,
    existingUrl: url,
  }))
  existingModelLink.value = mapped.existingThreeDModelUrl || ''
  modelPreviewName.value = mapped.existingThreeDModelUrl ? mapped.existingThreeDModelUrl.split('/').pop() || 'مدل سه بعدی' : ''
}

const generateSlug = () => {
  form.slug = slugify(form.title || form.sku || form.technicalCode)
}

const openMediaPicker = (kind: 'main' | 'gallery' | 'model') => {
  mediaPickerKind.value = kind
  isMediaPickerOpen.value = true
}

const addAttribute = () => {
  attributeEntries.value.push({ key: '', value: '' })
}

const removeAttribute = (index: number) => {
  if (attributeEntries.value.length === 1) {
    attributeEntries.value[0] = { key: '', value: '' }
    return
  }
  attributeEntries.value.splice(index, 1)
}

const addTag = () => {
  const normalized = tagInput.value.trim()
  if (!normalized || form.tags.includes(normalized)) {
    tagInput.value = ''
    return
  }
  form.tags.push(normalized)
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  form.tags = form.tags.filter((item) => item !== tag)
}

const onMainImageSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  form.mainImage = file
  form.existingMainImageUrl = ''
  mainImagePreview.value = URL.createObjectURL(file)
}

const clearMainImage = () => {
  form.mainImage = null
  form.existingMainImageUrl = props.mode === 'edit' ? '' : undefined
  mainImagePreview.value = ''
}

const onGallerySelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  form.images = files
  form.existingGalleryUrls = []
  galleryItems.value = files.map((file, index) => ({
    id: `new-${index}-${file.name}`,
    preview: URL.createObjectURL(file),
    file,
  }))
}

const removeGalleryItem = (id: string) => {
  galleryItems.value = galleryItems.value.filter((item) => item.id !== id)
  form.images = galleryItems.value.filter((item) => item.file).map((item) => item.file as File)
  form.existingGalleryUrls = galleryItems.value.filter((item) => item.existingUrl).map((item) => item.existingUrl as string)
}

const onModelSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  form.model3d = file
  form.existingThreeDModelUrl = ''
  existingModelLink.value = ''
  modelPreviewName.value = file.name
}

const clearModel = () => {
  form.model3d = null
  form.existingThreeDModelUrl = props.mode === 'edit' ? '' : undefined
  existingModelLink.value = ''
  modelPreviewName.value = ''
}

const handleMainMediaSelect = (items: MediaItem[]) => {
  const selected = items[0]
  if (!selected) return

  form.mainImage = null
  form.existingMainImageUrl = selected.url
  mainImagePreview.value = selected.url
  isMediaPickerOpen.value = false
}

const handleGalleryMediaSelect = (items: MediaItem[]) => {
  if (!items.length) return

  form.images = []
  form.existingGalleryUrls = items.map((item) => item.url)
  galleryItems.value = items.map((item) => ({
    id: item.id,
    preview: item.url,
    existingUrl: item.url,
  }))
  isMediaPickerOpen.value = false
}

const handleModelMediaSelect = (items: MediaItem[]) => {
  const selected = items[0]
  if (!selected) return

  form.model3d = null
  form.existingThreeDModelUrl = selected.url
  existingModelLink.value = selected.url
  modelPreviewName.value = selected.originalName || 'مدل سه بعدی'
  isMediaPickerOpen.value = false
}

const pickerTitle = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'انتخاب تصاویر گالری'
    case 'model':
      return 'انتخاب مدل سه‌بعدی'
    default:
      return 'انتخاب تصویر اصلی'
  }
})

const pickerDescription = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'چند تصویر موجود را انتخاب کنید یا داخل همین پنجره فایل جدید آپلود کنید.'
    case 'model':
      return 'یک مدل سه‌بعدی موجود را انتخاب کنید یا فایل جدید آپلود کنید.'
    default:
      return 'یک تصویر موجود را انتخاب کنید یا فایل جدید آپلود کنید.'
  }
})

const pickerAllowedSections = computed<MediaSection[]>(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return ['gallery', 'image']
    case 'model':
      return ['model3d']
    default:
      return ['image']
  }
})

const pickerInitialSection = computed<MediaSection>(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'gallery'
    case 'model':
      return 'model3d'
    default:
      return 'image'
  }
})

const pickerSelectedUrls = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return galleryItems.value.map((item) => item.existingUrl).filter(Boolean) as string[]
    case 'model':
      return form.existingThreeDModelUrl ? [form.existingThreeDModelUrl] : []
    default:
      return form.existingMainImageUrl ? [form.existingMainImageUrl] : []
  }
})

const handleMediaPickerSelect = (items: MediaItem[]) => {
  if (mediaPickerKind.value === 'gallery') {
    handleGalleryMediaSelect(items)
    return
  }
  if (mediaPickerKind.value === 'model') {
    handleModelMediaSelect(items)
    return
  }
  handleMainMediaSelect(items)
}

const validateForm = () => {
  if (!form.title.trim()) return 'عنوان محصول الزامی است'
  if (!form.sku.trim()) return 'SKU الزامی است'
  if (!form.slug.trim()) return 'اسلاگ الزامی است'
  if (!form.technicalCode.trim()) return 'کد فنی الزامی است'
  if (!form.brandId && !(form.brand || '').trim()) return 'برند الزامی است'
  if (form.basePriceUSD < 0) return 'قیمت پایه نمی تواند منفی باشد'
  if (form.salePriceUSD !== null && form.salePriceUSD !== undefined && form.salePriceUSD !== '' && Number(form.salePriceUSD) < 0) {
    return 'قیمت فروش نمی تواند منفی باشد'
  }
  if (form.stock < 0) return 'موجودی نمی تواند منفی باشد'
  return ''
}

const resetForm = async () => {
  if (props.mode === 'edit') {
    await loadProduct()
  } else {
    Object.assign(form, createEmptyProductForm())
    attributeEntries.value = attributesToEntries()
    mainImagePreview.value = ''
    galleryItems.value = []
    modelPreviewName.value = ''
    existingModelLink.value = ''
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  errorMessage.value = validateForm()
  if (errorMessage.value) return

  syncAttributeObject()
  isSubmitting.value = true

  try {
    const normalizedSalePrice =
      form.salePriceUSD === null ||
      form.salePriceUSD === undefined ||
      form.salePriceUSD === '' ||
      Number.isNaN(Number(form.salePriceUSD))
        ? null
        : Number(form.salePriceUSD)

    const payload: ProductFormPayload = {
      ...form,
      brandId: form.brandId ?? '',
      brand: selectedBrand.value?.name || form.brand,
      categoryId: form.categoryId || undefined,
      salePriceUSD: normalizedSalePrice,
      existingGalleryUrls: form.images && form.images.length > 0 ? [] : galleryItems.value.map((item) => item.existingUrl).filter(Boolean) as string[],
    }

    const response =
      props.mode === 'create' ? await productService.createAdminProduct(payload) : await productService.updateAdminProduct(props.productId as string, payload)

    await Swal.fire({
      title: 'موفق',
      text: props.mode === 'create' ? 'محصول با موفقیت ایجاد شد' : 'تغییرات محصول ذخیره شد',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    })

    router.push(`/admin/products/${response.id}`)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'ذخیره محصول انجام نشد')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  isBootLoading.value = true
  try {
    await Promise.all([loadCategories(), loadBrands()])
    if (props.mode === 'edit') {
      await loadProduct()
    } else {
      attributeEntries.value = attributesToEntries(form.attributes)
    }
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری اطلاعات محصول انجام نشد')
  } finally {
    isBootLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="errorMessage" class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
      {{ errorMessage }}
    </div>

    <div v-if="showOverview" class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <button
        v-for="item in sectionCards"
        :key="item.value"
        type="button"
        class="rounded-xl border px-4 py-4 text-right transition"
        :class="filters.section === item.value ? 'border-primary bg-primary/10' : 'border-white-light bg-white-light/30 dark:border-[#1b2e4b] dark:bg-[#0e1726]'"
        @click="setSectionFilter(item.value)"
      >
        <div class="text-xs text-white-dark">{{ item.label }}</div>
        <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ item.count }}</div>
      </button>
    </div>

    <div class="panel">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجو در عنوان، نام فایل یا alt..." />
        <select v-model="filters.section" class="form-select">
          <option value="">همه سکشن‌ها</option>
          <option v-for="item in allowedSectionOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <select v-model="filters.folder" class="form-select">
          <option value="">همه پوشه‌ها</option>
          <option v-for="folder in folderOptions" :key="folder" :value="folder">{{ folder }}</option>
        </select>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن</button>
          <button type="button" class="btn btn-primary btn-sm" @click="toggleUploadPanel">
            {{ isUploadPanelOpen ? 'بستن آپلود' : 'آپلود رسانه' }}
          </button>
        </div>
      </div>

      <div v-if="isUploadPanelOpen" class="mt-5 rounded-xl border border-dashed border-white-light p-4 dark:border-[#1b2e4b]">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="media-files">فایل‌ها</label>
            <input id="media-files" type="file" class="form-input" :multiple="allowMultipleUpload" :accept="acceptAttribute" @change="onFilesSelected" />
          </div>
          <div>
            <label for="media-section">سکشن</label>
            <select id="media-section" v-model="uploadForm.section" class="form-select">
              <option v-for="item in allowedSectionOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </div>
          <div>
            <label for="media-folder">پوشه</label>
            <input id="media-folder" v-model.trim="uploadForm.folder" type="text" class="form-input" placeholder="products/main" />
          </div>
          <div class="flex items-center gap-3 pt-8">
            <input id="media-public" v-model="uploadForm.isPublic" type="checkbox" class="form-checkbox outline-primary" />
            <label for="media-public" class="!mb-0">عمومی</label>
          </div>
          <div>
            <label for="media-title">عنوان</label>
            <input id="media-title" v-model.trim="uploadForm.title" type="text" class="form-input" />
          </div>
          <div>
            <label for="media-alt">Alt</label>
            <input id="media-alt" v-model.trim="uploadForm.alt" type="text" class="form-input" />
          </div>
        </div>
        <div class="mt-4">
          <label for="media-caption">Caption</label>
          <textarea id="media-caption" v-model.trim="uploadForm.caption" rows="3" class="form-textarea"></textarea>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="btn btn-primary" :disabled="isUploading" @click="submitUpload">
            {{ isUploading ? 'در حال آپلود...' : 'شروع آپلود' }}
          </button>
          <span class="text-sm text-white-dark">{{ selectedUploadNames }}</span>
        </div>

        <div v-if="recentUploads.length" class="mt-4 rounded-xl border border-success/30 bg-success/10 p-4">
          <div class="mb-3 text-sm font-semibold text-success">لینک دانلود فایل‌های آپلودشده</div>
          <div class="space-y-2">
            <div
              v-for="item in recentUploads"
              :key="item.id"
              class="flex flex-col gap-2 rounded-lg border border-success/20 bg-white/60 px-3 py-2 text-sm dark:bg-[#0e1726]/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0">
                <div class="line-clamp-1 font-semibold text-black dark:text-white">{{ item.title || item.originalName }}</div>
                <div class="mt-1 text-xs text-white-dark">آپلودکننده: {{ resolveUploaderName(item) }}</div>
              </div>
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <IconDownload class="h-4 w-4" />
                <span>دانلود</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light px-5 py-4 dark:border-[#1b2e4b]">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-black dark:text-white">کتابخانه رسانه</h3>
            <p class="mt-1 text-sm text-white-dark">نمایش {{ pageStartIndex }} تا {{ pageEndIndex }} از {{ pagination.total }} فایل</p>
          </div>
          <div v-if="selectionMode && !selectable" class="flex items-center gap-2">
            <span class="text-sm text-white-dark">{{ selectedIds.length }} مورد انتخاب شده</span>
            <button type="button" class="btn btn-outline-danger btn-sm" :disabled="selectedIds.length === 0" @click="deleteSelectedItems">
              حذف گروهی
            </button>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearSelectionMode">لغو</button>
          </div>
          <div v-if="selectable" class="flex items-center gap-2">
            <span class="text-sm text-white-dark">{{ selectedItems.length }} مورد انتخاب شده</span>
            <button type="button" class="btn btn-primary btn-sm" :disabled="selectedItems.length === 0" @click="confirmSelection">انتخاب</button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="grid min-h-[280px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="mediaItems.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          رسانه‌ای با فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-3 p-4 md:grid-cols-3" :class="cardGridClass">
        <article
          v-for="item in mediaItems"
          :key="item.id"
          class="overflow-hidden rounded-xl border transition"
          :class="selectedIds.includes(item.id) ? 'border-primary shadow-[0_0_0_1px_rgba(67,97,238,0.25)]' : 'border-white-light dark:border-[#1b2e4b]'"
        >
          <button
            type="button"
            class="relative block w-full text-right"
            @click="handleCardClick(item)"
            @mousedown.left="startCardPress(item)"
            @mouseup.left="cancelCardPress"
            @mouseleave="cancelCardPress"
            @touchstart.passive="startCardPress(item)"
            @touchend="cancelCardPress"
            @touchcancel="cancelCardPress"
          >
            <div class="grid h-28 place-content-center overflow-hidden bg-white-light/30 dark:bg-[#060818]">
              <img v-if="isImage(item)" :src="item.url" :alt="item.alt || item.title || item.originalName" class="h-full w-full object-cover" />
              <video v-else-if="isVideo(item)" :src="item.url" class="h-full w-full object-cover" muted />
              <div v-else class="space-y-3 px-4 text-center">
                <div class="text-4xl text-primary">{{ getMediaGlyph(item.section) }}</div>
                <div class="text-xs text-white-dark">{{ item.extension || item.mimeType || item.section }}</div>
              </div>
            </div>
            <label
              v-if="selectionMode && !selectable"
              class="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-black/50"
              @click.stop
            >
              <input type="checkbox" class="form-checkbox h-4 w-4 text-primary" :checked="selectedIds.includes(item.id)" @change="toggleSelection(item)" />
            </label>
          </button>

          <div class="space-y-2 p-3">
            <div>
              <div class="line-clamp-1 text-sm font-semibold text-black dark:text-white">{{ item.title || item.originalName }}</div>
              <div class="mt-1 line-clamp-1 text-xs text-white-dark">{{ item.originalName }}</div>
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
              <span class="badge bg-info/15 text-info">{{ sectionLabelMap[item.section] }}</span>
              <span v-if="item.folder" class="badge bg-success/15 text-success">{{ item.folder }}</span>
              <span class="badge bg-warning/15 text-warning">{{ formatSize(item.size) }}</span>
            </div>

            <div class="line-clamp-1 text-[11px] text-white-dark">آپلودکننده: {{ resolveUploaderName(item) }}</div>

            <div class="flex items-center justify-between gap-2">
              <button v-if="selectable" type="button" class="btn btn-outline-primary btn-sm" @click="toggleSelection(item)">
                {{ selectedIds.includes(item.id) ? 'عدم انتخاب' : multiple ? 'افزودن' : 'انتخاب' }}
              </button>
              <div class="ms-auto flex items-center gap-1">
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white-light text-primary transition hover:bg-primary/10 dark:border-[#1b2e4b]"
                  title="دانلود"
                  @click.stop
                >
                  <IconDownload class="h-4 w-4" />
                </a>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white-light text-info transition hover:bg-info/10 dark:border-[#1b2e4b]"
                  title="ویرایش"
                  @click.stop="openEditModal(item)"
                >
                  <IconEdit class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white-light text-danger transition hover:bg-danger/10 dark:border-[#1b2e4b]"
                  title="حذف"
                  @click.stop="deleteItem(item)"
                >
                  <IconTrashLines class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex flex-col gap-3 border-t border-white-light px-5 py-4 dark:border-[#1b2e4b] sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white-dark">صفحه {{ pagination.page }} از {{ pagination.totalPages }}</p>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">قبلی</button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            class="btn btn-sm"
            :class="page === pagination.page ? 'btn-primary' : 'btn-outline-secondary'"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page >= pagination.totalPages" @click="changePage(pagination.page + 1)">بعدی</button>
        </div>
      </div>
    </div>

    <div v-if="editingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-semibold text-black dark:text-white">ویرایش رسانه</h3>
            <p class="mt-1 text-sm text-white-dark">{{ editingItem.originalName }}</p>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeEditModal">بستن</button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="edit-title">عنوان</label>
            <input id="edit-title" v-model.trim="editForm.title" type="text" class="form-input" />
          </div>
          <div>
            <label for="edit-alt">Alt</label>
            <input id="edit-alt" v-model.trim="editForm.alt" type="text" class="form-input" />
          </div>
          <div>
            <label for="edit-caption">Caption</label>
            <textarea id="edit-caption" v-model.trim="editForm.caption" rows="3" class="form-textarea"></textarea>
          </div>
          <div class="flex items-center gap-3">
            <input id="edit-public" v-model="editForm.isPublic" type="checkbox" class="form-checkbox outline-primary" />
            <label for="edit-public" class="!mb-0">عمومی</label>
          </div>
          <div class="flex gap-3">
            <button type="button" class="btn btn-primary flex-1" :disabled="isSaving" @click="saveMetadata">
              {{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" :disabled="isSaving" @click="closeEditModal">انصراف</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="previewItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6" @click.self="closePreview">
      <div class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#0e1726]">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="line-clamp-1 text-base font-semibold text-black dark:text-white">{{ previewItem.title || previewItem.originalName }}</div>
            <div class="mt-1 line-clamp-1 text-xs text-white-dark">{{ previewItem.originalName }}</div>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="closePreview">بستن</button>
        </div>
        <div class="grid place-content-center overflow-hidden rounded-xl bg-black/10 p-2 dark:bg-black/30">
          <img v-if="isImage(previewItem)" :src="previewItem.url" :alt="previewItem.alt || previewItem.title || previewItem.originalName" class="max-h-[70vh] w-auto rounded-lg object-contain" />
          <video v-else-if="isVideo(previewItem)" :src="previewItem.url" class="max-h-[70vh] w-full rounded-lg object-contain" controls autoplay />
          <audio v-else-if="isAudio(previewItem)" :src="previewItem.url" class="w-full" controls autoplay />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import IconDownload from '@/components/icon/icon-download.vue'
import IconEdit from '@/components/icon/icon-edit.vue'
import IconTrashLines from '@/components/icon/icon-trash-lines.vue'
import { extractApiErrorMessage } from '@/services/admin-api'
import mediaService from '@/services/media-service'
import { useAuthStore } from '@/stores/auth'
import type { MediaItem, MediaOverview, MediaSection } from '@/types/media'

const LONG_PRESS_MS = 700

const sectionLabelMap: Record<MediaSection, string> = {
  image: 'تصاویر',
  gallery: 'گالری',
  audio: 'صداها',
  video: 'ویدیوها',
  model3d: 'مدل‌های سه‌بعدی',
  document: 'اسناد',
}

const defaultSectionOrder: MediaSection[] = ['image', 'gallery', 'audio', 'video', 'model3d', 'document']

const props = withDefaults(
  defineProps<{
    selectable?: boolean
    multiple?: boolean
    initialSection?: MediaSection | ''
    allowedSections?: MediaSection[]
    selectedUrls?: string[]
    showOverview?: boolean
  }>(),
  {
    selectable: false,
    multiple: false,
    initialSection: '',
    allowedSections: () => [],
    selectedUrls: () => [],
    showOverview: true,
  },
)

const emit = defineEmits<{
  (event: 'select', items: MediaItem[]): void
}>()

const authStore = useAuthStore()
const overview = ref<MediaOverview>({ total: 0, sections: [] })
const mediaItems = ref<MediaItem[]>([])
const recentUploads = ref<MediaItem[]>([])
const isLoading = ref(false)
const isUploading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const selectedIds = ref<string[]>([])
const selectionMode = ref(false)
const previewItem = ref<MediaItem | null>(null)
const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const pressedItemId = ref<string | null>(null)
const isUploadPanelOpen = ref(false)
const editingItem = ref<MediaItem | null>(null)
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
})

const filters = reactive<{
  section: MediaSection | ''
  folder: string
  search: string
}>({
  section: props.initialSection || '',
  folder: '',
  search: '',
})

const uploadFiles = ref<File[]>([])
const uploadForm = reactive({
  section: (props.initialSection || props.allowedSections[0] || 'image') as MediaSection,
  folder: '',
  title: '',
  alt: '',
  caption: '',
  isPublic: true,
})

const editForm = reactive({
  title: '',
  alt: '',
  caption: '',
  isPublic: true,
})

const allowedSections = computed(() => (props.allowedSections.length ? props.allowedSections : defaultSectionOrder))
const allowedSectionOptions = computed(() => allowedSections.value.map((value) => ({ value, label: sectionLabelMap[value] })))
const liveSectionCounts = computed(() =>
  mediaItems.value.reduce<Record<string, number>>((result, item) => {
    result[item.section] = (result[item.section] || 0) + 1
    return result
  }, {}),
)
const cardGridClass = computed(() => (props.selectable ? 'xl:grid-cols-4' : 'xl:grid-cols-6'))

const sectionCards = computed(() =>
  allowedSections.value.map((section) => {
    const item = overview.value.sections.find((entry) => entry.section === section)
    const overviewCount = item?.total || 0
    const liveCount = liveSectionCounts.value[section] || 0
    return { value: section, label: sectionLabelMap[section], count: Math.max(overviewCount, liveCount) }
  }),
)

const folderOptions = computed(() => {
  const overviewFolders = overview.value.sections
    .filter((section) => !filters.section || section.section === filters.section)
    .flatMap((section) => section.folders.map((folder) => folder.folder))
  const listedFolders = mediaItems.value.map((item) => item.folder || '').filter(Boolean)
  return Array.from(new Set([...overviewFolders, ...listedFolders])).sort((a, b) => a.localeCompare(b, 'fa'))
})

const selectedItems = computed(() => mediaItems.value.filter((item) => selectedIds.value.includes(item.id)))
const pageNumbers = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, pagination.page - 2)
  const end = Math.min(pagination.totalPages, pagination.page + 2)
  for (let page = start; page <= end; page += 1) pages.push(page)
  return pages
})
const pageStartIndex = computed(() => (pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0))
const pageEndIndex = computed(() => Math.min(pagination.page * pagination.limit, pagination.total))
const selectedUploadNames = computed(() => uploadFiles.value.map((file) => file.name).join('، '))
const allowMultipleUpload = computed(() => props.multiple || uploadForm.section === 'gallery')
const currentUploader = computed(() => ({
  id: authStore.user?.id || '',
  phone: authStore.user?.phone || '',
  name: authStore.user?.fullName || authStore.user?.phone || authStore.user?.id || 'کاربر جاری',
}))

const acceptAttribute = computed(() => {
  if (uploadForm.section === 'image' || uploadForm.section === 'gallery') return 'image/*'
  if (uploadForm.section === 'audio') return 'audio/*'
  if (uploadForm.section === 'video') return 'video/*'
  if (uploadForm.section === 'model3d') return '.glb,.gltf,.obj,.usdz,.zip,model/*'
  return '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt'
})

const loadOverview = async () => {
  try {
    overview.value = await mediaService.getOverview()
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری آمار رسانه انجام نشد')
  }
}

const loadMedia = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await mediaService.getMedia({
      section: filters.section || undefined,
      folder: filters.folder || undefined,
      search: filters.search || undefined,
      page: pagination.page,
      limit: pagination.limit,
    })
    mediaItems.value = response.items
    pagination.total = response.meta.total
    pagination.page = response.meta.page
    pagination.limit = response.meta.limit
    pagination.totalPages = response.meta.totalPages
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری رسانه‌ها انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const reload = async () => {
  await Promise.all([loadOverview(), loadMedia()])
}

const changePage = (page: number) => {
  pagination.page = page
}

const resetFilters = () => {
  filters.section = props.initialSection || ''
  filters.folder = ''
  filters.search = ''
  pagination.page = 1
}

const setSectionFilter = (section: MediaSection) => {
  filters.section = filters.section === section ? '' : section
}

const toggleUploadPanel = () => {
  isUploadPanelOpen.value = !isUploadPanelOpen.value
}

const onFilesSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  uploadFiles.value = Array.from(input.files || [])
}

const submitUpload = async () => {
  if (!uploadFiles.value.length) {
    errorMessage.value = 'حداقل یک فایل برای آپلود انتخاب کنید'
    return
  }

  isUploading.value = true
  errorMessage.value = ''
  try {
    const uploaded = await mediaService.uploadMedia({
      files: uploadFiles.value,
      section: uploadForm.section,
      folder: uploadForm.folder || undefined,
      title: uploadForm.title || undefined,
      alt: uploadForm.alt || undefined,
      caption: uploadForm.caption || undefined,
      metadata: {
        uploadedByUserId: currentUploader.value.id,
        uploadedByPhone: currentUploader.value.phone,
        uploadedByName: currentUploader.value.name,
      },
      isPublic: uploadForm.isPublic,
    })
    recentUploads.value = uploaded
    uploadFiles.value = []
    uploadForm.title = ''
    uploadForm.alt = ''
    uploadForm.caption = ''
    pagination.page = 1
    await reload()

    if (props.selectable && uploaded.length) {
      selectedIds.value = props.multiple ? Array.from(new Set([...selectedIds.value, ...uploaded.map((item) => item.id)])) : [uploaded[0].id]
    }
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'آپلود رسانه انجام نشد')
  } finally {
    isUploading.value = false
  }
}

const isImage = (item: MediaItem) => item.mimeType?.startsWith('image/') || item.section === 'image' || item.section === 'gallery'
const isVideo = (item: MediaItem) => item.mimeType?.startsWith('video/') || item.section === 'video'
const isAudio = (item: MediaItem) => item.mimeType?.startsWith('audio/') || item.section === 'audio'
const isPreviewable = (item: MediaItem) => isImage(item) || isVideo(item) || isAudio(item)

const toggleSelection = (item: MediaItem) => {
  if (selectedIds.value.includes(item.id)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== item.id)
    return
  }
  if (props.multiple || selectionMode.value || !props.selectable) {
    selectedIds.value = [...selectedIds.value, item.id]
    return
  }
  selectedIds.value = [item.id]
}

const handleCardClick = (item: MediaItem) => {
  if (selectionMode.value && !props.selectable) {
    toggleSelection(item)
    return
  }
  if (props.selectable) {
    toggleSelection(item)
    return
  }
  if (isPreviewable(item)) {
    previewItem.value = item
    return
  }
  openEditModal(item)
}

const clearSelectionMode = () => {
  selectionMode.value = false
  selectedIds.value = []
}

const startCardPress = (item: MediaItem) => {
  if (props.selectable) return
  cancelCardPress()
  pressedItemId.value = item.id
  pressTimer.value = setTimeout(() => {
    selectionMode.value = true
    if (!selectedIds.value.includes(item.id)) selectedIds.value = [...selectedIds.value, item.id]
  }, LONG_PRESS_MS)
}

const cancelCardPress = () => {
  if (pressTimer.value) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
  pressedItemId.value = null
}

const confirmSelection = () => {
  emit('select', selectedItems.value)
}

const openEditModal = async (item: MediaItem) => {
  try {
    editingItem.value = await mediaService.getMediaById(item.id)
    editForm.title = editingItem.value.title || ''
    editForm.alt = editingItem.value.alt || ''
    editForm.caption = editingItem.value.caption || ''
    editForm.isPublic = editingItem.value.isPublic
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری اطلاعات رسانه انجام نشد')
  }
}

const closeEditModal = () => {
  editingItem.value = null
}

const closePreview = () => {
  previewItem.value = null
}

const saveMetadata = async () => {
  if (!editingItem.value) return
  isSaving.value = true
  try {
    await mediaService.updateMedia(editingItem.value.id, {
      title: editForm.title || undefined,
      alt: editForm.alt || undefined,
      caption: editForm.caption || undefined,
      isPublic: editForm.isPublic,
    })
    closeEditModal()
    await reload()
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'ذخیره اطلاعات رسانه انجام نشد')
  } finally {
    isSaving.value = false
  }
}

const deleteItem = async (item: MediaItem) => {
  const result = await Swal.fire({
    title: 'حذف رسانه',
    text: `آیا از حذف "${item.originalName}" مطمئن هستید؟`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })
  if (!result.isConfirmed) return

  try {
    await mediaService.deleteMedia(item.id)
    selectedIds.value = selectedIds.value.filter((id) => id !== item.id)
    await reload()
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'حذف رسانه انجام نشد')
  }
}

const deleteSelectedItems = async () => {
  if (!selectedIds.value.length) return
  const result = await Swal.fire({
    title: 'حذف گروهی رسانه',
    text: `تعداد ${selectedIds.value.length} فایل حذف شود؟`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف گروهی',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })
  if (!result.isConfirmed) return

  try {
    await Promise.all(selectedIds.value.map((id) => mediaService.deleteMedia(id)))
    clearSelectionMode()
    await reload()
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'حذف گروهی رسانه انجام نشد')
  }
}

const resolveUploaderName = (item: MediaItem) => {
  const metadata = item.metadata as Record<string, unknown> | null | undefined
  return (
    (typeof metadata?.uploadedByName === 'string' && metadata.uploadedByName) ||
    (typeof metadata?.uploadedByPhone === 'string' && metadata.uploadedByPhone) ||
    currentUploader.value.name
  )
}

const formatSize = (size?: number | null) => {
  const safeSize = Number(size || 0)
  if (!safeSize) return '-'
  if (safeSize < 1024) return `${safeSize} B`
  if (safeSize < 1024 * 1024) return `${(safeSize / 1024).toFixed(1)} KB`
  if (safeSize < 1024 * 1024 * 1024) return `${(safeSize / 1024 / 1024).toFixed(1)} MB`
  return `${(safeSize / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const getMediaGlyph = (section: MediaSection) => {
  switch (section) {
    case 'audio':
      return 'A'
    case 'video':
      return 'V'
    case 'model3d':
      return '3D'
    case 'document':
      return 'DOC'
    case 'gallery':
      return 'GAL'
    default:
      return 'IMG'
  }
}

watch(
  () => props.selectedUrls,
  (urls) => {
    if (!urls.length) {
      selectedIds.value = []
      return
    }
    const mappedIds = mediaItems.value.filter((item) => urls.includes(item.url)).map((item) => item.id)
    if (mappedIds.length) selectedIds.value = props.multiple ? mappedIds : mappedIds.slice(0, 1)
  },
  { immediate: true },
)

watch([() => filters.section, () => filters.folder, () => filters.search], () => {
  pagination.page = 1
})

watch(
  () => pagination.page,
  () => {
    loadMedia()
  },
)

watch(
  () => filters.section,
  (value) => {
    if (value) uploadForm.section = value
  },
)

watch(
  [() => filters.section, () => filters.folder, () => filters.search],
  () => {
    loadMedia()
  },
)

onMounted(async () => {
  await reload()
})

onBeforeUnmount(() => {
  cancelCardPress()
})
</script>

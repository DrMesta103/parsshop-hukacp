<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">دسته بندی محصولات</h1>
        <p class="mt-1 text-white-dark">مدیریت درختی دسته‌بندی‌ها با فیلتر، صفحه‌بندی، دیالوگ ایجاد/ویرایش و اتصال به کتابخانه رسانه</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary" @click="openCreateModal">ایجاد دسته بندی</button>
        <router-link to="/admin/products" class="btn btn-outline-secondary">بازگشت به محصولات</router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
      <div class="panel">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label for="category-search">جستجو</label>
              <input id="category-search" v-model.trim="filters.search" type="text" class="form-input" placeholder="نام، اسلاگ یا نوع..." />
            </div>
            <div>
              <label for="filter-type">نوع دسته بندی</label>
              <select id="filter-type" v-model="filters.type" class="form-select">
                <option value="">همه نوع‌ها</option>
                <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }} ({{ item.value }})</option>
              </select>
            </div>
            <div>
              <label for="filter-relation">ساختار</label>
              <select id="filter-relation" v-model="filters.relation" class="form-select">
                <option value="all">همه</option>
                <option value="root">فقط ریشه</option>
                <option value="child">فقط زیرمجموعه</option>
                <option value="branch">دارای زیرمجموعه</option>
                <option value="leaf">بدون زیرمجموعه</option>
              </select>
            </div>
            <div>
              <label for="page-size">تعداد در صفحه</label>
              <select id="page-size" v-model.number="pageSize" class="form-select">
                <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }} ردیف</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلتر</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="expandAll">باز کردن همه</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="collapseAll">بستن همه</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">کل</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ categories.length }}</div>
          </div>
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">پس از فیلتر</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ filteredRows.length }}</div>
          </div>
          <div class="rounded-xl bg-white-light/40 px-3 py-4 dark:bg-[#0e1726]">
            <div class="text-xs text-white-dark">والدها</div>
            <div class="mt-2 text-xl font-bold text-black dark:text-white">{{ branchCount }}</div>
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
            <h2 class="text-lg font-semibold text-black dark:text-white">نمای درختی دسته بندی ها</h2>
            <p class="mt-1 text-sm text-white-dark">برای زیرمجموعه کردن، یک دسته را بکشید و روی دسته مقصد رها کنید.</p>
          </div>
          <div class="text-sm text-white-dark">نمایش {{ pageStartIndex }} تا {{ pageEndIndex }} از {{ filteredRows.length }} ردیف</div>
        </div>
      </div>

      <div
        class="mx-5 mt-5 rounded-xl border border-dashed px-4 py-3 text-sm transition"
        :class="rootDropZoneClass"
        @dragover.prevent="handleRootDragOver"
        @dragleave="handleRootDragLeave"
        @drop.prevent="dropToRoot"
      >
        رها کردن اینجا یعنی انتقال دسته به سطح ریشه
      </div>

      <div v-if="pageErrorMessage" class="px-5 pt-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ pageErrorMessage }}</div>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="paginatedRows.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          دسته بندی مطابق فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover">
          <thead>
            <tr>
              <th>نام</th>
              <th>تصویر</th>
              <th>اسلاگ</th>
              <th>نوع</th>
              <th>والد</th>
              <th>وضعیت درخت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in paginatedRows"
              :key="row.node.id"
              draggable="true"
              class="transition"
              :class="getRowClass(row.node)"
              @dragstart="startDragging(row.node)"
              @dragend="stopDragging"
              @dragover.prevent="handleNodeDragOver(row.node)"
              @dragleave="handleNodeDragLeave(row.node)"
              @drop.prevent="dropOnNode(row.node)"
            >
              <td class="min-w-[280px]">
                <div class="flex items-center gap-3" :style="{ paddingRight: `${row.node.level * 1.25}rem` }">
                  <button
                    v-if="row.node.children.length"
                    type="button"
                    class="grid h-8 w-8 place-content-center rounded-lg border border-white-light text-sm text-black transition hover:border-primary hover:text-primary dark:border-[#1b2e4b] dark:text-white"
                    @click="toggleExpand(row.node.id)"
                  >
                    {{ isExpanded(row.node.id) || forceExpandTree ? '-' : '+' }}
                  </button>
                  <span v-else class="inline-flex h-8 w-8 items-center justify-center text-white-dark">.</span>

                  <div class="min-w-0">
                    <div class="font-semibold text-black dark:text-white">{{ row.node.name }}</div>
                    <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-white-dark">
                      <span>ID: {{ row.node.id }}</span>
                      <span v-if="row.node.children.length">زیرمجموعه: {{ row.node.children.length }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="h-12 w-12 overflow-hidden rounded-xl border border-white-light dark:border-[#1b2e4b]">
                  <img v-if="row.node.original.imageUrl" :src="row.node.original.imageUrl" alt="category" class="h-full w-full object-cover" />
                  <div v-else class="grid h-full w-full place-content-center text-xs text-white-dark">-</div>
                </div>
              </td>
              <td dir="ltr" class="text-left">{{ row.node.slug }}</td>
              <td><span class="badge bg-info/20 text-info">{{ getTypeLabel(row.node.type) }} ({{ row.node.type }})</span></td>
              <td>{{ row.node.parentName || '-' }}</td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="row.node.children.length ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'">
                  {{ row.node.children.length ? 'والد' : row.node.parentId ? 'زیرمجموعه' : 'ریشه' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-center gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="startEdit(row.node.original)">ویرایش</button>
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteCategory(row.node.id)">حذف</button>
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
            <h2 class="text-xl font-semibold text-black dark:text-white">{{ editingCategoryId ? 'ویرایش دسته بندی' : 'ایجاد دسته بندی' }}</h2>
            <p class="mt-1 text-sm text-white-dark">نام، اسلاگ، تصویر و موقعیت دسته در درخت را مدیریت کنید.</p>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeModal">بستن</button>
        </div>

        <form class="space-y-5" @submit.prevent="submitCategory">
          <div>
            <label for="modal-category-name">نام دسته بندی</label>
            <input id="modal-category-name" v-model.trim="form.name" type="text" class="form-input" placeholder="مثلاً بلبرینگ صنعتی" />
          </div>

          <div>
            <label for="modal-category-slug">اسلاگ انگلیسی</label>
            <div class="flex gap-2">
              <input
                id="modal-category-slug"
                v-model="form.slug"
                type="text"
                dir="ltr"
                inputmode="text"
                class="form-input"
                placeholder="bolbering-sanati"
                @input="sanitizeSlugInput"
              />
              <button type="button" class="btn btn-outline-secondary !px-4" @click="generateSlug">تولید</button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="modal-category-type">نوع</label>
              <select id="modal-category-type" v-model="form.type" class="form-select" @change="handleTypeChange">
                <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }} ({{ item.value }})</option>
              </select>
            </div>
            <div>
              <label for="modal-category-parent">والد</label>
              <select id="modal-category-parent" v-model="form.parentId" class="form-select">
                <option value="">بدون والد</option>
                <option v-for="option in parentOptionRows" :key="option.id" :value="option.id">{{ option.label }}</option>
              </select>
            </div>
          </div>

          <div class="rounded-2xl border border-white-light p-4 dark:border-[#1b2e4b]">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-black dark:text-white">تصویر دسته‌بندی</h3>
                <p class="mt-1 text-xs text-white-dark">یا از Media Library انتخاب کنید یا فایل جدید آپلود کنید.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div class="overflow-hidden rounded-xl border border-dashed border-white-light bg-white-light/20 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <img v-if="categoryImagePreview" :src="categoryImagePreview" alt="category" class="h-44 w-full object-cover" />
                <div v-else class="grid h-44 place-content-center text-sm text-white-dark">تصویری انتخاب نشده است</div>
              </div>

              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="isImagePickerOpen = true">انتخاب از رسانه</button>
                  <label class="btn btn-outline-secondary btn-sm cursor-pointer">
                    آپلود جدید
                    <input type="file" accept="image/*" class="hidden" @change="onCategoryImageSelected" />
                  </label>
                  <button v-if="categoryImagePreview" type="button" class="btn btn-outline-danger btn-sm" @click="clearCategoryImage">حذف تصویر</button>
                </div>

                <div class="rounded-xl bg-white-light/40 px-4 py-3 text-sm text-white-dark dark:bg-[#060818]">
                  <div>منبع فعلی: {{ categoryImageSourceLabel }}</div>
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
              {{ isSubmitting ? 'در حال ذخیره...' : editingCategoryId ? 'ذخیره تغییرات' : 'ایجاد دسته بندی' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" :disabled="isSubmitting" @click="closeModal">انصراف</button>
          </div>
        </form>
      </div>
    </div>

    <MediaPickerModal
      :open="isImagePickerOpen"
      title="انتخاب تصویر دسته‌بندی"
      description="یک تصویر موجود را انتخاب کنید یا تصویر جدید آپلود کنید."
      :allowed-sections="['image']"
      initial-section="image"
      :selected-urls="form.existingImageUrl ? [form.existingImageUrl] : []"
      @close="isImagePickerOpen = false"
      @select="handleCategoryMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import MediaPickerModal from '@/components/admin/media/MediaPickerModal.vue'
import { useMeta } from '@/composables/use-meta'
import { extractApiErrorMessage } from '@/services/admin-api'
import categoryService from '@/services/category-service'
import type { MediaItem } from '@/types/media'
import type { Category, CategoryPayload, ProductType } from '@/types/product'
import { generateEnglishSlug, normalizeEnglishSlug, productTypeLabelMap, productTypeOptions } from '@/utils/product'

useMeta({ title: 'دسته بندی محصولات' })

interface CategoryNode {
  id: string
  name: string
  slug: string
  type: ProductType
  parentId: string
  parentName: string
  children: CategoryNode[]
  level: number
  original: Category
}

interface VisibleRow {
  node: CategoryNode
}

const categories = ref<Category[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const isImagePickerOpen = ref(false)
const editingCategoryId = ref('')
const formErrorMessage = ref('')
const pageErrorMessage = ref('')
const expandedIds = ref<string[]>([])
const draggedCategoryId = ref('')
const activeDropTargetId = ref('')
const isRootDropTarget = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 30, 50]
const categoryImagePreview = ref('')

const form = reactive<CategoryPayload>({
  name: '',
  slug: '',
  type: 'Industrial',
  parentId: '',
  existingImageUrl: '',
  image: null,
})

const filters = reactive<{
  search: string
  type: ProductType | ''
  relation: 'all' | 'root' | 'child' | 'branch' | 'leaf'
}>({
  search: '',
  type: '',
  relation: 'all',
})

const englishSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const getTypeLabel = (type: ProductType) => productTypeLabelMap[type]

const buildCategoryTree = (items: Category[]) => {
  const nodeMap = new Map<string, CategoryNode>()

  items.forEach((category) => {
    nodeMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      parentId: category.parent?.id || '',
      parentName: category.parent?.name || '',
      children: [],
      level: 0,
      original: category,
    })
  })

  const roots: CategoryNode[] = []
  nodeMap.forEach((node) => {
    const parent = node.parentId ? nodeMap.get(node.parentId) : null
    if (parent) {
      parent.children.push(node)
      node.parentName = parent.name
    } else {
      roots.push(node)
      node.parentId = ''
      node.parentName = ''
    }
  })

  const sortNodes = (nodes: CategoryNode[], level = 0) => {
    nodes.sort((first, second) => first.name.localeCompare(second.name, 'fa'))
    nodes.forEach((node) => {
      node.level = level
      sortNodes(node.children, level + 1)
    })
  }

  sortNodes(roots)
  return roots
}

const categoryTree = computed(() => buildCategoryTree(categories.value))
const flatNodeList = computed(() => {
  const result: CategoryNode[] = []
  const visit = (nodes: CategoryNode[]) => {
    nodes.forEach((node) => {
      result.push(node)
      visit(node.children)
    })
  }
  visit(categoryTree.value)
  return result
})

const nodeLookup = computed(() => new Map(flatNodeList.value.map((node) => [node.id, node])))
const branchCount = computed(() => flatNodeList.value.filter((node) => node.children.length > 0).length)
const forceExpandTree = computed(() => Boolean(filters.search.trim()))
const categoryImageSourceLabel = computed(() => {
  if (form.image) return 'فایل جدید'
  if (form.existingImageUrl) return 'کتابخانه رسانه / تصویر موجود'
  return 'بدون تصویر'
})

const initializeExpandedState = () => {
  const branchIds = flatNodeList.value.filter((node) => node.children.length > 0).map((node) => node.id)
  const branchIdSet = new Set(branchIds)
  expandedIds.value = expandedIds.value.filter((id) => branchIdSet.has(id))
  if (expandedIds.value.length === 0) {
    expandedIds.value = branchIds
  }
}

const toggleExpand = (id: string) => {
  expandedIds.value = expandedIds.value.includes(id)
    ? expandedIds.value.filter((item) => item !== id)
    : [...expandedIds.value, id]
}

const isExpanded = (id: string) => expandedIds.value.includes(id)
const expandAll = () => {
  expandedIds.value = flatNodeList.value.filter((node) => node.children.length > 0).map((node) => node.id)
}
const collapseAll = () => {
  expandedIds.value = []
}

const matchesRelation = (node: CategoryNode) => {
  switch (filters.relation) {
    case 'root':
      return !node.parentId
    case 'child':
      return Boolean(node.parentId)
    case 'branch':
      return node.children.length > 0
    case 'leaf':
      return node.children.length === 0
    default:
      return true
  }
}

const matchesFilters = (node: CategoryNode) => {
  const query = filters.search.trim().toLowerCase()
  const searchableText = [node.name, node.slug, node.type, getTypeLabel(node.type)].join(' ').toLowerCase()
  if (filters.type && node.type !== filters.type) return false
  if (!matchesRelation(node)) return false
  return !query || searchableText.includes(query)
}

const filterTree = (nodes: CategoryNode[]): CategoryNode[] =>
  nodes.reduce<CategoryNode[]>((result, node) => {
    const filteredChildren = filterTree(node.children)
    if (matchesFilters(node) || filteredChildren.length > 0) {
      result.push({ ...node, children: filteredChildren })
    }
    return result
  }, [])

const filteredTree = computed(() => filterTree(categoryTree.value))
const filteredRows = computed<VisibleRow[]>(() => {
  const rows: VisibleRow[] = []
  const visit = (nodes: CategoryNode[]) => {
    nodes.forEach((node) => {
      rows.push({ node })
      if (node.children.length && (forceExpandTree.value || isExpanded(node.id))) {
        visit(node.children)
      }
    })
  }
  visit(filteredTree.value)
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const paginatedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))
const pageStartIndex = computed(() => (filteredRows.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0))
const pageEndIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredRows.value.length))
const pageNumbers = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let page = start; page <= end; page += 1) pages.push(page)
  return pages
})

const isDescendant = (sourceId: string, possibleDescendantId: string): boolean => {
  const source = nodeLookup.value.get(sourceId)
  if (!source) return false
  const stack = [...source.children]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    if (current.id === possibleDescendantId) return true
    stack.push(...current.children)
  }
  return false
}

const invalidParentIds = computed(() => {
  if (!editingCategoryId.value) return new Set<string>()
  const result = new Set<string>([editingCategoryId.value])
  const node = nodeLookup.value.get(editingCategoryId.value)
  if (!node) return result
  const stack = [...node.children]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    result.add(current.id)
    stack.push(...current.children)
  }
  return result
})

const parentOptionRows = computed(() => {
  const rows: Array<{ id: string; label: string }> = []
  const visit = (nodes: CategoryNode[], depth = 0) => {
    nodes.forEach((node) => {
      if (node.type === form.type && !invalidParentIds.value.has(node.id)) {
        rows.push({ id: node.id, label: `${'-- '.repeat(depth)}${node.name}` })
      }
      visit(node.children, depth + 1)
    })
  }
  visit(categoryTree.value)
  return rows
})

const rootDropZoneClass = computed(() => (isRootDropTarget.value ? 'border-primary bg-primary/10 text-primary' : 'border-white-light text-white-dark dark:border-[#1b2e4b]'))
const getRowClass = (node: CategoryNode) => (activeDropTargetId.value === node.id ? 'bg-primary/10' : draggedCategoryId.value === node.id ? 'opacity-50' : '')

const sanitizeSlugInput = () => {
  form.slug = normalizeEnglishSlug(form.slug || '')
}

const generateSlug = () => {
  form.slug = generateEnglishSlug(form.name)
}

const handleTypeChange = () => {
  const selectedParent = form.parentId ? nodeLookup.value.get(form.parentId) : null
  if (selectedParent && selectedParent.type !== form.type) {
    form.parentId = ''
  }
}

const resetForm = () => {
  editingCategoryId.value = ''
  form.name = ''
  form.slug = ''
  form.type = 'Industrial'
  form.parentId = ''
  form.existingImageUrl = ''
  form.image = null
  categoryImagePreview.value = ''
  formErrorMessage.value = ''
}

const closeModal = () => {
  isModalOpen.value = false
  isImagePickerOpen.value = false
  resetForm()
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const clearCategoryImage = () => {
  form.image = null
  form.existingImageUrl = ''
  categoryImagePreview.value = ''
}

const onCategoryImageSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  form.image = file
  form.existingImageUrl = ''
  categoryImagePreview.value = URL.createObjectURL(file)
}

const handleCategoryMediaSelect = (items: MediaItem[]) => {
  const selected = items[0]
  if (!selected) return
  form.image = null
  form.existingImageUrl = selected.url
  categoryImagePreview.value = selected.url
  isImagePickerOpen.value = false
}

const resetFilters = () => {
  filters.search = ''
  filters.type = ''
  filters.relation = 'all'
  currentPage.value = 1
}

const startEdit = (category: Category) => {
  editingCategoryId.value = category.id
  form.name = category.name
  form.slug = normalizeEnglishSlug(category.slug)
  form.type = category.type
  form.parentId = category.parent?.id || ''
  form.existingImageUrl = category.imageUrl || ''
  form.image = null
  categoryImagePreview.value = category.imageUrl || ''
  formErrorMessage.value = ''
  isModalOpen.value = true
}

const loadCategories = async () => {
  isLoading.value = true
  pageErrorMessage.value = ''
  try {
    categories.value = await categoryService.getCategories()
    initializeExpandedState()
  } catch (error) {
    pageErrorMessage.value = extractApiErrorMessage(error, 'بارگذاری دسته بندی ها انجام نشد')
  } finally {
    isLoading.value = false
  }
}

const submitCategory = async () => {
  formErrorMessage.value = ''
  form.slug = normalizeEnglishSlug(form.slug || generateEnglishSlug(form.name))

  if (!form.name.trim() || !form.slug.trim()) {
    formErrorMessage.value = 'نام و اسلاگ دسته بندی الزامی است'
    return
  }
  if (!englishSlugPattern.test(form.slug)) {
    formErrorMessage.value = 'اسلاگ باید فقط با حروف انگلیسی کوچک، عدد و خط فاصله وارد شود'
    return
  }
  if (form.parentId && invalidParentIds.value.has(form.parentId)) {
    formErrorMessage.value = 'والد انتخاب شده معتبر نیست'
    return
  }
  if (form.parentId) {
    const selectedParent = nodeLookup.value.get(form.parentId)
    if (!selectedParent || selectedParent.type !== form.type) {
      formErrorMessage.value = 'والد انتخاب شده باید از همان نوع دسته بندی باشد'
      return
    }
  }

  isSubmitting.value = true
  try {
    const payload: CategoryPayload = {
      name: form.name.trim(),
      slug: form.slug,
      type: form.type,
      parentId: form.parentId || undefined,
      existingImageUrl: form.image ? '' : form.existingImageUrl || '',
      image: form.image || null,
    }

    if (editingCategoryId.value) {
      await categoryService.updateCategory(editingCategoryId.value, payload)
    } else {
      await categoryService.createCategory(payload)
    }

    isModalOpen.value = false
    resetForm()
    await loadCategories()
  } catch (error) {
    formErrorMessage.value = extractApiErrorMessage(error, 'ذخیره دسته بندی انجام نشد')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (id: string) => {
  const result = await Swal.fire({
    title: 'حذف دسته بندی',
    text: 'آیا از حذف این دسته بندی مطمئن هستید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'حذف',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
  })

  if (!result.isConfirmed) return

  try {
    await categoryService.deleteCategory(id)
    if (editingCategoryId.value === id) closeModal()
    await loadCategories()
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'حذف دسته بندی انجام نشد'),
      icon: 'error',
    })
  }
}

const canMoveCategory = (categoryId: string, newParentId: string) => {
  const current = nodeLookup.value.get(categoryId)
  if (!current || categoryId === newParentId) return false
  if (newParentId) {
    const parent = nodeLookup.value.get(newParentId)
    if (!parent || parent.type !== current.type || isDescendant(categoryId, newParentId)) return false
  }
  return current.parentId !== newParentId
}

const moveCategory = async (categoryId: string, newParentId: string) => {
  if (!canMoveCategory(categoryId, newParentId)) {
    stopDragging()
    return
  }
  try {
    await categoryService.updateCategory(categoryId, { parentId: newParentId || undefined })
    if (editingCategoryId.value === categoryId) form.parentId = newParentId
    await loadCategories()
  } catch (error) {
    await Swal.fire({
      title: 'خطا',
      text: extractApiErrorMessage(error, 'انتقال دسته بندی انجام نشد'),
      icon: 'error',
    })
  } finally {
    stopDragging()
  }
}

const startDragging = (node: CategoryNode) => {
  draggedCategoryId.value = node.id
}
const stopDragging = () => {
  draggedCategoryId.value = ''
  activeDropTargetId.value = ''
  isRootDropTarget.value = false
}
const handleNodeDragOver = (node: CategoryNode) => {
  if (!draggedCategoryId.value) return
  isRootDropTarget.value = false
  activeDropTargetId.value = canMoveCategory(draggedCategoryId.value, node.id) ? node.id : ''
}
const handleNodeDragLeave = (node: CategoryNode) => {
  if (activeDropTargetId.value === node.id) activeDropTargetId.value = ''
}
const dropOnNode = async (node: CategoryNode) => {
  if (!draggedCategoryId.value) return
  await moveCategory(draggedCategoryId.value, node.id)
}
const handleRootDragOver = () => {
  if (!draggedCategoryId.value) return
  const current = nodeLookup.value.get(draggedCategoryId.value)
  activeDropTargetId.value = ''
  isRootDropTarget.value = Boolean(current?.parentId)
}
const handleRootDragLeave = () => {
  isRootDropTarget.value = false
}
const dropToRoot = async () => {
  if (!draggedCategoryId.value) return
  await moveCategory(draggedCategoryId.value, '')
}

watch([() => filters.search, () => filters.type, () => filters.relation, pageSize], () => {
  currentPage.value = 1
})
watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value
})

onMounted(loadCategories)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="btn btn-primary btn-sm" :disabled="isLoading" @click="addRow">افزودن ویژگی</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isLoading" @click="$emit('request-create')">ساخت ویژگی reusable</button>
      <span class="text-xs text-white-dark">ویژگی‌ها از API خوانده می‌شوند و هر ردیف فقط یک ویژگی را مدیریت می‌کند.</span>
    </div>

    <div class="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-6 text-primary dark:border-primary/20">
      دو ویژگی اول، در لیست محصولات سایت نمایش داده می‌شوند. برای تعیین ترتیب نمایش، ردیف‌ها را با دکمه‌های بالا و پایین جابه‌جا کنید.
    </div>

    <div v-if="isLoading" class="grid min-h-[180px] place-content-center rounded-2xl border border-dashed border-white-light dark:border-[#1b2e4b]">
      <span class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
    </div>

    <div v-else-if="!rows.length" class="rounded-2xl border border-dashed border-white-light px-4 py-8 text-center text-sm text-white-dark dark:border-[#1b2e4b]">
      هنوز ویژگی‌ای به محصول اضافه نشده است.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(row, index) in rows"
        :key="row.id"
        class="overflow-hidden rounded-2xl border border-white-light/80 bg-white-light/20 dark:border-[#1b2e4b] dark:bg-[#060818]"
      >
        <button
          type="button"
          class="flex w-full items-start justify-between gap-3 px-4 py-4 text-right transition hover:bg-white/40 dark:hover:bg-white/5"
          @click="toggleRow(row.id)"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="min-h-[1.25rem] text-sm font-semibold text-black dark:text-white">{{ getAttribute(row.attributeId)?.name || '' }}</div>
              <span class="badge bg-dark/10 text-dark dark:bg-white/10 dark:text-white">ترتیب {{ row.displayOrder }}</span>
              <span v-if="index < 2" class="badge bg-success/15 text-success">نمایش در لیست</span>
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-white-dark">
              <span v-if="getAttribute(row.attributeId)?.name" class="truncate">{{ getAttribute(row.attributeId)?.name }}</span>
              <span v-if="summaryUnit(row)">واحد: {{ summaryUnit(row) }}</span>
              <span v-if="summaryValue(row)">مقدار: {{ summaryValue(row) }}</span>
            </div>
          </div>
          <IconCaretDown class="mt-1 h-4 w-4 shrink-0 transition" :class="isRowOpen(row.id) ? 'rotate-180 text-primary' : 'text-white-dark'" />
        </button>

        <div v-if="isRowOpen(row.id)" class="border-t border-white-light/80 px-4 py-4 dark:border-[#1b2e4b]">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="text-xs text-white-dark">{{ getAttribute(row.attributeId)?.slug || '' }}</div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="btn btn-outline-secondary btn-sm !px-2.5 text-[11px]" :disabled="index === 0" @click.stop="moveRow(index, -1)">↑</button>
              <button type="button" class="btn btn-outline-secondary btn-sm !px-2.5 text-[11px]" :disabled="index === rows.length - 1" @click.stop="moveRow(index, 1)">↓</button>
              <button
                type="button"
                class="grid h-8 w-8 place-content-center rounded-lg border border-danger/20 text-danger transition hover:bg-danger/10"
                @click.stop="removeRow(index)"
              >
                <IconTrash class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <label class="mb-2 block">ویژگی reusable</label>
              <select v-model="row.attributeId" class="form-select" @change="onAttributeChange(row)">
                <option value="">انتخاب ویژگی</option>
                <option v-for="attribute in reusableAttributes" :key="attribute.id" :value="attribute.id">
                  {{ attribute.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-2 block">واحد جایگزین</label>
              <input v-model.trim="row.overrideUnit" type="text" class="form-input" :placeholder="getAttribute(row.attributeId)?.unit || 'مثلاً mm'" />
            </div>
          </div>

          <div v-if="getAttribute(row.attributeId)" class="mt-4 space-y-4">
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="badge bg-primary/15 text-primary">{{ dataTypeLabelMap[getAttribute(row.attributeId)!.dataType] }}</span>
              <span v-if="getAttribute(row.attributeId)?.unit" class="badge bg-success/15 text-success">{{ getAttribute(row.attributeId)?.unit }}</span>
              <span v-if="getAttribute(row.attributeId)?.isFilterable" class="badge bg-info/15 text-info">فیلترپذیر</span>
              <span v-if="getAttribute(row.attributeId)?.isVisible" class="badge bg-warning/15 text-warning">قابل نمایش</span>
            </div>

            <div v-if="getAttribute(row.attributeId)?.dataType === 'text'">
              <label class="mb-2 block">مقدار</label>
              <input v-model.trim="row.valueText" type="text" class="form-input" placeholder="مقدار متنی" />
            </div>

            <div v-else-if="getAttribute(row.attributeId)?.dataType === 'number'">
              <label class="mb-2 block">مقدار عددی</label>
              <input v-model="row.valueNumber" type="number" step="0.01" class="form-input" placeholder="0" />
            </div>

            <div v-else-if="getAttribute(row.attributeId)?.dataType === 'boolean'" class="flex items-center gap-3 rounded-xl border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <input :id="`attribute-bool-${row.id}`" v-model="row.valueBoolean" type="checkbox" class="form-checkbox outline-primary" />
              <label :for="`attribute-bool-${row.id}`" class="!mb-0">فعال / صحیح</label>
            </div>

            <div v-else-if="getAttribute(row.attributeId)?.dataType === 'select'">
              <label class="mb-2 block">انتخاب مقدار</label>
              <select v-model="row.valueText" class="form-select">
                <option value="">یک گزینه را انتخاب کنید</option>
                <option v-for="option in getAttribute(row.attributeId)?.options || []" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div v-else-if="getAttribute(row.attributeId)?.dataType === 'multiselect'">
              <label class="mb-2 block">انتخاب چندتایی</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in getAttribute(row.attributeId)?.options || []"
                  :key="option.value"
                  type="button"
                  class="rounded-xl border px-3 py-2 text-sm transition"
                  :class="row.valueMultiText.includes(option.value) ? 'border-primary bg-primary/10 text-primary' : 'border-white-light text-white-dark dark:border-[#1b2e4b]'"
                  @click="toggleMultiValue(row, option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div v-else-if="getAttribute(row.attributeId)?.dataType === 'json'">
              <label class="mb-2 block">مقدار JSON</label>
              <textarea
                v-model.trim="row.valueJson"
                rows="5"
                class="form-textarea font-mono text-sm"
                placeholder='{"key":"value"}'
              ></textarea>
            </div>
          </div>

          <div v-else class="mt-4 rounded-xl border border-dashed border-white-light px-4 py-4 text-sm text-white-dark dark:border-[#1b2e4b]">
            ابتدا ویژگی reusable را انتخاب کنید.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconTrash from '@/components/icon/icon-trash.vue'
import type { ReusableProductAttribute } from '@/types/product'
import type { ProductAttributeFormRow } from '@/types/admin-product-create'

const rows = defineModel<ProductAttributeFormRow[]>({ required: true })

const props = defineProps<{
  reusableAttributes: ReusableProductAttribute[]
  isLoading?: boolean
}>()

defineEmits<{
  (event: 'request-create'): void
}>()

const openRowId = ref('')

const dataTypeLabelMap = {
  text: 'متنی',
  number: 'عددی',
  boolean: 'بولی',
  select: 'تک‌انتخابی',
  multiselect: 'چندانتخابی',
  json: 'JSON',
} as const

const syncDisplayOrders = () => {
  rows.value.forEach((row, index) => {
    row.displayOrder = index
  })
}

const getAttribute = (attributeId: string) => {
  return props.reusableAttributes.find((attribute) => attribute.id === attributeId)
}

const isRowOpen = (rowId: string) => openRowId.value === rowId

const toggleRow = (rowId: string) => {
  openRowId.value = openRowId.value === rowId ? '' : rowId
}

const createEmptyRow = (): ProductAttributeFormRow => ({
  id: crypto.randomUUID(),
  attributeId: '',
  displayOrder: rows.value.length,
  valueText: '',
  valueNumber: '',
  valueBoolean: false,
  valueJson: '',
  valueMultiText: [],
  overrideUnit: '',
})

const summaryUnit = (row: ProductAttributeFormRow) => row.overrideUnit || getAttribute(row.attributeId)?.unit || ''

const summaryValue = (row: ProductAttributeFormRow) => {
  const attribute = getAttribute(row.attributeId)
  if (!attribute) return ''

  switch (attribute.dataType) {
    case 'number':
      return row.valueNumber
    case 'boolean':
      return row.valueBoolean ? 'بله' : 'خیر'
    case 'multiselect':
      return row.valueMultiText.join('، ')
    case 'json':
      return row.valueJson.trim() ? 'JSON' : ''
    default:
      return row.valueText
  }
}

const addRow = () => {
  const nextRow = createEmptyRow()
  rows.value.push(nextRow)
  syncDisplayOrders()
  openRowId.value = nextRow.id
}

const removeRow = (index: number) => {
  const removed = rows.value[index]
  rows.value.splice(index, 1)
  syncDisplayOrders()

  if (!rows.value.length) {
    openRowId.value = ''
    return
  }

  if (removed && openRowId.value === removed.id) {
    openRowId.value = rows.value[Math.min(index, rows.value.length - 1)].id
  }
}

const moveRow = (index: number, direction: -1 | 1) => {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= rows.value.length) return

  const [target] = rows.value.splice(index, 1)
  rows.value.splice(nextIndex, 0, target)
  syncDisplayOrders()
  openRowId.value = target.id
}

const resetRowValues = (row: ProductAttributeFormRow) => {
  row.valueText = ''
  row.valueNumber = ''
  row.valueBoolean = false
  row.valueJson = ''
  row.valueMultiText = []
}

const onAttributeChange = (row: ProductAttributeFormRow) => {
  resetRowValues(row)
  openRowId.value = row.id
}

const toggleMultiValue = (row: ProductAttributeFormRow, value: string) => {
  if (row.valueMultiText.includes(value)) {
    row.valueMultiText = row.valueMultiText.filter((item) => item !== value)
    return
  }

  row.valueMultiText = [...row.valueMultiText, value]
}

if (rows.value.length && !openRowId.value) {
  openRowId.value = rows.value[0].id
}

watch(
  () => rows.value.map((row) => row.id),
  (ids) => {
    if (!ids.length) {
      openRowId.value = ''
      return
    }

    if (!ids.includes(openRowId.value)) {
      openRowId.value = ids[0]
    }
  },
  { immediate: true },
)
</script>

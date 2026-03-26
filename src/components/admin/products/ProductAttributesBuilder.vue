<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="btn btn-primary btn-sm" :disabled="isLoading" @click="addRow">افزودن ویژگی</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isLoading" @click="$emit('request-create')">ساخت ویژگی reusable</button>
      <span class="text-xs text-white-dark">ویژگی‌ها از API خوانده می‌شوند و هر ردیف فقط یک ویژگی را مدیریت می‌کند.</span>
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
        class="rounded-2xl border border-white-light/80 bg-white-light/20 p-4 dark:border-[#1b2e4b] dark:bg-[#060818]"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <div class="text-sm font-semibold text-black dark:text-white">ویژگی {{ index + 1 }}</div>
            <div class="text-xs text-white-dark">{{ getAttribute(row.attributeId)?.slug || 'ویژگی انتخاب نشده' }}</div>
          </div>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="removeRow(index)">حذف</button>
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
</template>

<script setup lang="ts">
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

const dataTypeLabelMap = {
  text: 'متنی',
  number: 'عددی',
  boolean: 'بولی',
  select: 'تک‌انتخابی',
  multiselect: 'چندانتخابی',
  json: 'JSON',
} as const

const createEmptyRow = (): ProductAttributeFormRow => ({
  id: crypto.randomUUID(),
  attributeId: '',
  valueText: '',
  valueNumber: '',
  valueBoolean: false,
  valueJson: '',
  valueMultiText: [],
  overrideUnit: '',
})

const addRow = () => {
  rows.value.push(createEmptyRow())
}

const removeRow = (index: number) => {
  rows.value.splice(index, 1)
}

const getAttribute = (attributeId: string) => {
  return props.reusableAttributes.find((attribute) => attribute.id === attributeId)
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
}

const toggleMultiValue = (row: ProductAttributeFormRow, value: string) => {
  if (row.valueMultiText.includes(value)) {
    row.valueMultiText = row.valueMultiText.filter((item) => item !== value)
    return
  }

  row.valueMultiText = [...row.valueMultiText, value]
}
</script>

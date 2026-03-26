<template>
  <div
    class="rich-editor rounded-[22px] border border-white-light dark:border-[#1b2e4b]"
    :style="{ '--editor-height': `${editorHeightPx}px` }"
  >
    <QuillEditor
      v-model:content="content"
      content-type="html"
      theme="snow"
      :toolbar="toolbarOptions"
      class="bg-transparent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(
  defineProps<{
    maxLines?: number
  }>(),
  {
    maxLines: 16,
  },
)

const model = defineModel<string>({ required: true })

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
]

const content = computed({
  get: () => model.value || '',
  set: (value: string | undefined) => {
    model.value = value || ''
  },
})

const editorHeightPx = computed(() => props.maxLines * 28 + 24)
</script>

<style scoped>
:deep(.ql-toolbar.ql-snow) {
  border: 0;
  border-bottom: 1px solid rgb(224 230 237 / 1);
  background: rgb(248 250 252 / 0.65);
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
}

:deep(.ql-container.ql-snow) {
  border: 0;
  font-size: 14px;
  height: var(--editor-height);
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
}

:deep(.ql-editor) {
  direction: rtl;
  text-align: right;
  line-height: 2;
  height: 100%;
  overflow-y: auto;
  color: inherit;
  font-family: 'YekanBakhFaNum', 'YekanBakh', sans-serif;
}

:deep(.ql-toolbar) {
  font-family: 'YekanBakhFaNum', 'YekanBakh', sans-serif;
}

:deep(.ql-editor.ql-blank::before) {
  right: 16px;
  left: auto;
  color: rgb(136 142 168 / 1);
  font-style: normal;
}

:deep(.ql-snow .ql-picker),
:deep(.ql-snow .ql-stroke) {
  color: inherit;
  stroke: currentColor;
}

:deep(.ql-snow .ql-fill) {
  fill: currentColor;
}

:deep(.dark .ql-toolbar.ql-snow) {
  border-bottom-color: #1b2e4b;
  background: rgb(17 24 39 / 0.38);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

:deep(.dark .ql-toolbar.ql-snow .ql-picker) {
  color: rgb(148 163 184 / 1);
}

:deep(.dark .ql-toolbar.ql-snow .ql-stroke) {
  stroke: rgb(148 163 184 / 1);
}

:deep(.dark .ql-toolbar.ql-snow .ql-fill) {
  fill: rgb(148 163 184 / 1);
}

:deep(.dark .ql-toolbar.ql-snow .ql-picker-options) {
  background: rgb(15 23 42 / 0.92);
  border-color: #1b2e4b;
}

:deep(.dark .ql-toolbar.ql-snow button:hover .ql-stroke),
:deep(.dark .ql-toolbar.ql-snow button.ql-active .ql-stroke) {
  stroke: rgb(203 213 225 / 1);
}

:deep(.dark .ql-toolbar.ql-snow button:hover .ql-fill),
:deep(.dark .ql-toolbar.ql-snow button.ql-active .ql-fill) {
  fill: rgb(203 213 225 / 1);
}

:deep(.dark .ql-toolbar.ql-snow .ql-picker:hover),
:deep(.dark .ql-toolbar.ql-snow .ql-picker.ql-expanded),
:deep(.dark .ql-toolbar.ql-snow .ql-picker-label.ql-active),
:deep(.dark .ql-toolbar.ql-snow .ql-picker-item.ql-selected) {
  color: rgb(203 213 225 / 1);
}

:deep(.dark .ql-container.ql-snow) {
  background: transparent;
}
</style>

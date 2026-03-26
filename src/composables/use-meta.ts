import { useHead } from '@vueuse/head'

export const useMeta = ({ title }: { title: string }) => {
  useHead({
    title,
  })
}

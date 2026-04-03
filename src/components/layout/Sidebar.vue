<template>
  <div :class="{ 'dark text-white-dark': store.semidark }">
    <nav class="sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
      <div class="h-full bg-white dark:bg-[#0e1726]">
        <div class="flex items-center justify-between px-4 py-3">
          <router-link to="/admin/dashboard" class="main-logo flex shrink-0 items-center">
            <span class="grid h-9 w-9 place-content-center rounded-xl bg-primary text-lg font-bold text-white">P</span>
            <span class="font-semibold align-middle text-2xl ltr:ml-2 rtl:mr-2 dark:text-white-light">ParsShop</span>
          </router-link>
          <button
            type="button"
            class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary dark:text-white-light dark:hover:bg-dark-light/10"
            @click="store.toggleSidebar()"
          >
            <IconCaretsDown class="m-auto rotate-90" />
          </button>
        </div>

        <perfect-scrollbar :options="{ swipeEasing: true, wheelPropagation: false }" class="relative h-[calc(100vh-80px)]">
          <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
            <li class="menu nav-item">
              <router-link to="/admin/dashboard" class="nav-link group" :class="{ active: isRouteActive('/admin/dashboard') }" @click="toggleMobileMenu">
                <div class="flex items-center">
                  <IconLayoutGrid class="shrink-0 group-hover:!text-primary" />
                  <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">داشبورد</span>
                </div>
              </router-link>
            </li>

            <template v-for="section in menuSections" :key="section.title">
              <h2 class="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus class="hidden h-5 w-4 flex-none" />
                <span>{{ section.title }}</span>
              </h2>

              <li v-for="item in section.items" :key="item.key" class="menu nav-item">
                <button
                  type="button"
                  class="nav-link group flex w-full items-center justify-between"
                  :class="{ active: isItemActive(item) }"
                  @click="toggleDropdown(item.key)"
                >
                  <div class="flex items-center">
                    <component :is="item.icon" class="shrink-0 group-hover:!text-primary" />
                    <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{ item.label }}</span>
                  </div>
                  <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== item.key }">
                    <IconCaretDown />
                  </div>
                </button>

                <VueCollapsible :isOpen="activeDropdown === item.key">
                  <ul class="sub-menu text-gray-500">
                    <li v-for="child in item.children" :key="child.to">
                      <router-link :to="child.to" @click="toggleMobileMenu">{{ child.label }}</router-link>
                    </li>
                  </ul>
                </VueCollapsible>
              </li>
            </template>
          </ul>
        </perfect-scrollbar>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import VueCollapsible from 'vue-height-collapsible/vue3'
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconMinus from '@/components/icon/icon-minus.vue'
import IconLayoutGrid from '@/components/icon/icon-layout-grid.vue'
import IconShoppingBag from '@/components/icon/icon-shopping-bag.vue'
import IconShoppingCart from '@/components/icon/icon-shopping-cart.vue'
import IconBox from '@/components/icon/icon-box.vue'
import IconUsers from '@/components/icon/icon-users.vue'
import IconDollarSign from '@/components/icon/icon-dollar-sign.vue'
import IconMail from '@/components/icon/icon-mail.vue'
import IconNotes from '@/components/icon/icon-notes.vue'
import IconChartSquare from '@/components/icon/icon-chart-square.vue'
import IconSettings from '@/components/icon/icon-settings.vue'
import IconClipboardText from '@/components/icon/icon-clipboard-text.vue'
import IconGallery from '@/components/icon/icon-gallery.vue'

type MenuChild = {
  label: string
  to: string
}

type MenuItem = {
  key: string
  label: string
  icon: unknown
  children: MenuChild[]
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

const route = useRoute()
const store = useAppStore()
const activeDropdown = ref<string | null>(null)

const menuSections: MenuSection[] = [
  {
    title: 'فروشگاه',
    items: [
      {
        key: 'orders',
        label: 'سفارشات',
        icon: IconShoppingCart,
        children: [
          { label: 'همه سفارشات', to: '/admin/orders' },
          { label: 'در انتظار پرداخت', to: '/admin/orders/pending-payment' },
          { label: 'در حال پردازش', to: '/admin/orders/processing' },
          { label: 'مرجوعی و لغو شده', to: '/admin/orders/returns' },
        ],
      },
      {
        key: 'products',
        label: 'محصولات',
        icon: IconShoppingBag,
        children: [
          { label: 'همه محصولات', to: '/admin/products' },
          { label: 'افزودن محصول', to: '/admin/products/create' },
          { label: 'دسته بندی ها', to: '/admin/products/categories' },
          { label: 'برندها', to: '/admin/products/brands' },
          { label: 'مدیریت نظرات', to: '/admin/products/reviews' },
        ],
      },
      {
        key: 'inventory',
        label: 'موجودی و انبار',
        icon: IconBox,
        children: [
          { label: 'موجودی کالا', to: '/admin/inventory' },
          { label: 'هشدار کمبود', to: '/admin/inventory/low-stock' },
          { label: 'انبارها', to: '/admin/inventory/warehouses' },
          { label: 'جابجایی بین انبارها', to: '/admin/inventory/transfers' },
        ],
      },
      {
        key: 'customers',
        label: 'مشتریان',
        icon: IconUsers,
        children: [
          { label: 'همه مشتریان', to: '/admin/customers' },
          { label: 'گروه های مشتریان', to: '/admin/customers/groups' },
          { label: 'نظرات و امتیازها', to: '/admin/products/reviews' },
          { label: 'لیست علاقه مندی', to: '/admin/customers/wishlists' },
        ],
      },
    ],
  },
  {
    title: 'بازاریابی و محتوا',
    items: [
      {
        key: 'marketing',
        label: 'بازاریابی',
        icon: IconMail,
        children: [
          { label: 'کمپین ها', to: '/admin/marketing/campaigns' },
          { label: 'پیامک و ایمیل', to: '/admin/marketing/messages' },
          { label: 'پوش نوتیفیکیشن', to: '/admin/marketing/push' },
          { label: 'سبدهای رها شده', to: '/admin/marketing/abandoned-carts' },
        ],
      },
      {
        key: 'content',
        label: 'محتوا و نمایش',
        icon: IconNotes,
        children: [
          { label: 'بنرها و اسلایدر', to: '/admin/content/banners' },
          { label: 'صفحات سایت', to: '/admin/content/pages' },
          { label: 'منوهای سایت', to: '/admin/content/menus' },
          { label: 'وبلاگ و مقالات', to: '/admin/content/blog' },
        ],
      },
      {
        key: 'media',
        label: 'رسانه‌ها',
        icon: IconGallery,
        children: [{ label: 'کتابخانه رسانه', to: '/admin/media' }],
      },
      {
        key: 'finance',
        label: 'فروش و مالی',
        icon: IconDollarSign,
        children: [
          { label: 'تراکنش ها', to: '/admin/finance/transactions' },
          { label: 'تسویه حساب ها', to: '/admin/finance/settlements' },
          { label: 'کدهای تخفیف', to: '/admin/finance/coupons' },
          { label: 'مالیات و حمل و نقل', to: '/admin/finance/shipping-tax' },
        ],
      },
    ],
  },
  {
    title: 'تحلیل و پشتیبانی',
    items: [
      {
        key: 'reports',
        label: 'گزارش ها',
        icon: IconChartSquare,
        children: [
          { label: 'گزارش فروش', to: '/admin/reports/sales' },
          { label: 'گزارش محصولات', to: '/admin/reports/products' },
          { label: 'گزارش مشتریان', to: '/admin/reports/customers' },
          { label: 'گزارش موجودی', to: '/admin/reports/inventory' },
        ],
      },
      {
        key: 'support',
        label: 'پشتیبانی',
        icon: IconClipboardText,
        children: [
          { label: 'تیکت ها', to: '/admin/support/tickets' },
          { label: 'تماس ها و درخواست ها', to: '/admin/support/contacts' },
          { label: 'سوالات متداول', to: '/admin/support/faq' },
          { label: 'سوالات محصولات', to: '/admin/support/product-questions' },
        ],
      },
    ],
  },
  {
    title: 'مدیریت سیستم',
    items: [
      {
        key: 'admins',
        label: 'کاربران پنل',
        icon: IconUsers,
        children: [
          { label: 'لیست کاربران پنل', to: '/admin/users' },
          { label: 'نقش ها و دسترسی ها', to: '/admin/users/roles' },
          { label: 'لاگ فعالیت ها', to: '/admin/users/activity-logs' },
        ],
      },
      {
        key: 'settings',
        label: 'تنظیمات',
        icon: IconSettings,
        children: [
          { label: 'تنظیمات عمومی', to: '/admin/settings' },
          { label: 'درگاه های پرداخت', to: '/admin/settings/payment-gateways' },
          { label: 'فیش های بانکی ارسالی', to: '/admin/payments/bank-slips' },
          { label: 'روش های ارسال', to: '/admin/settings/shipping-methods' },
          { label: 'تنظیمات سئو', to: '/admin/settings/seo' },
        ],
      },
    ],
  },
]

const isRouteActive = (path: string) => route.path.startsWith(path)
const isItemActive = (item: MenuItem) => item.children.some((child) => route.path.startsWith(child.to))

const findActiveDropdown = () => {
  const activeItem = menuSections.flatMap((section) => section.items).find((item) => isItemActive(item))
  activeDropdown.value = activeItem?.key ?? null
}

watch(
  () => route.path,
  () => findActiveDropdown(),
  { immediate: true },
)

const toggleDropdown = (name: string) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

const toggleMobileMenu = () => {
  if (window.innerWidth < 1024) {
    store.toggleSidebar()
  }
}
</script>

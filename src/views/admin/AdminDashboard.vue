<template>
  <div>
    <div class="space-y-6 text-right">
      <section class="grid gap-5 xl:grid-cols-4 sm:grid-cols-2">
        <article
          v-for="card in summaryCards"
          :key="card.title"
          class="panel h-full overflow-hidden !rounded-xl"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-white-dark text-sm">{{ card.title }}</p>
              <h3 class="mt-2 text-xl font-bold text-black dark:text-white">{{ card.value }}</h3>
              <p class="mt-2 text-xs" :class="card.trendClass">{{ card.trend }}</p>
            </div>
            <div
              class="grid h-12 w-12 place-content-center rounded-xl"
              :class="card.iconWrapperClass"
            >
              <component :is="card.icon" class="h-6 w-6" />
            </div>
          </div>
          <div class="mt-4 h-2 rounded-full bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <div class="h-full rounded-full" :class="card.barClass" :style="{ width: card.progress }"></div>
          </div>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <div class="panel xl:col-span-2 !rounded-xl">
          <div class="mb-5 flex items-center justify-between dark:text-white-light">
            <div>
              <h5 class="text-lg font-semibold">عملکرد فروش و سود</h5>
              <p class="mt-1 text-sm text-white-dark">نمای 6 ماه اخیر فروشگاه پارس‌شاپ</p>
            </div>
            <div class="dropdown ltr:ml-auto rtl:mr-auto">
              <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                <button type="button">
                  <icon-horizontal-dots class="text-black/70 dark:text-white/70 hover:!text-primary" />
                </button>
                <template #content="{ close }">
                  <ul @click="close()">
                    <li><button type="button">6 ماه اخیر</button></li>
                    <li><button type="button">90 روز اخیر</button></li>
                    <li><button type="button">امسال</button></li>
                  </ul>
                </template>
              </Popper>
            </div>
          </div>

          <div class="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <div class="rounded-md bg-primary-light px-3 py-2 text-primary dark:bg-primary dark:text-white">
              فروش کل: 4.82 میلیارد تومان
            </div>
            <div class="rounded-md bg-success-light px-3 py-2 text-success dark:bg-success dark:text-white">
              سود ناخالص: 1.34 میلیارد تومان
            </div>
          </div>

          <apexchart
            height="340"
            :options="revenueChart"
            :series="revenueSeries"
            class="bg-white dark:bg-black rounded-lg overflow-hidden"
          >
            <div class="min-h-[340px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
              <span class="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
            </div>
          </apexchart>
        </div>

        <div class="panel h-full !rounded-xl">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h5 class="text-lg font-semibold dark:text-white-light">ترکیب سفارش‌ها</h5>
              <p class="mt-1 text-sm text-white-dark">سهم هر دسته از فروش این ماه</p>
            </div>
            <div class="grid h-11 w-11 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-white">
              <icon-shopping-bag class="h-5 w-5" />
            </div>
          </div>

          <apexchart
            height="320"
            :options="salesByCategory"
            :series="salesByCategorySeries"
            class="bg-white dark:bg-black rounded-lg overflow-hidden"
          >
            <div class="min-h-[320px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
              <span class="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
            </div>
          </apexchart>

          <div class="mt-4 space-y-3">
            <div v-for="item in categoryBreakdown" :key="item.name" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: item.color }"></span>
                <span class="text-black dark:text-white">{{ item.name }}</span>
              </div>
              <span class="text-white-dark">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <div class="panel p-0 !rounded-xl">
          <div class="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <div class="rounded-lg bg-success-light p-3 text-success dark:bg-success dark:text-white">
              <icon-box class="h-5 w-5" />
            </div>
            <div class="text-left rtl:text-right">
              <h5 class="text-2xl font-semibold dark:text-white-light">248</h5>
              <span class="block text-sm font-normal text-white-dark">کالاهای در آستانه اتمام</span>
            </div>
          </div>
          <apexchart
            height="280"
            :options="inventoryChart"
            :series="inventorySeries"
            class="bg-white dark:bg-black rounded-lg overflow-hidden"
          >
            <div class="min-h-[280px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
              <span class="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
            </div>
          </apexchart>
        </div>
        <div class="panel xl:col-span-2 !rounded-xl">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h5 class="text-lg font-semibold dark:text-white-light">آخرین سفارش‌ها</h5>
              <p class="mt-1 text-sm text-white-dark">وضعیت سفارش‌های ثبت‌شده در 24 ساعت اخیر</p>
            </div>
            <router-link to="/admin/users" class="btn btn-outline-primary btn-sm">مشاهده بیشتر</router-link>
          </div>

          <div class="table-responsive">
            <table class="table-hover">
              <thead>
                <tr>
                  <th>سفارش</th>
                  <th>مشتری</th>
                  <th>مبلغ</th>
                  <th>پرداخت</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id" class="text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td class="text-black dark:text-white">
                    <div class="font-semibold">{{ order.id }}</div>
                    <div class="text-xs text-white-dark">{{ order.items }}</div>
                  </td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.amount }}</td>
                  <td>{{ order.payment }}</td>
                  <td>
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="order.statusClass">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel !rounded-xl">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h5 class="text-lg font-semibold dark:text-white-light">وظایف فوری</h5>
              <p class="mt-1 text-sm text-white-dark">پیگیری‌های مهم امروز</p>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="task in urgentTasks"
              :key="task.title"
              class="rounded-xl border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]"
            >
              <div class="flex items-start gap-3">
                <div class="mt-0.5 grid h-10 w-10 place-content-center rounded-full" :class="task.iconWrapperClass">
                  <component :is="task.icon" class="h-5 w-5" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <h6 class="font-semibold text-black dark:text-white">{{ task.title }}</h6>
                    <span class="text-xs font-semibold" :class="task.priorityClass">{{ task.priority }}</span>
                  </div>
                  <p class="mt-1 text-sm text-white-dark">{{ task.description }}</p>
                  <p class="mt-2 text-xs text-white-dark">ددلاین: {{ task.deadline }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import apexchart from 'vue3-apexcharts'
import { useAppStore } from '@/stores/app'
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots.vue'
import IconDollarSign from '@/components/icon/icon-dollar-sign.vue'
import IconShoppingCart from '@/components/icon/icon-shopping-cart.vue'
import IconUsers from '@/components/icon/icon-users.vue'
import IconBox from '@/components/icon/icon-box.vue'
import IconShoppingBag from '@/components/icon/icon-shopping-bag.vue'
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes.vue'
import IconTag from '@/components/icon/icon-tag.vue'
import IconCreditCard from '@/components/icon/icon-credit-card.vue'
import IconChecks from '@/components/icon/icon-checks.vue'
import IconTruck from '@/components/icon/icon-desktop.vue'

const store = useAppStore()

const summaryCards = [
  {
    title: 'فروش امروز',
    value: '186,400,000 تومان',
    trend: '+12.4% نسبت به دیروز',
    trendClass: 'text-success',
    icon: IconDollarSign,
    iconWrapperClass: 'bg-success-light text-success dark:bg-success dark:text-white',
    barClass: 'bg-gradient-to-r from-success to-[#7ad3a8]',
    progress: '78%',
  },
  {
    title: 'سفارش‌های جدید',
    value: '324 سفارش',
    trend: '+18 سفارش در یک ساعت اخیر',
    trendClass: 'text-primary',
    icon: IconShoppingCart,
    iconWrapperClass: 'bg-primary-light text-primary dark:bg-primary dark:text-white',
    barClass: 'bg-gradient-to-r from-primary to-[#8ab4ff]',
    progress: '66%',
  },
  {
    title: 'مشتریان فعال',
    value: '8,492 نفر',
    trend: '+6.8% رشد هفتگی',
    trendClass: 'text-info',
    icon: IconUsers,
    iconWrapperClass: 'bg-info-light text-info dark:bg-info dark:text-white',
    barClass: 'bg-gradient-to-r from-info to-[#7ac7ff]',
    progress: '71%',
  },
  {
    title: 'کالاهای آماده ارسال',
    value: '1,128 آیتم',
    trend: '24 سفارش نیازمند رسیدگی',
    trendClass: 'text-warning',
    icon: IconBox,
    iconWrapperClass: 'bg-warning-light text-warning dark:bg-warning dark:text-white',
    barClass: 'bg-gradient-to-r from-warning to-[#ffd484]',
    progress: '54%',
  },
]

const categoryBreakdown = [
  { name: 'موبایل و دیجیتال', value: '42%', color: '#4361ee' },
  { name: 'مد و پوشاک', value: '31%', color: '#e2a03f' },
  { name: 'خانه و آشپزخانه', value: '19%', color: '#e7515a' },
  { name: 'سایر', value: '8%', color: '#00ab55' },
]

const recentOrders = [
  { id: '#PS-10428', items: '3 آیتم', customer: 'الهام کریمی', amount: '12,840,000 تومان', payment: 'آنلاین', status: 'در حال پردازش', statusClass: 'bg-warning-light text-warning dark:bg-warning/20' },
  { id: '#PS-10427', items: '1 آیتم', customer: 'مهدی صادقی', amount: '4,120,000 تومان', payment: 'کارت به کارت', status: 'آماده ارسال', statusClass: 'bg-primary-light text-primary dark:bg-primary/20' },
  { id: '#PS-10426', items: '2 آیتم', customer: 'سارا مرادی', amount: '8,760,000 تومان', payment: 'آنلاین', status: 'تحویل شده', statusClass: 'bg-success-light text-success dark:bg-success/20' },
  { id: '#PS-10425', items: '5 آیتم', customer: 'حسین رستمی', amount: '15,340,000 تومان', payment: 'در محل', status: 'نیازمند تماس', statusClass: 'bg-danger-light text-danger dark:bg-danger/20' },
  { id: '#PS-10424', items: '2 آیتم', customer: 'نیلوفر احمدی', amount: '6,980,000 تومان', payment: 'آنلاین', status: 'در انتظار بسته‌بندی', statusClass: 'bg-secondary-light text-secondary dark:bg-secondary/20' },
]

const urgentTasks = [
  {
    title: 'بررسی تاخیر ارسال سفارش‌های تهران',
    description: '8 سفارش از دیروز در وضعیت بسته‌بندی مانده‌اند و باید به تیم لجستیک ارجاع شوند.',
    deadline: 'امروز، 16:30',
    priority: 'بالا',
    priorityClass: 'text-danger',
    icon: IconTruck,
    iconWrapperClass: 'bg-danger-light text-danger dark:bg-danger dark:text-white',
  },
  {
    title: 'به‌روزرسانی قیمت کالاهای دیجیتال',
    description: 'تغییر نرخ تامین‌کننده برای 23 SKU ثبت شده و باید قبل از شروع کمپین اعمال شود.',
    deadline: 'امروز، 18:00',
    priority: 'متوسط',
    priorityClass: 'text-warning',
    icon: IconDollarSign,
    iconWrapperClass: 'bg-warning-light text-warning dark:bg-warning dark:text-white',
  },
  {
    title: 'تایید نهایی تسویه فروشندگان مارکت‌پلیس',
    description: 'سه کیف پول فروشنده نیاز به تایید دستی و بررسی مغایرت سفارش دارند.',
    deadline: 'فردا، 10:00',
    priority: 'نرمال',
    priorityClass: 'text-primary',
    icon: IconChecks,
    iconWrapperClass: 'bg-primary-light text-primary dark:bg-primary dark:text-white',
  },
]

const revenueSeries = ref([
  {
    name: 'فروش',
    data: [620, 710, 680, 830, 790, 910],
  },
  {
    name: 'سود',
    data: [180, 220, 205, 264, 251, 298],
  },
])

const salesByCategorySeries = ref([42, 31, 19, 8])

const dailySalesSeries = ref([
  {
    name: 'امروز',
    data: [52, 61, 49, 70, 64, 58, 77],
  },
  {
    name: 'دیروز',
    data: [38, 40, 35, 49, 46, 39, 44],
  },
])

const inventorySeries = ref([
  {
    name: 'کالاهای بحرانی',
    data: [34, 42, 39, 51, 48, 62, 57, 66, 58, 72],
  },
])

const revenueChart = computed(() => {
  const isDark = store.theme === 'dark' || store.isDarkMode
  const isRtl = store.rtlClass === 'rtl'

  return {
    chart: {
      type: 'area',
      height: 340,
      fontFamily: 'YekanBakh, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, lineCap: 'square' },
    colors: isDark ? ['#4361ee', '#00ab55'] : ['#4361ee', '#00ab55'],
    labels: ['آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      markers: { width: 10, height: 10, offsetX: -2 },
      itemMargin: { horizontal: 12 },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        offsetX: isRtl ? 2 : 0,
        style: { fontSize: '12px' },
      },
    },
    yaxis: {
      tickAmount: 6,
      opposite: isRtl,
      labels: {
        offsetX: isRtl ? -24 : -10,
        formatter: (value: number) => `${value}M`,
        style: { fontSize: '12px' },
      },
    },
    grid: {
      borderColor: isDark ? '#191e3a' : '#e0e6ed',
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (value: number) => `${value} میلیون تومان`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: isDark ? 0.24 : 0.22,
        opacityTo: 0.05,
        stops: [40, 100],
      },
    },
  } as ApexOptions
})

const salesByCategory = computed(() => {
  const isDark = store.theme === 'dark' || store.isDarkMode

  return {
    chart: {
      type: 'donut',
      height: 320,
      fontFamily: 'YekanBakh, sans-serif',
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 14,
      colors: isDark ? ['#0e1726'] : ['#fff'],
    },
    colors: ['#4361ee', '#e2a03f', '#e7515a', '#00ab55'],
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { show: true, fontSize: '22px', offsetY: -8 },
            value: {
              show: true,
              fontSize: '18px',
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: 'کل سهم',
              color: '#888ea8',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    labels: ['دیجیتال', 'پوشاک', 'خانه', 'سایر'],
    states: {
      hover: { filter: { type: 'none', value: 0.15 } },
      active: { filter: { type: 'none', value: 0.15 } },
    },
  } as ApexOptions
})

const dailySales = computed(() => ({
  chart: {
    type: 'bar',
    height: 180,
    fontFamily: 'YekanBakh, sans-serif',
    toolbar: { show: false },
    stacked: true,
    stackType: '100%',
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 1 },
  colors: ['#4361ee', '#e0e6ed'],
  xaxis: {
    labels: { show: true, style: { fontSize: '12px' } },
    categories: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  },
  yaxis: { show: false },
  fill: { opacity: 1 },
  plotOptions: { bar: { horizontal: false, columnWidth: '28%', borderRadius: 4 } },
  legend: { show: false },
  grid: {
    show: false,
    padding: { top: 10, right: -12, bottom: -10, left: -12 },
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} سفارش`,
    },
  },
} as ApexOptions))

const inventoryChart = computed(() => ({
  chart: {
    height: 280,
    type: 'area',
    fontFamily: 'YekanBakh, sans-serif',
    sparkline: { enabled: true },
  },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#00ab55'],
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  yaxis: { min: 0, show: false },
  grid: { padding: { top: 120, right: 0, bottom: 0, left: 0 } },
  fill: {
    opacity: 1,
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [100, 100],
    },
  },
  tooltip: {
    x: { show: false },
    y: {
      formatter: (value: number) => `${value} SKU`,
    },
  },
} as ApexOptions))
</script>

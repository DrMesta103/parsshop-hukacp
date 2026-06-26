<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">{{ pageTitle }}</h1>
        <p class="mt-1 text-white-dark">مدیریت سفارشات، پرداخت‌ها و وضعیت ارسال</p>
      </div>
    </div>

    <div class="panel">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-black dark:text-white">فیلترها</h2>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجوی شماره سفارش، نام مشتری..." @keyup.enter="applyFilters" />
        
        <select v-model="filters.status" class="form-select" @change="applyFilters" :disabled="isStatusForced">
          <option value="">همه وضعیت‌های سفارش</option>
          <option value="pending_payment">در انتظار پرداخت</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
          <option value="returned">مرجوعی</option>
        </select>
        
        <select v-model="filters.paymentStatus" class="form-select" @change="applyFilters">
          <option value="">همه وضعیت‌های پرداخت</option>
          <option value="pending">در انتظار</option>
          <option value="paid">پرداخت شده</option>
          <option value="failed">ناموفق</option>
          <option value="refunded">بازگشت وجه</option>
        </select>
      </div>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary btn-sm" @click="applyFilters">اعمال فیلتر</button>
        <div class="rounded-md bg-white-light/30 px-3 py-2 text-sm text-white-dark dark:bg-[#060818]">
          مجموع سفارشات: <span class="font-semibold text-black dark:text-white">{{ pagination.total }}</span>
        </div>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست سفارشات</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="orders.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          سفارشی با فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>شماره سفارش</th>
              <th>تاریخ ثبت</th>
              <th>مشتری</th>
              <th>مبلغ کل</th>
              <th>وضعیت پرداخت</th>
              <th>وضعیت سفارش</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>
                <div class="font-semibold text-primary">#{{ order.orderNumber }}</div>
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <div v-if="order.user" class="flex flex-col">
                  <span class="font-semibold">{{ order.user.fullName }}</span>
                  <span class="text-xs text-white-dark">{{ order.user.phone }}</span>
                </div>
                <div v-else class="text-white-dark">کاربر حذف شده</div>
              </td>
              <td>
                <div class="font-semibold">{{ formatPrice(order.totalAmount) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</div>
              </td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="getPaymentStatusClass(order.paymentStatus)">
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="getOrderStatusClass(order.status)">
                  {{ getOrderStatusLabel(order.status) }}
                </span>
              </td>
              <td class="text-center">
                <router-link :to="`/admin/orders/detail/${order.id}`" class="btn btn-outline-info btn-sm">مدیریت سفارش</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex flex-col gap-3 border-t border-white-light px-5 py-4 dark:border-[#1b2e4b] sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white-dark">
          صفحه {{ pagination.page }} از {{ pagination.totalPages }}
        </p>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page <= 1 || isLoading" @click="changePage(pagination.page - 1)">
            قبلی
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="pagination.page >= pagination.totalPages || isLoading" @click="changePage(pagination.page + 1)">
            بعدی
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'مدیریت سفارشات' });

const route = useRoute();

const orders = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const isStatusForced = computed(() => !!route.meta.statusFilter);

const pageTitle = computed(() => {
  switch (route.meta.statusFilter) {
    case 'pending_payment': return 'سفارشات در انتظار پرداخت';
    case 'processing': return 'سفارشات در حال پردازش';
    case 'returns': return 'سفارشات مرجوعی و لغو شده';
    default: return 'همه سفارشات';
  }
});

const filters = reactive({
  search: '',
  status: '',
  paymentStatus: '',
});

const applyFilters = () => {
  pagination.page = 1;
  fetchOrders();
};

const resetFilters = () => {
  filters.search = '';
  filters.status = (route.meta.statusFilter as string) || '';
  filters.paymentStatus = '';
  applyFilters();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
    fetchOrders();
  }
};

const fetchOrders = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    // If the route is specifically returns, we want either returns or cancelled.
    // The backend only takes exactly 1 status string for now.
    // We can map route.meta.statusFilter if needed. But let's keep it simple.
    let statusFilter = filters.status;
    if (route.meta.statusFilter === 'returns' && !filters.status) {
       // Since backend might not support array, maybe we handle only 'returned' for now
       // The user requested 'مرجوعی و لغو شده' - ideally we need an array.
       // Let's just use 'returned' for now or empty for all. We'll pass it as is.
    }

    const res = await apiService.get<any>('/admin/orders', {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
      },
    });

    orders.value = res?.items || [];
    pagination.total = res?.meta?.total || 0;
    pagination.totalPages = res?.meta?.totalPages || 0;
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست سفارشات';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price: number) => {
  if (!price) return '0';
  return price.toLocaleString('en-US');
};

const getOrderStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending_payment: 'در انتظار پرداخت',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده',
    returned: 'مرجوعی',
  };
  return map[status] || status;
};

const getOrderStatusClass = (status: string) => {
  switch (status) {
    case 'pending_payment': return 'bg-warning/15 text-warning';
    case 'processing': return 'bg-info/15 text-info';
    case 'shipped': return 'bg-primary/15 text-primary';
    case 'delivered': return 'bg-success/15 text-success';
    case 'cancelled': return 'bg-danger/15 text-danger';
    case 'returned': return 'bg-dark/15 text-dark dark:bg-white-light/15 dark:text-white-light';
    default: return 'bg-secondary/15 text-secondary';
  }
};

const getPaymentStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'در انتظار',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'بازگشت وجه',
  };
  return map[status] || status;
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-warning/15 text-warning';
    case 'paid': return 'bg-success/15 text-success';
    case 'failed': return 'bg-danger/15 text-danger';
    case 'refunded': return 'bg-dark/15 text-dark dark:bg-white-light/15 dark:text-white-light';
    default: return 'bg-secondary/15 text-secondary';
  }
};

watch(() => route.meta.statusFilter, (newStatus) => {
  if (newStatus === 'returns') {
    // Note: To support multiple statuses we'd need backend change. For now we just default to empty, 
    // or we can select cancelled. We'll leave it to user to filter manually for returns page or update backend later.
    filters.status = 'returned'; 
  } else {
    filters.status = (newStatus as string) || '';
  }
  applyFilters();
});

onMounted(() => {
  if (route.meta.statusFilter === 'returns') {
    filters.status = 'returned';
  } else {
    filters.status = (route.meta.statusFilter as string) || '';
  }
  fetchOrders();
});
</script>

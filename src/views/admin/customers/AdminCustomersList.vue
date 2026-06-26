<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">مشتریان</h1>
        <p class="mt-1 text-white-dark">مدیریت مشتریان، مشاهده سوابق خرید و گروه‌بندی</p>
      </div>
    </div>

    <div class="panel">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-black dark:text-white">فیلترها</h2>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجو نام، شماره موبایل..." @keyup.enter="applyFilters" />
        
        <select v-model="filters.groupId" class="form-select" @change="applyFilters">
          <option value="">همه گروه‌ها</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </div>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary btn-sm" @click="applyFilters">اعمال فیلتر</button>
        <div class="rounded-md bg-white-light/30 px-3 py-2 text-sm text-white-dark dark:bg-[#060818]">
          مجموع نتایج: <span class="font-semibold text-black dark:text-white">{{ pagination.total }}</span>
        </div>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست مشتریان</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="customers.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          مشتری با این مشخصات یافت نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>نام مشتری</th>
              <th>شماره موبایل</th>
              <th>گروه کاربری</th>
              <th>سفارشات</th>
              <th>مجموع خرید (USD)</th>
              <th>تاریخ عضویت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in customers" :key="c.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <span class="font-semibold text-black dark:text-white">{{ c.fullName }}</span>
                    <div class="text-xs text-white-dark">
                      <span v-if="c.isVerified" class="text-success inline-block">تایید شده</span>
                      <span v-else class="text-warning inline-block">تایید نشده</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-left ltr" dir="ltr">{{ c.phone }}</td>
              <td>
                <span v-if="c.group" class="badge bg-primary/20 text-primary">{{ c.group.name }}</span>
                <span v-else class="text-white-dark">-</span>
              </td>
              <td>
                <span class="font-semibold">{{ c.stats?.ordersCount || 0 }}</span>
              </td>
              <td>
                <span class="font-semibold text-info">${{ (c.stats?.totalSpent || 0).toLocaleString() }}</span>
              </td>
              <td>{{ new Date(c.createdAt).toLocaleDateString('fa-IR') }}</td>
              <td class="text-center">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openGroupModal(c)">تغییر گروه</button>
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

    <!-- Modal for Assign Group -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6" v-if="isModalOpen" @click.self="closeModal">
      <div class="panel w-full max-w-sm border-0 p-0 shadow-lg">
        <div class="flex items-center justify-between border-b border-white-light p-5 dark:border-[#1b2e4b]">
          <h2 class="text-lg font-bold">تغییر گروه مشتری</h2>
          <button type="button" class="text-white-dark hover:text-dark" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-5">
          <p class="mb-4">تغییر گروه کاربری برای <strong class="text-primary">{{ selectedCustomer?.fullName }}</strong></p>
          <form @submit.prevent="assignGroup" class="space-y-4">
            <div>
              <label for="assignGroup">انتخاب گروه</label>
              <select id="assignGroup" v-model="selectedGroupId" class="form-select">
                <option value="">بدون گروه (عادی)</option>
                <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" class="btn btn-outline-danger" @click="closeModal">انصراف</button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent ltr:mr-2 rtl:ml-2"></span>
                ذخیره
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'مشتریان' });

const customers = ref<any[]>([]);
const groups = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const filters = reactive({
  search: '',
  groupId: '',
});

const isModalOpen = ref(false);
const isSaving = ref(false);
const selectedCustomer = ref<any>(null);
const selectedGroupId = ref<string>('');

const fetchGroups = async () => {
  try {
    const res = await apiService.get<any[]>('/admin/customers/groups');
    groups.value = res || [];
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

const fetchCustomers = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any>('/admin/customers', {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        groupId: filters.groupId || undefined,
      },
    });

    customers.value = res?.items || [];
    pagination.total = res?.meta?.total || 0;
    pagination.totalPages = res?.meta?.totalPages || 0;
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست مشتریان';
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  pagination.page = 1;
  fetchCustomers();
};

const resetFilters = () => {
  filters.search = '';
  filters.groupId = '';
  applyFilters();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
    fetchCustomers();
  }
};

const openGroupModal = (customer: any) => {
  selectedCustomer.value = customer;
  selectedGroupId.value = customer.group?.id || '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedCustomer.value = null;
  selectedGroupId.value = '';
};

const assignGroup = async () => {
  if (!selectedCustomer.value) return;
  isSaving.value = true;
  try {
    await apiService.patch(`/admin/customers/${selectedCustomer.value.id}/group`, {
      groupId: selectedGroupId.value || null,
    });
    Swal.fire({ icon: 'success', title: 'موفق', text: 'گروه مشتری با موفقیت تغییر یافت', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    closeModal();
    fetchCustomers();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در تخصیص گروه' });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchGroups();
  fetchCustomers();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">نظرات و امتیازها</h1>
        <p class="mt-1 text-white-dark">مدیریت دیدگاه‌ها و امتیازهای ثبت شده توسط کاربران برای محصولات</p>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست نظرات</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="reviews.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          نظری یافت نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>کاربر</th>
              <th>محصول</th>
              <th>امتیاز</th>
              <th>متن نظر</th>
              <th>وضعیت</th>
              <th>تاریخ ثبت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reviews" :key="r.id">
              <td class="font-semibold">{{ r.user?.fullName || 'کاربر ناشناس' }}</td>
              <td>{{ r.product?.title || '-' }}</td>
              <td>
                <div class="flex items-center text-warning">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="i <= r.rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </td>
              <td class="truncate max-w-[200px]" :title="r.comment">{{ r.comment || '-' }}</td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="statusClass(r.status)">
                  {{ statusText(r.status) }}
                </span>
              </td>
              <td>{{ new Date(r.createdAt).toLocaleDateString('fa-IR') }}</td>
              <td class="text-center flex justify-center gap-2">
                <button v-if="r.status === 'pending' || r.status === 'rejected'" type="button" class="btn btn-outline-success btn-sm" @click="updateStatus(r, 'approved')">تایید</button>
                <button v-if="r.status === 'pending' || r.status === 'approved'" type="button" class="btn btn-outline-warning btn-sm" @click="updateStatus(r, 'rejected')">رد</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteReview(r)">حذف</button>
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
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useMeta } from '@/composables/use-meta';
import { productService } from '@/services/product-service';

useMeta({ title: 'نظرات مشتریان' });

const reviews = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const fetchReviews = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await productService.getAdminProductReviews({
      page: pagination.page,
      limit: pagination.limit,
    });
    reviews.value = res.items || [];
    pagination.total = res.meta?.total || 0;
    pagination.totalPages = res.meta?.totalPages || 0;
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست نظرات';
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
    fetchReviews();
  }
};

const statusText = (status: string) => {
  switch (status) {
    case 'approved': return 'تایید شده';
    case 'rejected': return 'رد شده';
    case 'pending': return 'در انتظار';
    default: return status;
  }
};

const statusClass = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-success/15 text-success';
    case 'rejected': return 'bg-danger/15 text-danger';
    case 'pending': return 'bg-warning/15 text-warning';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const updateStatus = async (review: any, status: 'approved' | 'rejected') => {
  try {
    await productService.updateAdminReview(review.id, { status });
    Swal.fire({ icon: 'success', title: 'موفق', text: `نظر ${status === 'approved' ? 'تایید' : 'رد'} شد.`, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    fetchReviews();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در بروزرسانی وضعیت نظر' });
  }
};

const deleteReview = async (review: any) => {
  const result = await Swal.fire({
    title: 'آیا مطمئن هستید؟',
    text: `نظر کاربر حذف خواهد شد!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'انصراف',
    customClass: { popup: 'sweet-alerts' },
  });

  if (result.isConfirmed) {
    try {
      await productService.deleteAdminReview(review.id);
      Swal.fire({ icon: 'success', title: 'حذف شد!', text: 'نظر مورد نظر حذف شد.', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      fetchReviews();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در حذف نظر' });
    }
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

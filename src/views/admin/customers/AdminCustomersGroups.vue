<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">گروه‌های مشتریان</h1>
        <p class="mt-1 text-white-dark">تعریف نقش‌ها و گروه‌های کاربری (همکار، VIP، عمده‌فروش) و تنظیم درصد تخفیف پیش‌فرض</p>
      </div>
      <div class="flex gap-3">
        <button type="button" class="btn btn-primary" @click="openModal(null)">ایجاد گروه جدید</button>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست گروه‌ها</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="groups.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          هیچ گروهی تعریف نشده است.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>نام گروه</th>
              <th>توضیحات</th>
              <th>تخفیف پیش‌فرض</th>
              <th>وضعیت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in groups" :key="g.id">
              <td class="font-bold text-primary">{{ g.name }}</td>
              <td class="truncate max-w-[250px]">{{ g.description || '-' }}</td>
              <td>
                <span v-if="g.discountPercent > 0" class="font-semibold text-success">{{ g.discountPercent }}%</span>
                <span v-else class="text-white-dark">بدون تخفیف</span>
              </td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="g.isActive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'">
                  {{ g.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="text-center flex justify-center gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal(g)">ویرایش</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteGroup(g)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Create/Edit -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6" v-if="isModalOpen" @click.self="closeModal">
      <div class="panel w-full max-w-lg border-0 p-0 shadow-lg">
        <div class="flex items-center justify-between border-b border-white-light p-5 dark:border-[#1b2e4b]">
          <h2 class="text-lg font-bold">{{ isEdit ? 'ویرایش گروه' : 'ایجاد گروه جدید' }}</h2>
          <button type="button" class="text-white-dark hover:text-dark" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-5">
          <form @submit.prevent="saveGroup" class="space-y-4">
            <div>
              <label for="name">نام گروه <span class="text-danger">*</span></label>
              <input id="name" v-model="form.name" type="text" class="form-input" required placeholder="مثال: مشتریان عمده" />
            </div>
            <div>
              <label for="description">توضیحات</label>
              <textarea id="description" v-model="form.description" class="form-textarea min-h-[80px]" placeholder="شرایط یا توضیحات گروه..."></textarea>
            </div>
            <div>
              <label for="discount">تخفیف پیش‌فرض (درصد)</label>
              <input id="discount" v-model.number="form.discountPercent" type="number" min="0" max="100" class="form-input" />
              <span class="text-xs text-white-dark mt-1">این تخفیف روی تمامی خریدهای مشتریان این گروه اعمال خواهد شد.</span>
            </div>
            <div class="flex items-center">
              <label class="flex items-center cursor-pointer mb-0">
                <input type="checkbox" v-model="form.isActive" class="form-checkbox" />
                <span class="text-black dark:text-white ltr:ml-2 rtl:mr-2">گروه فعال است</span>
              </label>
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

useMeta({ title: 'گروه‌های مشتریان' });

const groups = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const isModalOpen = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const currentId = ref('');

const form = reactive({
  name: '',
  description: '',
  discountPercent: 0,
  isActive: true,
});

const fetchGroups = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any[]>('/admin/customers/groups');
    groups.value = res || [];
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست گروه‌ها';
  } finally {
    isLoading.value = false;
  }
};

const openModal = (g: any | null) => {
  if (g) {
    isEdit.value = true;
    currentId.value = g.id;
    form.name = g.name;
    form.description = g.description || '';
    form.discountPercent = g.discountPercent || 0;
    form.isActive = g.isActive;
  } else {
    isEdit.value = false;
    currentId.value = '';
    form.name = '';
    form.description = '';
    form.discountPercent = 0;
    form.isActive = true;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveGroup = async () => {
  isSaving.value = true;
  try {
    if (isEdit.value) {
      await apiService.patch(`/admin/customers/groups/${currentId.value}`, form);
      Swal.fire({ icon: 'success', title: 'موفق', text: 'گروه با موفقیت ویرایش شد', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    } else {
      await apiService.post('/admin/customers/groups', form);
      Swal.fire({ icon: 'success', title: 'موفق', text: 'گروه جدید ایجاد شد', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
    closeModal();
    fetchGroups();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در ذخیره گروه' });
  } finally {
    isSaving.value = false;
  }
};

const deleteGroup = async (g: any) => {
  const result = await Swal.fire({
    title: 'آیا مطمئن هستید؟',
    text: `گروه "${g.name}" حذف خواهد شد!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'انصراف',
    customClass: { popup: 'sweet-alerts' },
  });

  if (result.isConfirmed) {
    try {
      await apiService.delete(`/admin/customers/groups/${g.id}`);
      Swal.fire({ icon: 'success', title: 'حذف شد!', text: 'گروه مورد نظر حذف شد.', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      fetchGroups();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در حذف گروه' });
    }
  }
};

onMounted(() => {
  fetchGroups();
});
</script>

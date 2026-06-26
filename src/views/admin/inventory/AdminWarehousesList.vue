<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">انبارها</h1>
        <p class="mt-1 text-white-dark">مدیریت انبارهای فیزیکی و مجازی برای ذخیره سازی محصولات</p>
      </div>
      <div class="flex gap-3">
        <button type="button" class="btn btn-primary" @click="openModal(null)">افزودن انبار جدید</button>
      </div>
    </div>

    <div class="panel p-0">
      <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست انبارها</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="warehouses.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          انباری یافت نشد. لطفا یک انبار جدید اضافه کنید.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>کد انبار</th>
              <th>نام انبار</th>
              <th>آدرس</th>
              <th>وضعیت</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wh in warehouses" :key="wh.id">
              <td class="font-semibold text-primary">#{{ wh.code }}</td>
              <td class="font-bold">{{ wh.name }}</td>
              <td class="truncate max-w-[200px]">{{ wh.address || '-' }}</td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="wh.isActive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'">
                  {{ wh.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="text-center">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal(wh)">ویرایش</button>
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
          <h2 class="text-lg font-bold">{{ isEdit ? 'ویرایش انبار' : 'افزودن انبار جدید' }}</h2>
          <button type="button" class="text-white-dark hover:text-dark" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-5">
          <form @submit.prevent="saveWarehouse" class="space-y-4">
            <div>
              <label for="name">نام انبار <span class="text-danger">*</span></label>
              <input id="name" v-model="form.name" type="text" class="form-input" required />
            </div>
            <div>
              <label for="code">کد انبار (منحصربه‌فرد) <span class="text-danger">*</span></label>
              <input id="code" v-model="form.code" type="text" class="form-input" required placeholder="مثال: WH-TEH-1" />
            </div>
            <div>
              <label for="address">آدرس فیزیکی</label>
              <textarea id="address" v-model="form.address" class="form-textarea min-h-[80px]"></textarea>
            </div>
            <div class="flex items-center">
              <label class="flex items-center cursor-pointer mb-0">
                <input type="checkbox" v-model="form.isActive" class="form-checkbox" />
                <span class="text-black dark:text-white ltr:ml-2 rtl:mr-2">انبار فعال است</span>
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

useMeta({ title: 'مدیریت انبارها' });

const warehouses = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const isModalOpen = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const currentId = ref('');

const form = reactive({
  name: '',
  code: '',
  address: '',
  isActive: true,
});

const fetchWarehouses = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any[]>('/admin/inventory/warehouses');
    warehouses.value = res || [];
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست انبارها';
  } finally {
    isLoading.value = false;
  }
};

const openModal = (wh: any | null) => {
  if (wh) {
    isEdit.value = true;
    currentId.value = wh.id;
    form.name = wh.name;
    form.code = wh.code;
    form.address = wh.address || '';
    form.isActive = wh.isActive;
  } else {
    isEdit.value = false;
    currentId.value = '';
    form.name = '';
    form.code = '';
    form.address = '';
    form.isActive = true;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveWarehouse = async () => {
  isSaving.value = true;
  try {
    if (isEdit.value) {
      await apiService.patch(`/admin/inventory/warehouses/${currentId.value}`, form);
      Swal.fire({ icon: 'success', title: 'موفق', text: 'انبار با موفقیت بروزرسانی شد', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    } else {
      await apiService.post('/admin/inventory/warehouses', form);
      Swal.fire({ icon: 'success', title: 'موفق', text: 'انبار با موفقیت ایجاد شد', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
    closeModal();
    fetchWarehouses();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'خطا', text: error?.message || 'خطا در ذخیره انبار' });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchWarehouses();
});
</script>

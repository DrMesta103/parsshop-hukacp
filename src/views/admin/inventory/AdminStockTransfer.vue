<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">جابجایی و ثبت موجودی</h1>
        <p class="mt-1 text-white-dark">انتقال کالا بین انبارها یا ثبت ورود/خروج مستقیم موجودی</p>
      </div>
      <div class="flex gap-3">
        <router-link to="/admin/inventory" class="btn btn-outline-secondary">بازگشت به موجودی</router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Form Panel -->
      <div class="panel">
        <div class="mb-5">
          <h2 class="text-lg font-semibold text-black dark:text-white">فرم ثبت حرکت کالا</h2>
        </div>

        <form @submit.prevent="submitMovement" class="space-y-5">
          
          <div>
            <label for="type">نوع عملیات <span class="text-danger">*</span></label>
            <select id="type" v-model="form.type" class="form-select" required>
              <option value="in">ورود کالا (IN)</option>
              <option value="out">خروج کالا (OUT)</option>
              <option value="transfer">جابجایی بین انبار (TRANSFER)</option>
            </select>
          </div>

          <div>
            <label for="productId">انتخاب محصول <span class="text-danger">*</span></label>
            <!-- In a real app this would be an async select, but we'll use a simple input for ID or dropdown if we fetch all.
                 Since products can be many, an auto-complete is better. For this demo, let's assume we pass ID via query or type it. -->
            <input id="productId" v-model="form.productId" type="text" class="form-input" required placeholder="شناسه (UUID) محصول را وارد کنید" />
            <span class="text-xs text-white-dark mt-1 block">راهنما: می‌توانید شناسه را از صفحه محصولات یا موجودی کپی کنید.</span>
          </div>

          <div v-if="form.type === 'out' || form.type === 'transfer'">
            <label for="source">انبار مبدأ <span class="text-danger">*</span></label>
            <select id="source" v-model="form.sourceWarehouseId" class="form-select" :required="form.type === 'out' || form.type === 'transfer'">
              <option value="">انتخاب انبار...</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
            </select>
          </div>

          <div v-if="form.type === 'in' || form.type === 'transfer'">
            <label for="dest">انبار مقصد <span class="text-danger">*</span></label>
            <select id="dest" v-model="form.destinationWarehouseId" class="form-select" :required="form.type === 'in' || form.type === 'transfer'">
              <option value="">انتخاب انبار...</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
            </select>
          </div>

          <div>
            <label for="quantity">تعداد <span class="text-danger">*</span></label>
            <input id="quantity" v-model.number="form.quantity" type="number" min="1" class="form-input" required />
          </div>

          <div>
            <label for="reason">توضیحات و دلیل (اختیاری)</label>
            <textarea id="reason" v-model="form.reason" class="form-textarea min-h-[80px]" placeholder="مثال: رسید خرید شماره 1234 یا مرجوعی..."></textarea>
          </div>

          <div class="pt-4 border-t border-white-light dark:border-[#1b2e4b]">
            <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent ltr:mr-2 rtl:ml-2"></span>
              ثبت نهایی
            </button>
          </div>
        </form>
      </div>

      <!-- Info Panel -->
      <div class="panel">
        <div class="flex items-center justify-center h-full min-h-[300px] text-center text-white-dark">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <h3 class="text-xl font-bold mb-2">راهنمای ثبت حرکت کالا</h3>
            <ul class="text-sm space-y-2 text-right ltr:text-left list-disc list-inside">
              <li><strong>ورود کالا (IN):</strong> برای ثبت خریدهای جدید یا شارژ انبار استفاده می‌شود. فقط انبار مقصد نیاز است.</li>
              <li><strong>خروج کالا (OUT):</strong> برای کاهش موجودی به دلایلی غیر از فروش (مثلا ضایعات). فقط انبار مبدأ نیاز است.</li>
              <li><strong>جابجایی (TRANSFER):</strong> برای انتقال کالا از یک انبار به انبار دیگر استفاده می‌شود. هر دو انبار نیاز است.</li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'ثبت جابجایی موجودی' });

const route = useRoute();
const router = useRouter();

const warehouses = ref<any[]>([]);
const isSubmitting = ref(false);

const form = reactive({
  type: 'transfer',
  productId: (route.query.product as string) || '',
  sourceWarehouseId: '',
  destinationWarehouseId: '',
  quantity: 1,
  reason: '',
});

const fetchWarehouses = async () => {
  try {
    const res = await apiService.get<any[]>('/admin/inventory/warehouses');
    warehouses.value = res || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
  }
};

const submitMovement = async () => {
  if (form.type === 'transfer' && form.sourceWarehouseId === form.destinationWarehouseId) {
    Swal.fire({ icon: 'warning', title: 'خطا', text: 'انبار مبدأ و مقصد نمی‌توانند یکسان باشند' });
    return;
  }

  isSubmitting.value = true;
  try {
    await apiService.post('/admin/inventory/movements', {
      type: form.type,
      productId: form.productId,
      sourceWarehouseId: form.sourceWarehouseId || undefined,
      destinationWarehouseId: form.destinationWarehouseId || undefined,
      quantity: form.quantity,
      reason: form.reason || undefined,
    });
    
    Swal.fire({
      icon: 'success',
      title: 'موفق',
      text: 'عملیات با موفقیت ثبت شد',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    
    // Redirect back to inventory list
    router.push('/admin/inventory');
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: error?.message || 'خطا در ثبت جابجایی کالا'
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchWarehouses();
  if (route.query.type) {
    form.type = route.query.type as string;
  }
});
</script>

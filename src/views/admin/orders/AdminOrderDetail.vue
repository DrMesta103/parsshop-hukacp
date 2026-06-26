<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">جزئیات سفارش #{{ order?.orderNumber }}</h1>
        <p class="mt-1 text-white-dark">مشاهده و مدیریت اطلاعات کامل سفارش</p>
      </div>
      <div class="flex gap-3">
        <router-link to="/admin/orders" class="btn btn-outline-secondary">بازگشت به لیست</router-link>
      </div>
    </div>

    <div v-if="isLoading" class="grid min-h-[320px] place-content-center panel">
      <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
    </div>
    
    <div v-else-if="errorMessage" class="p-5 panel">
      <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
    </div>

    <template v-else-if="order">
      <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Main details -->
        <div class="lg:col-span-2 xl:col-span-3 space-y-6">
          
          <!-- Order Items Table -->
          <div class="panel p-0">
            <div class="border-b border-white-light p-5 dark:border-[#1b2e4b]">
              <h2 class="text-lg font-semibold text-black dark:text-white">اقلام سفارش</h2>
            </div>
            <div class="table-responsive">
              <table class="table-hover">
                <thead>
                  <tr>
                    <th>محصول</th>
                    <th>قیمت واحد</th>
                    <th>تعداد</th>
                    <th class="text-right">مجموع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <img
                          :src="item.productImageUrl || fallbackProductImage"
                          alt="product"
                          class="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <div class="font-semibold text-black dark:text-white">{{ item.productTitle }}</div>
                          <div v-if="item.productSku" class="text-xs text-white-dark">SKU: {{ item.productSku }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ formatPrice(item.unitPrice) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</td>
                    <td>{{ item.quantity }}</td>
                    <td class="text-right font-semibold">{{ formatPrice(item.totalPrice) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totals -->
          <div class="panel">
            <h2 class="text-lg font-semibold text-black dark:text-white mb-5">جزئیات مالی</h2>
            <div class="space-y-3 max-w-sm ml-auto">
              <div class="flex justify-between items-center text-white-dark">
                <span>مبلغ کل کالاها:</span>
                <span>{{ formatPrice(order.subtotalAmount) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</span>
              </div>
              <div class="flex justify-between items-center text-white-dark">
                <span>هزینه ارسال:</span>
                <span>{{ formatPrice(order.shippingAmount) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</span>
              </div>
              <div class="flex justify-between items-center text-danger" v-if="order.discountAmount > 0">
                <span>تخفیف:</span>
                <span>-{{ formatPrice(order.discountAmount) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</span>
              </div>
              <hr class="border-white-light dark:border-[#1b2e4b] my-3">
              <div class="flex justify-between items-center font-bold text-lg text-black dark:text-white">
                <span>مبلغ نهایی:</span>
                <span>{{ formatPrice(order.totalAmount) }} {{ order.currency === 'IRR' ? 'ریال' : order.currency }}</span>
              </div>
            </div>
          </div>
          
          <!-- Shipping Address -->
          <div class="panel" v-if="order.addressSnapshot">
            <h2 class="text-lg font-semibold text-black dark:text-white mb-5">اطلاعات ارسال</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-white-dark block text-xs">گیرنده</span>
                <span class="font-semibold text-black dark:text-white">{{ order.addressSnapshot.recipientName || '-' }}</span>
              </div>
              <div>
                <span class="text-white-dark block text-xs">شماره تماس گیرنده</span>
                <span class="font-semibold text-black dark:text-white">{{ order.addressSnapshot.phone || '-' }}</span>
              </div>
              <div class="md:col-span-2">
                <span class="text-white-dark block text-xs">آدرس</span>
                <span class="font-semibold text-black dark:text-white">
                  {{ order.addressSnapshot.province || '' }} - {{ order.addressSnapshot.city || '' }} - {{ order.addressSnapshot.addressLine || '-' }}
                </span>
              </div>
              <div>
                <span class="text-white-dark block text-xs">کد پستی</span>
                <span class="font-semibold text-black dark:text-white">{{ order.addressSnapshot.postalCode || '-' }}</span>
              </div>
              <div>
                <span class="text-white-dark block text-xs">پلاک / واحد</span>
                <span class="font-semibold text-black dark:text-white">
                  {{ order.addressSnapshot.plaque || '-' }} 
                  <span v-if="order.addressSnapshot.unit">/ واحد {{ order.addressSnapshot.unit }}</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Sidebar / Actions -->
        <div class="space-y-6">
          <div class="panel">
            <h2 class="text-lg font-semibold text-black dark:text-white mb-5">وضعیت و یادداشت</h2>
            <form @submit.prevent="updateStatus">
              <div class="space-y-4">
                <div>
                  <label>وضعیت پرداخت</label>
                  <select v-model="form.paymentStatus" class="form-select">
                    <option value="pending">در انتظار</option>
                    <option value="paid">پرداخت شده</option>
                    <option value="failed">ناموفق</option>
                    <option value="refunded">بازگشت وجه</option>
                  </select>
                </div>
                <div>
                  <label>وضعیت سفارش</label>
                  <select v-model="form.status" class="form-select">
                    <option value="pending_payment">در انتظار پرداخت</option>
                    <option value="processing">در حال پردازش</option>
                    <option value="shipped">ارسال شده</option>
                    <option value="delivered">تحویل شده</option>
                    <option value="cancelled">لغو شده</option>
                    <option value="returned">مرجوعی</option>
                  </select>
                </div>
                <div>
                  <label>یادداشت ادمین (فقط برای مدیران قابل مشاهده است)</label>
                  <textarea v-model="form.adminNotes" class="form-textarea min-h-[100px]" placeholder="یادداشتی وارد کنید..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary w-full mt-4" :disabled="isUpdating">
                  <span v-if="isUpdating" class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent ltr:mr-2 rtl:ml-2"></span>
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>

          <div class="panel">
            <h2 class="text-lg font-semibold text-black dark:text-white mb-5">اطلاعات مشتری</h2>
            <div class="space-y-3" v-if="order.user">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                  {{ order.user.fullName?.charAt(0) || 'U' }}
                </div>
                <div>
                  <div class="font-semibold text-black dark:text-white">{{ order.user.fullName }}</div>
                  <router-link :to="`/admin/users/${order.user.id}`" class="text-xs text-primary hover:underline">مشاهده پروفایل</router-link>
                </div>
              </div>
              <hr class="border-white-light dark:border-[#1b2e4b] my-3">
              <div>
                <span class="text-white-dark text-xs block">شماره تماس</span>
                <span class="font-semibold text-black dark:text-white">{{ order.user.phone }}</span>
              </div>
            </div>
            <div v-else class="text-danger font-semibold text-center py-4">
              کاربر حذف شده است
            </div>
          </div>
          
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'جزئیات سفارش' });

const route = useRoute();
const orderId = route.params.id as string;

const fallbackProductImage = '/assets/images/product-headphones.jpg';

const order = ref<any>(null);
const isLoading = ref(true);
const isUpdating = ref(false);
const errorMessage = ref('');

const form = reactive({
  status: '',
  paymentStatus: '',
  adminNotes: '',
});

const fetchOrder = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any>(`/admin/orders/${orderId}`);
    order.value = res;
    
    // Set form
    form.status = res.status;
    form.paymentStatus = res.paymentStatus;
    form.adminNotes = res.adminNotes || '';
    
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت جزئیات سفارش';
  } finally {
    isLoading.value = false;
  }
};

const updateStatus = async () => {
  isUpdating.value = true;
  try {
    const res = await apiService.patch<any, any>(`/admin/orders/${orderId}/status`, {
      status: form.status,
      paymentStatus: form.paymentStatus,
      adminNotes: form.adminNotes,
    });
    
    order.value = res;
    
    Swal.fire({
      icon: 'success',
      title: 'موفقیت',
      text: 'سفارش با موفقیت بروزرسانی شد',
      padding: '2em',
      customClass: { popup: 'sweet-alerts' },
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: error?.message || 'خطا در بروزرسانی سفارش',
      padding: '2em',
      customClass: { popup: 'sweet-alerts' },
    });
  } finally {
    isUpdating.value = false;
  }
};

const formatPrice = (price: number) => {
  if (!price) return '0';
  return price.toLocaleString('en-US');
};

onMounted(() => {
  fetchOrder();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-black dark:text-white">{{ pageTitle }}</h1>
        <p class="mt-1 text-white-dark">مدیریت موجودی کالاها و مشاهده وضعیت در انبارهای مختلف</p>
      </div>
      <div class="flex gap-3">
        <router-link to="/admin/inventory/transfers" class="btn btn-primary">ثبت جابجایی انبار</router-link>
      </div>
    </div>

    <div class="panel">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-black dark:text-white">فیلترها</h2>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input v-model.trim="filters.search" type="text" class="form-input" placeholder="جستجو نام، SKU..." @keyup.enter="applyFilters" />
        
        <select v-model="filters.warehouseId" class="form-select" @change="applyFilters">
          <option value="">همه انبارها</option>
          <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
        </select>
        
        <div class="flex items-center">
          <label class="flex items-center cursor-pointer mb-0">
            <input type="checkbox" v-model="filters.lowStockOnly" class="form-checkbox" @change="applyFilters" :disabled="isLowStockForced" />
            <span class="text-black dark:text-white ltr:ml-2 rtl:mr-2">فقط کالاهای با هشدار کمبود</span>
          </label>
        </div>
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
        <h2 class="text-lg font-semibold text-black dark:text-white">لیست موجودی کالاها</h2>
      </div>

      <div v-if="isLoading" class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>

      <div v-else-if="errorMessage" class="p-5">
        <div class="rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">{{ errorMessage }}</div>
      </div>

      <div v-else-if="products.length === 0" class="p-5">
        <div class="rounded-md border border-dashed border-white-light px-4 py-10 text-center text-white-dark dark:border-[#1b2e4b]">
          کالایی با فیلترهای فعلی پیدا نشد.
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table-hover whitespace-nowrap">
          <thead>
            <tr>
              <th>محصول</th>
              <th>برند</th>
              <th>مجموع موجودی</th>
              <th>تفکیک انبارها</th>
              <th class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>
                <div class="flex items-center gap-3">
                  <img
                    :src="product.mainImageUrl || fallbackProductImage"
                    alt="product"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <router-link :to="`/admin/products/${product.id}`" class="block font-semibold text-black hover:text-primary dark:text-white">
                      {{ product.title }}
                    </router-link>
                    <div class="text-xs text-white-dark">SKU: {{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td>{{ product.brand || '-' }}</td>
              <td>
                <span class="badge rounded-full px-3 py-1" :class="product.totalStock <= 5 ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'">
                  {{ product.totalStock }} عدد
                </span>
              </td>
              <td>
                <div class="space-y-1">
                  <div v-if="!product.warehouses || product.warehouses.length === 0" class="text-white-dark text-xs">در هیچ انباری موجود نیست</div>
                  <div v-for="wh in product.warehouses" :key="wh.warehouseId" class="flex justify-between items-center text-xs">
                    <span>{{ wh.warehouseName }}:</span>
                    <span class="font-semibold ml-2" :class="wh.quantity <= wh.lowStockThreshold ? 'text-danger' : ''">{{ wh.quantity }} عدد</span>
                  </div>
                </div>
              </td>
              <td class="text-center">
                <router-link :to="`/admin/inventory/transfers?product=${product.id}`" class="btn btn-outline-info btn-sm">جابجایی</router-link>
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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from '@/composables/use-meta';
import apiService from '@/services/api';

useMeta({ title: 'موجودی کالا' });

const route = useRoute();
const fallbackProductImage = '/assets/images/product-headphones.jpg';

const products = ref<any[]>([]);
const warehouses = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const isLowStockForced = computed(() => !!route.meta.lowStockOnly);

const pageTitle = computed(() => {
  if (route.meta.lowStockOnly) return 'هشدار کمبود موجودی';
  return 'موجودی کالا';
});

const filters = reactive({
  search: '',
  warehouseId: '',
  lowStockOnly: false,
});

const fetchWarehouses = async () => {
  try {
    const res = await apiService.get<any[]>('/admin/inventory/warehouses');
    warehouses.value = res || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
  }
};

const fetchInventory = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await apiService.get<any>('/admin/inventory/stocks', {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        warehouseId: filters.warehouseId || undefined,
        lowStockOnly: filters.lowStockOnly ? 'true' : undefined,
      },
    });

    products.value = res?.items || [];
    pagination.total = res?.meta?.total || 0;
    pagination.totalPages = res?.meta?.totalPages || 0;
  } catch (error: any) {
    errorMessage.value = error?.message || 'خطا در دریافت لیست موجودی';
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  pagination.page = 1;
  fetchInventory();
};

const resetFilters = () => {
  filters.search = '';
  filters.warehouseId = '';
  filters.lowStockOnly = isLowStockForced.value;
  applyFilters();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page;
    fetchInventory();
  }
};

watch(() => route.meta.lowStockOnly, (isLowStock) => {
  filters.lowStockOnly = !!isLowStock;
  applyFilters();
});

onMounted(() => {
  filters.lowStockOnly = !!route.meta.lowStockOnly;
  fetchWarehouses();
  fetchInventory();
});
</script>

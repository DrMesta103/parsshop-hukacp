import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const createAdminPlaceholderRoute = (path: string, name: string, title: string, description: string) => ({
  path,
  name,
  component: () => import('@/views/admin/AdminSectionPlaceholder.vue'),
  meta: { title, description },
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/products',
      component: () => import('@/layouts/StorefrontLayout.vue'),
      children: [
        {
          path: '',
          name: 'StorefrontProducts',
          component: () => import('@/views/StorefrontProducts.vue')
        },
        {
          path: ':id',
          name: 'StorefrontProductDetail',
          component: () => import('@/views/StorefrontProductDetail.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'login-otp',
          name: 'LoginOtp',
          component: () => import('@/views/auth/LoginOtp.vue')
        },
        {
          path: 'verify-otp',
          name: 'VerifyOtp',
          component: () => import('@/views/auth/VerifyOtp.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/Register.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/Profile.vue')
        }
      ]
    },
    // Admin routes with AdminLayout
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'products',
          name: 'AdminProducts',
          component: () => import('@/views/admin/AdminProducts.vue')
        },
        {
          path: 'products/create',
          name: 'AdminProductCreate',
          component: () => import('@/views/admin/AdminProductCreate.vue')
        },
        {
          path: 'products/categories',
          name: 'AdminProductCategories',
          component: () => import('@/views/admin/AdminProductCategories.vue')
        },
        {
          path: 'products/brands',
          name: 'AdminProductBrands',
          component: () => import('@/views/admin/AdminProductBrands.vue')
        },
        {
          path: 'media',
          name: 'AdminMediaLibrary',
          component: () => import('@/views/admin/AdminMediaLibrary.vue')
        },
        {
          path: 'products/reviews',
          name: 'AdminProductReviews',
          component: () => import('@/views/admin/AdminProductReviews.vue')
        },
        {
          path: 'products/:id/edit',
          name: 'AdminProductEdit',
          component: () => import('@/views/admin/AdminProductEdit.vue')
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/admin/AdminUsers.vue')
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: () => import('@/views/admin/AdminSettings.vue')
        },
        createAdminPlaceholderRoute('orders', 'AdminOrders', 'همه سفارشات', 'مشاهده و مدیریت تمام سفارش های ثبت شده در فروشگاه'),
        createAdminPlaceholderRoute('orders/pending-payment', 'AdminOrdersPendingPayment', 'سفارشات در انتظار پرداخت', 'پیگیری سفارش هایی که هنوز پرداخت آن ها نهایی نشده است'),
        createAdminPlaceholderRoute('orders/processing', 'AdminOrdersProcessing', 'سفارشات در حال پردازش', 'مدیریت سفارش های آماده سازی، بسته بندی و ارسال'),
        createAdminPlaceholderRoute('orders/returns', 'AdminOrdersReturns', 'مرجوعی و لغو شده', 'ثبت و بررسی درخواست های مرجوعی و سفارش های لغو شده'),
        createAdminPlaceholderRoute('inventory', 'AdminInventory', 'موجودی کالا', 'نمایش و مدیریت موجودی فعلی محصولات'),
        createAdminPlaceholderRoute('inventory/low-stock', 'AdminInventoryLowStock', 'هشدار کمبود', 'بررسی محصولاتی که به حداقل موجودی رسیده اند'),
        createAdminPlaceholderRoute('inventory/warehouses', 'AdminInventoryWarehouses', 'انبارها', 'مدیریت انبارها و ظرفیت نگهداری کالا'),
        createAdminPlaceholderRoute('inventory/transfers', 'AdminInventoryTransfers', 'جابجایی بین انبارها', 'ثبت انتقال کالا میان انبارهای فروشگاه'),
        createAdminPlaceholderRoute('customers', 'AdminCustomers', 'همه مشتریان', 'مدیریت اطلاعات مشتریان فروشگاه'),
        createAdminPlaceholderRoute('customers/groups', 'AdminCustomersGroups', 'گروه های مشتریان', 'دسته بندی مشتریان بر اساس سطح یا رفتار خرید'),
        createAdminPlaceholderRoute('customers/reviews', 'AdminCustomersReviews', 'نظرات و امتیازها', 'مدیریت دیدگاه ها و امتیازهای ثبت شده برای محصولات'),
        createAdminPlaceholderRoute('customers/wishlists', 'AdminCustomersWishlists', 'لیست علاقه مندی', 'بررسی علاقه مندی های ثبت شده توسط مشتریان'),
        createAdminPlaceholderRoute('marketing/campaigns', 'AdminMarketingCampaigns', 'کمپین ها', 'مدیریت کمپین های فروش، تخفیف و مناسبت ها'),
        createAdminPlaceholderRoute('marketing/messages', 'AdminMarketingMessages', 'پیامک و ایمیل', 'ارسال و زمان بندی پیامک ها و ایمیل های بازاریابی'),
        createAdminPlaceholderRoute('marketing/push', 'AdminMarketingPush', 'پوش نوتیفیکیشن', 'مدیریت اعلان های پوش برای کاربران سایت و اپ'),
        createAdminPlaceholderRoute('marketing/abandoned-carts', 'AdminMarketingAbandonedCarts', 'سبدهای رها شده', 'پیگیری و بازیابی سبدهای خرید نیمه کاره'),
        createAdminPlaceholderRoute('content/banners', 'AdminContentBanners', 'بنرها و اسلایدر', 'مدیریت بنرهای صفحه اصلی و اسلایدرهای تبلیغاتی'),
        createAdminPlaceholderRoute('content/pages', 'AdminContentPages', 'صفحات سایت', 'مدیریت صفحات ثابت مانند درباره ما و قوانین'),
        createAdminPlaceholderRoute('content/menus', 'AdminContentMenus', 'منوهای سایت', 'مدیریت ساختار منوهای سایت و هدر/فوتر'),
        createAdminPlaceholderRoute('content/blog', 'AdminContentBlog', 'وبلاگ و مقالات', 'انتشار و مدیریت محتوای وبلاگ فروشگاه'),
        createAdminPlaceholderRoute('finance/transactions', 'AdminFinanceTransactions', 'تراکنش ها', 'نمایش وضعیت تراکنش ها و سوابق پرداخت'),
        createAdminPlaceholderRoute('finance/settlements', 'AdminFinanceSettlements', 'تسویه حساب ها', 'مدیریت تسویه حساب با فروشندگان یا حساب های داخلی'),
        createAdminPlaceholderRoute('finance/coupons', 'AdminFinanceCoupons', 'کدهای تخفیف', 'ایجاد و مدیریت کوپن ها و تخفیف های فروشگاه'),
        createAdminPlaceholderRoute('finance/shipping-tax', 'AdminFinanceShippingTax', 'مالیات و حمل و نقل', 'تنظیم قوانین مالیات، هزینه حمل و بازه های ارسال'),
        createAdminPlaceholderRoute('reports/sales', 'AdminReportsSales', 'گزارش فروش', 'تحلیل عملکرد فروش در بازه های زمانی مختلف'),
        createAdminPlaceholderRoute('reports/products', 'AdminReportsProducts', 'گزارش محصولات', 'تحلیل پرفروش ترین، کم فروش ترین و سودآورترین کالاها'),
        createAdminPlaceholderRoute('reports/customers', 'AdminReportsCustomers', 'گزارش مشتریان', 'بررسی رفتار خرید و ارزش مشتریان'),
        createAdminPlaceholderRoute('reports/inventory', 'AdminReportsInventory', 'گزارش موجودی', 'تحلیل گردش موجودی و میزان خواب کالا'),
        createAdminPlaceholderRoute('support/tickets', 'AdminSupportTickets', 'تیکت ها', 'مدیریت درخواست های پشتیبانی و تیکت های ثبت شده'),
        createAdminPlaceholderRoute('support/contacts', 'AdminSupportContacts', 'تماس ها و درخواست ها', 'مدیریت فرم های تماس و درخواست های دریافتی'),
        createAdminPlaceholderRoute('support/faq', 'AdminSupportFaq', 'سوالات متداول', 'مدیریت سوالات متداول فروشگاه'),
        createAdminPlaceholderRoute('support/product-questions', 'AdminSupportProductQuestions', 'سوالات محصولات', 'مدیریت پرسش و پاسخ های ثبت شده برای کالاها'),
        createAdminPlaceholderRoute('users/roles', 'AdminUsersRoles', 'نقش ها و دسترسی ها', 'مدیریت نقش های سازمانی و سطح دسترسی کاربران پنل'),
        createAdminPlaceholderRoute('users/activity-logs', 'AdminUsersActivityLogs', 'لاگ فعالیت ها', 'مشاهده فعالیت های مدیران و اپراتورهای پنل'),
        {
          path: 'settings/payment-gateways',
          name: 'AdminSettingsPaymentGateways',
          component: () => import('@/views/admin/AdminSettingsPaymentGateways.vue'),
          meta: {
            title: 'درگاه های پرداخت',
            description: 'تنظیم و مدیریت درگاه های پرداخت فعال',
          },
        },
        {
          path: 'payments/bank-slips',
          name: 'AdminPaymentBankSlips',
          component: () => import('@/views/admin/AdminPaymentBankSlips.vue'),
          meta: {
            title: 'فیش های بانکی ارسالی',
            description: 'بررسی و تایید یا رد فیش های بانکی ثبت شده',
          },
        },
        {
          path: 'settings/shipping-methods',
          name: 'AdminSettingsShippingMethods',
          component: () => import('@/views/admin/AdminCheckoutShippingMethods.vue'),
          meta: {
            title: 'روش های ارسال',
            description: 'مدیریت روش های ارسال checkout و ترتیب نمایش آن ها',
          },
        },
        createAdminPlaceholderRoute('settings/seo', 'AdminSettingsSeo', 'تنظیمات سئو', 'مدیریت تنظیمات فنی و محتوایی سئو فروشگاه'),
        {
          path: 'products/:id',
          name: 'AdminProductDetail',
          component: () => import('@/views/admin/AdminProductDetail.vue')
        },
        {
          path: 'users/:id',
          name: 'AdminUserDetail',
          component: () => import('@/views/admin/AdminUserDetail.vue')
        }
      ]
    },
    {
      path: '/admin-test',
      name: 'AdminTest',
      component: () => import('@/views/AdminTest.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // Access denied page
    {
      path: '/access-denied',
      name: 'AccessDenied',
      component: () => import('@/views/AccessDenied.vue')
    },
    // 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// Enhanced navigation guards with admin verification
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if token exists but user not loaded yet
  if (authStore.accessToken && !authStore.user) {
    await authStore.initializeAuth()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
    return
  }

  // Check if route requires admin access
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      next('/auth/login')
      return
    }

    // If user role is already known from store, use it directly (no extra API call)
    if (authStore.user) {
      if (authStore.user.role !== 'Admin') {
        next('/access-denied')
        return
      }
      // User is admin, allow access
      next()
      return
    }

    // Fallback: verify with backend if user info not available
    try {
      const hasAdminAccess = await authStore.verifyAdminAccess()
      if (!hasAdminAccess) {
        next('/access-denied')
        return
      }
    } catch {
      next('/access-denied')
      return
    }
  }

  // Redirect authenticated users away from auth pages
  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router

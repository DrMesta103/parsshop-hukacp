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
          component: () => import('@/views/admin/AdminDashboard.vue')
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
          component: () => import('@/views/admin/AdminDashboard.vue')
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
        {
          path: 'orders',
          name: 'AdminOrders',
          component: () => import('@/views/admin/orders/AdminOrdersList.vue'),
        },
        {
          path: 'orders/pending-payment',
          name: 'AdminOrdersPendingPayment',
          component: () => import('@/views/admin/orders/AdminOrdersList.vue'),
          meta: { statusFilter: 'pending_payment' }
        },
        {
          path: 'orders/processing',
          name: 'AdminOrdersProcessing',
          component: () => import('@/views/admin/orders/AdminOrdersList.vue'),
          meta: { statusFilter: 'processing' }
        },
        {
          path: 'orders/returns',
          name: 'AdminOrdersReturns',
          component: () => import('@/views/admin/orders/AdminOrdersList.vue'),
          meta: { statusFilter: 'returns' }
        },
        {
          path: 'orders/detail/:id',
          name: 'AdminOrderDetail',
          component: () => import('@/views/admin/orders/AdminOrderDetail.vue'),
        },
        {
          path: 'inventory',
          name: 'AdminInventory',
          component: () => import('@/views/admin/inventory/AdminInventoryList.vue'),
        },
        {
          path: 'inventory/low-stock',
          name: 'AdminInventoryLowStock',
          component: () => import('@/views/admin/inventory/AdminInventoryList.vue'),
          meta: { lowStockOnly: true }
        },
        {
          path: 'inventory/warehouses',
          name: 'AdminInventoryWarehouses',
          component: () => import('@/views/admin/inventory/AdminWarehousesList.vue'),
        },
        {
          path: 'inventory/transfers',
          name: 'AdminInventoryTransfers',
          component: () => import('@/views/admin/inventory/AdminStockTransfer.vue'),
        },
        {
          path: 'customers',
          name: 'AdminCustomers',
          component: () => import('@/views/admin/customers/AdminCustomersList.vue'),
        },
        {
          path: 'customers/groups',
          name: 'AdminCustomersGroups',
          component: () => import('@/views/admin/customers/AdminCustomersGroups.vue'),
        },
        {
          path: 'customers/reviews',
          name: 'AdminCustomersReviews',
          component: () => import('@/views/admin/customers/AdminCustomersReviews.vue'),
        },
        {
          path: 'customers/wishlists',
          name: 'AdminCustomersWishlists',
          component: () => import('@/views/admin/customers/AdminCustomersWishlists.vue'),
        },
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

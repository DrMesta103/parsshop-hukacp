<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#060818] flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <div class="panel text-center">
        <!-- 404 Icon -->
        <div class="w-24 h-24 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-warning">
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Error Message -->
        <h1 class="text-2xl font-bold text-black dark:text-white mb-4">صفحه یافت نشد</h1>
        <p class="text-white-dark mb-6">
          صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا منتقل شده است.
        </p>

        <!-- Action Button -->
        <router-link to="/dashboard" class="btn btn-primary w-full">
          بازگشت به داشبورد
        </router-link>
      </div>
    </div>
  </div>
</template>
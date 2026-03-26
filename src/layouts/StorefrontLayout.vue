<template>
  <div class="min-h-screen bg-[#f5f7fb] text-black dark:bg-[#060818] dark:text-white-dark">
    <header class="border-b border-white-light bg-white/80 backdrop-blur dark:border-[#1b2e4b] dark:bg-[#0e1726]/90">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <router-link to="/products" class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-content-center rounded-2xl bg-primary text-lg font-bold text-white">P</span>
          <div>
            <div class="text-lg font-bold text-black dark:text-white">ParsShop</div>
            <div class="text-xs text-white-dark">Storefront Products</div>
          </div>
        </router-link>

        <nav class="flex items-center gap-3">
          <router-link to="/products" class="btn btn-outline-primary btn-sm">محصولات</router-link>
          <router-link to="/dashboard" class="btn btn-outline-secondary btn-sm">پنل کاربری</router-link>
          <router-link to="/admin/products" class="btn btn-primary btn-sm">ادمین محصولات</router-link>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <router-view />
    </main>
  </div>
</template>

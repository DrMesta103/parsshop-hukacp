<template>
  <footer class="mt-auto border-t border-white-light px-6 py-3 dark:border-[#191e3a]">
    <div class="flex flex-col sm:flex-row items-center justify-between">
      <div class="text-center sm:text-left text-sm text-white-dark">
        © {{ new Date().getFullYear() }} <span class="font-semibold">ParsShop</span>. تمامی حقوق محفوظ است.
      </div>
      <div class="text-center sm:text-right text-sm text-white-dark mt-2 sm:mt-0">
        <a href="#" class="hover:text-primary">درباره</a>
        <span class="mx-2">|</span>
        <a href="#" class="hover:text-primary">تماس با ما</a>
      </div>
    </div>
  </footer>
</template>
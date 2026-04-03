<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-white-light/70 bg-white px-6 py-6 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0e1726]">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-white-light bg-white-light/40 px-3 py-1 text-xs font-semibold text-primary dark:border-[#1b2e4b] dark:bg-[#060818]">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ pageBadgeLabel }}
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-black dark:text-white">{{ pageTitle }}</h1>
          <p class="max-w-3xl text-sm leading-7 text-white-dark">
            {{ pageDescription }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <router-link to="/admin/products" class="btn btn-outline-secondary">بازگشت به لیست</router-link>
          <button type="submit" form="create-product-form" class="btn btn-primary" :disabled="isSubmitting || isBootLoading">
            <span v-if="isSubmitting">در حال ذخیره...</span>
            <span v-else>{{ props.mode === 'edit' ? 'ذخیره تغییرات' : 'ذخیره محصول' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isBootLoading" class="panel rounded-[28px]">
      <div class="grid min-h-[320px] place-content-center">
        <span class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent"></span>
      </div>
    </div>

    <form v-else id="create-product-form" class="space-y-6" @submit.prevent="submitForm">
      <div v-if="errorMessage || validationErrors.length" class="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-4 text-sm text-danger">
        <p v-if="errorMessage" class="font-semibold">{{ errorMessage }}</p>
        <ul v-if="validationErrors.length" class="mt-2 space-y-1">
          <li v-for="item in validationErrors" :key="item">• {{ item }}</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div class="space-y-6">
          <section class="rounded-[28px] border border-white-light/70 bg-white px-6 py-6 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0e1726]">
            <div class="space-y-4">
              <div>
                <label for="product-title">عنوان محصول</label>
                <input id="product-title" v-model.trim="form.title" type="text" class="form-input" placeholder="مثلاً بلبرینگ SKF 6006-2RS" />
              </div>

              <div class="rounded-[18px] border border-white-light bg-white-light/20 px-4 py-3 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div class="min-w-0">
                    <div class="text-xs text-white-dark">لینک محصول</div>
                    <div v-if="!isSlugEditing" class="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span class="truncate font-semibold text-primary">{{ productUrlPreview }}</span>
                    </div>
                    <div v-else class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span class="text-xs text-white-dark">{{ productUrlPrefix }}</span>
                      <input v-model.trim="slugDraft" type="text" maxlength="16" class="form-input sm:max-w-[180px]" placeholder="product-slug" />
                      <button type="button" class="btn btn-primary btn-sm shrink-0" @click="saveSlugEdit">ثبت</button>
                      <button type="button" class="btn btn-outline-secondary btn-sm shrink-0" @click="cancelSlugEdit">لغو</button>
                    </div>
                    <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span v-if="slugCheckState === 'checking'" class="text-warning">در حال بررسی اسلاگ...</span>
                      <span v-else-if="slugCheckState === 'available'" class="text-success">اسلاگ آزاد است</span>
                      <span v-else-if="slugCheckState === 'taken'" class="text-danger">این اسلاگ قبلاً ثبت شده است</span>
                    </div>
                  </div>
                  <button v-if="!isSlugEditing" type="button" class="btn btn-outline-secondary btn-sm shrink-0" @click="startSlugEdit">ویرایش</button>
                </div>
              </div>
            </div>
          </section>

          <AdminFormSection title="توضیحات" description="ابتدا توضیح اصلی محصول را وارد کنید و بعد خلاصه کوتاه را بنویسید.">
            <template #icon>
              <IconNotes class="h-5 w-5" />
            </template>

            <div class="grid grid-cols-1 gap-5">
              <div>
                <label>توضیح اصلی</label>
                <RichTextEditor v-model="form.meta.description" :max-lines="16" />
              </div>
              <div>
                <label for="product-short-description">خلاصه</label>
                <RichTextEditor v-model="form.meta.shortDescription" :max-lines="6" />
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection title="اطلاعات پایه محصول" description="شناسه‌ها، قیمت، موجودی و دسته‌بندی را اینجا ثبت کنید.">
            <template #icon>
              <IconBox class="h-5 w-5" />
            </template>

            <div class="mb-5 flex flex-wrap gap-2">
              <button
                v-for="tab in baseInfoTabs"
                :key="tab.value"
                type="button"
                class="rounded-full border px-4 py-2 text-sm transition"
                :class="baseInfoTab === tab.value ? 'border-primary bg-primary/10 text-primary' : 'border-white-light text-white-dark dark:border-[#1b2e4b]'"
                @click="baseInfoTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>

            <div v-if="baseInfoTab === 'technical'" class="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label for="product-sku">SKU</label>
                <input id="product-sku" v-model.trim="form.sku" type="text" class="form-input" placeholder="BRG-6006-2RS" />
              </div>
              <div>
                <label for="product-technical-code">Technical Code</label>
                <input id="product-technical-code" v-model.trim="form.technicalCode" type="text" class="form-input" placeholder="SKF-6006" />
              </div>
              <div>
                <label for="product-stock">موجودی</label>
                <input id="product-stock" v-model.number="form.stock" type="number" min="0" step="1" class="form-input" />
              </div>
            </div>

            <div v-else-if="baseInfoTab === 'categories'" class="grid grid-cols-1 gap-5 xl:grid-cols-[240px_minmax(0,1fr)_280px]">
              <div class="rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary/10 via-white to-white px-5 py-5 shadow-sm dark:border-primary/20 dark:from-primary/10 dark:via-[#0e1726] dark:to-[#0b1321]">
                <label for="product-type" class="text-sm font-semibold text-black dark:text-white">نوع محصول</label>
                <p class="mt-1 text-xs leading-6 text-white-dark">با انتخاب نوع، فقط دسته‌بندی‌ها و برندهای مرتبط نمایش داده می‌شوند.</p>
                <select id="product-type" v-model="form.type" class="form-select mt-4 rounded-[16px] border-white bg-white/90 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0b1321]">
                  <option v-for="item in productTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
                <div class="mt-4 rounded-[18px] border border-primary/15 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-primary/20 dark:bg-[#0f1b30]/80">
                  <div class="text-xs text-white-dark">نوع انتخاب‌شده</div>
                  <div class="mt-1 font-semibold text-black dark:text-white">{{ selectedProductTypeLabel }}</div>
                  <div class="mt-2 text-[11px] leading-5 text-white-dark">{{ filteredCategories.length }} دسته‌بندی و {{ filteredBrands.length }} برند برای این نوع در دسترس است.</div>
                </div>
              </div>

              <div class="overflow-hidden rounded-[24px] border border-white-light/80 bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#0b1321]">
                <div class="flex flex-col gap-4 border-b border-white-light/80 bg-gradient-to-r from-white to-primary/5 px-5 py-5 dark:border-[#1b2e4b] dark:from-[#0b1321] dark:to-primary/10 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0">
                    <label for="product-category-search" class="text-sm font-semibold text-black dark:text-white">دسته‌بندی محصولات</label>
                    <p class="mt-1 text-xs leading-6 text-white-dark">از میان ساختار درختی دسته‌ها، مناسب‌ترین گزینه نهایی را برای محصول انتخاب کنید.</p>
                  </div>
                  <button
                    v-if="form.categoryId"
                    type="button"
                    class="inline-flex shrink-0 items-center justify-center rounded-full border border-danger/20 bg-danger/5 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/10"
                    @click="form.categoryId = ''"
                  >
                    پاک کردن انتخاب
                  </button>
                </div>

                <div class="px-5 py-5">
                  <input
                    id="product-category-search"
                    v-model.trim="categorySearch"
                    type="text"
                    class="form-input rounded-[16px] border-white bg-white-light/50 shadow-sm dark:border-[#1b2e4b] dark:bg-[#060818]"
                    placeholder="جستجو در دسته‌بندی‌ها..."
                  />

                  <div class="mt-4 max-h-[340px] overflow-y-auto rounded-[20px] border border-white-light/80 bg-white-light/20 px-3 py-3 dark:border-[#1b2e4b] dark:bg-[#060818]/70">
                    <div v-if="visibleCategoryRows.length" class="space-y-2">
                      <label
                        v-for="row in visibleCategoryRows"
                        :key="row.id"
                        class="group flex cursor-pointer items-center gap-3 rounded-[18px] border border-transparent bg-white/80 px-3 py-3 shadow-sm transition hover:border-primary/20 hover:bg-primary/5 dark:bg-[#0b1321]/80 dark:hover:bg-primary/10"
                        :class="isCategoryChecked(row.id) ? 'border-primary/30 bg-primary/5 dark:bg-primary/10' : ''"
                        :style="{ paddingRight: `${0.75 + row.level * 1.25}rem` }"
                      >
                        <input type="checkbox" class="form-checkbox outline-primary" :checked="isCategoryChecked(row.id)" @change="toggleCategorySelection(row.id)" />
                        <span class="min-w-0 flex-1">
                          <span class="block truncate text-sm font-semibold text-black dark:text-white">{{ row.name }}</span>
                          <span class="mt-1 block text-[11px] text-white-dark">{{ row.slug }}</span>
                        </span>
                        <span class="rounded-full bg-white-light px-2 py-1 text-[10px] font-semibold text-white-dark dark:bg-[#111c33]">سطح {{ row.level + 1 }}</span>
                      </label>
                    </div>
                    <div v-else class="rounded-[18px] border border-dashed border-white-light px-4 py-8 text-center text-sm text-white-dark dark:border-[#1b2e4b]">
                      دسته‌بندی مطابق جستجو پیدا نشد.
                    </div>
                  </div>

                  <div class="mt-4 rounded-[18px] border border-success/20 bg-success/5 px-4 py-4 dark:border-success/20">
                    <div class="text-xs text-white-dark">انتخاب فعلی</div>
                    <div class="mt-1 text-sm font-semibold text-black dark:text-white">{{ selectedCategoryLabel || 'هنوز دسته‌بندی انتخاب نشده است' }}</div>
                    <div v-if="selectedCategoryTrail.length" class="mt-2 text-[11px] leading-6 text-white-dark">
                      مسیر: {{ selectedCategoryTrail.join(' / ') }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-white-light/80 bg-gradient-to-b from-white to-white-light/30 px-5 py-5 shadow-sm dark:border-[#1b2e4b] dark:from-[#0b1321] dark:to-[#09111e]">
                <label for="product-brand" class="text-sm font-semibold text-black dark:text-white">برند</label>
                <p class="mt-1 text-xs leading-6 text-white-dark">برند محصول را از بین موارد سازگار با نوع انتخاب‌شده مشخص کنید.</p>
                <select id="product-brand" v-model="form.brandId" class="form-select mt-4 rounded-[16px] border-white bg-white/90 shadow-sm dark:border-[#1b2e4b] dark:bg-[#060818]">
                  <option value="">یک برند انتخاب کنید</option>
                  <option v-for="brand in filteredBrands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>

                <div class="mt-4 rounded-[18px] border border-white-light bg-white/80 px-4 py-4 text-sm shadow-sm dark:border-[#1b2e4b] dark:bg-[#060818]">
                  <div class="text-xs text-white-dark">وضعیت برند</div>
                  <div class="mt-1 font-semibold text-black dark:text-white">{{ selectedBrand?.name || 'برندی انتخاب نشده است' }}</div>
                  <div v-if="form.brand && !form.brandId" class="mt-2 text-[11px] leading-5 text-warning">مقدار جایگزین فعلی: {{ form.brand }}</div>
                </div>
              </div>
            </div>

            <div v-else-if="baseInfoTab === 'pricing'" class="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label for="product-base-price">قیمت اصلی (USD)</label>
                <input id="product-base-price" v-model.number="form.basePriceUSD" type="number" min="0" step="0.01" class="form-input" />
              </div>
              <div>
                <label for="product-sale-price">قیمت فروش (USD)</label>
                <input id="product-sale-price" v-model.number="form.salePriceUSD" type="number" min="0" step="0.01" class="form-input" />
              </div>
            </div>

            <div v-else class="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div class="rounded-[22px] border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
                <div class="flex items-center gap-3">
                  <input id="product-featured" v-model="form.featured" type="checkbox" class="form-checkbox outline-primary" />
                  <label for="product-featured" class="!mb-0">محصول ویژه</label>
                </div>
              </div>
              <div class="xl:col-span-2">
                <label for="product-tags">برچسب‌ها</label>
                <div class="rounded-[22px] border border-white-light px-4 py-4 dark:border-[#1b2e4b]">
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <input id="product-tags" v-model.trim="tagInput" type="text" class="form-input" placeholder="مثلاً bearing" @keydown.enter.prevent="addTag" />
                    <button type="button" class="btn btn-outline-secondary shrink-0" @click="addTag">افزودن برچسب</button>
                  </div>
                  <div v-if="form.tags.length" class="mt-4 flex flex-wrap gap-2">
                    <button
                      v-for="tag in form.tags"
                      :key="tag"
                      type="button"
                      class="rounded-full border border-white-light px-3 py-2 text-sm text-black transition hover:border-danger hover:text-danger dark:border-[#1b2e4b] dark:text-white"
                      @click="removeTag(tag)"
                    >
                      {{ tag }}
                    </button>
                  </div>
                  <p v-else class="mt-4 text-sm text-white-dark">هنوز برچسبی اضافه نشده است.</p>
                </div>
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection title="سئو" description="فقط متادیتای موتور جست‌وجو را در این باکس نگه دارید.">
            <template #icon>
              <IconNotes class="h-5 w-5" />
            </template>

            <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label for="product-meta-title">Meta Title</label>
                <input id="product-meta-title" v-model.trim="form.meta.metaTitle" type="text" class="form-input" placeholder="عنوان سئو" />
              </div>
              <div>
                <label for="product-meta-description">Meta Description</label>
                <textarea id="product-meta-description" v-model.trim="form.meta.metaDescription" rows="4" class="form-textarea" placeholder="توضیح متا برای موتور جست‌وجو"></textarea>
              </div>
            </div>
          </AdminFormSection>
          
          <AdminFormSection title="اشتراک‌گذاری" description="اگر این فیلدها خالی باشند، بک‌اند از عنوان، توضیح کوتاه و تصویر اصلی استفاده می‌کند.">
            <template #icon>
              <IconShare class="h-5 w-5" />
            </template>

            <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div class="space-y-5">
                <div>
                  <label for="product-share-title">Share Title</label>
                  <input id="product-share-title" v-model.trim="form.meta.shareTitle" type="text" class="form-input" placeholder="عنوان اشتراک‌گذاری" />
                </div>
                <div>
                  <label for="product-share-description">Share Description</label>
                  <textarea id="product-share-description" v-model.trim="form.meta.shareDescription" rows="5" class="form-textarea" placeholder="توضیح اشتراک‌گذاری"></textarea>
                </div>
              </div>

              <div class="rounded-[22px] border border-white-light p-4 dark:border-[#1b2e4b]">
                <div class="mb-4 text-sm font-semibold text-black dark:text-white">Share Image</div>
                <div class="overflow-hidden rounded-[20px] border border-dashed border-white-light bg-white-light/20 dark:border-[#1b2e4b] dark:bg-[#060818]">
                  <img v-if="shareImagePreview" :src="shareImagePreview" alt="share" class="h-44 w-full object-cover" />
                  <div v-else class="grid h-44 place-content-center px-4 text-center text-sm text-white-dark">در صورت خالی بودن، تصویر اصلی محصول استفاده می‌شود</div>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('share')">انتخاب از Media Library</button>
                  <button v-if="form.meta.shareImageUrl" type="button" class="btn btn-outline-danger btn-sm" @click="clearShareImage">حذف</button>
                </div>
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection title="رسانه‌ها" description="برای هر رسانه، فایل را فقط از طریق Media Library انتخاب کنید.">
            <template #icon>
              <IconGallery class="h-5 w-5" />
            </template>

            <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div class="rounded-[22px] border border-white-light p-4 dark:border-[#1b2e4b]">
                <div class="mb-4">
                  <div class="font-semibold text-black dark:text-white">مدل سه‌بعدی</div>
                  <div class="text-xs text-white-dark">فایل مدل یا خروجی فشرده</div>
                </div>
                <div class="grid min-h-[208px] place-content-center rounded-[20px] border border-dashed border-white-light bg-white-light/20 p-6 text-center dark:border-[#1b2e4b] dark:bg-[#060818]">
                  <div class="space-y-2">
                    <div class="text-sm font-semibold text-black dark:text-white">{{ modelDisplayName || 'مدل سه‌بعدی انتخاب نشده است' }}</div>
                    <a v-if="form.existingThreeDModelUrl" :href="form.existingThreeDModelUrl" target="_blank" rel="noopener noreferrer" class="text-xs text-primary hover:underline">
                      مشاهده فایل انتخاب‌شده
                    </a>
                  </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('model')">انتخاب از Media Library</button>
                  <button v-if="modelDisplayName" type="button" class="btn btn-outline-danger btn-sm" @click="clearModelFile">حذف</button>
                </div>
              </div>

              <div class="rounded-[22px] border border-white-light p-4 dark:border-[#1b2e4b] xl:col-span-2">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div class="font-semibold text-black dark:text-white">گالری تصاویر</div>
                    <div class="text-xs text-white-dark">تصاویر گالری فقط از Media Library انتخاب می‌شوند</div>
                  </div>
                  <div class="rounded-full border border-white-light px-3 py-1 text-xs text-white-dark dark:border-[#1b2e4b]">
                    {{ galleryAssets.length }} آیتم
                  </div>
                </div>

                <div v-if="galleryAssets.length" class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                  <div v-for="item in galleryAssets" :key="item.id" class="overflow-hidden rounded-[20px] border border-white-light dark:border-[#1b2e4b]">
                    <img :src="item.previewUrl" :alt="item.name" class="h-28 w-full object-cover" />
                    <div class="space-y-2 px-3 py-3">
                      <div class="line-clamp-1 text-xs text-white-dark">{{ item.name }}</div>
                      <button type="button" class="btn btn-outline-danger btn-sm w-full" @click="removeGalleryAsset(item.id)">حذف</button>
                    </div>
                  </div>
                </div>

                <div v-else class="grid min-h-[150px] place-content-center rounded-[20px] border border-dashed border-white-light bg-white-light/20 text-sm text-white-dark dark:border-[#1b2e4b] dark:bg-[#060818]">
                  هنوز تصویری به گالری اضافه نشده است
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('gallery')">انتخاب از Media Library</button>
                  <button v-if="galleryAssets.length" type="button" class="btn btn-outline-danger btn-sm" @click="clearGalleryAssets">پاک کردن همه</button>
                </div>
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection title="ویژگی‌ها" description="ویژگی‌های reusable را از API بخوانید، مقدار بدهید یا در همان صفحه ویژگی جدید بسازید.">
            <template #icon>
              <IconSettings class="h-5 w-5" />
            </template>

            <template #actions>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="openCreateAttributeModal">ساخت ویژگی reusable</button>
            </template>

            <ProductAttributesBuilder
              v-model="attributeRows"
              :reusable-attributes="reusableAttributes"
              :is-loading="isAttributesLoading"
              @request-create="openCreateAttributeModal"
            />
          </AdminFormSection>
        </div>

        <aside class="space-y-6 2xl:sticky 2xl:top-6 2xl:self-start">
          <section class="panel rounded-[28px] border border-white-light/70 bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#0e1726]">
            <div class="mb-5 flex items-center gap-3">
              <div class="grid h-11 w-11 place-content-center rounded-[18px] border border-white-light bg-white-light/40 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <IconSave class="h-5 w-5" />
              </div>
              <div>
                <div class="text-lg font-semibold text-black dark:text-white">اقدامات</div>
                <div class="text-sm text-white-dark">ذخیره یا بازنشانی فرم</div>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label for="product-status-sidebar">وضعیت محصول</label>
                <select id="product-status-sidebar" v-model="form.status" class="form-select">
                  <option v-for="item in productStatusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>
              <button type="submit" form="create-product-form" class="btn btn-primary w-full" :disabled="isSubmitting">
                <span v-if="isSubmitting">در حال ذخیره...</span>
                <span v-else>ذخیره محصول</span>
              </button>
            </div>
          </section>

          <section class="panel rounded-[28px] border border-white-light/70 bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#0e1726]">
            <div class="mb-5 flex items-center gap-3">
              <div class="grid h-11 w-11 place-content-center rounded-[18px] border border-white-light bg-white-light/40 dark:border-[#1b2e4b] dark:bg-[#060818]">
                <IconGallery class="h-5 w-5" />
              </div>
              <div>
                <div class="text-lg font-semibold text-black dark:text-white">تصویر اصلی</div>
                <div class="text-sm text-white-dark">انتخاب و پیش‌نمایش رسانه اصلی محصول</div>
              </div>
            </div>

            <div class="overflow-hidden rounded-[22px] border border-dashed border-white-light dark:border-[#1b2e4b]">
              <img v-if="mainImagePreview" :src="mainImagePreview" alt="main preview" class="h-56 w-full object-cover" />
              <div v-else class="grid h-56 place-content-center text-sm text-white-dark">تصویر اصلی انتخاب نشده است</div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <button type="button" class="btn btn-outline-primary btn-sm" @click="openMediaPicker('main')">انتخاب از Media Library</button>
              <button v-if="mainImagePreview" type="button" class="btn btn-outline-danger btn-sm" @click="clearMainImage">حذف</button>
            </div>
          </section>
        </aside>
      </div>
    </form>

    <MediaPickerModal
      :open="isMediaPickerOpen"
      :title="mediaPickerTitle"
      :description="mediaPickerDescription"
      :multiple="mediaPickerKind === 'gallery'"
      :initial-section="mediaPickerInitialSection"
      :allowed-sections="mediaPickerAllowedSections"
      :selected-urls="mediaPickerSelectedUrls"
      @close="isMediaPickerOpen = false"
      @select="handleMediaPickerSelect"
    />

    <div v-if="isCreateAttributeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div class="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white-light bg-white p-6 shadow-2xl dark:border-[#1b2e4b] dark:bg-[#0e1726]">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-semibold text-black dark:text-white">ساخت ویژگی reusable</h3>
            <p class="mt-1 text-sm text-white-dark">ویژگی جدید را بسازید تا بلافاصله داخل همین فرم قابل انتخاب باشد.</p>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isCreatingAttribute" @click="closeCreateAttributeModal">بستن</button>
        </div>

        <form class="space-y-5" @submit.prevent="submitCreateAttribute">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="attribute-name">نام ویژگی</label>
              <input id="attribute-name" v-model.trim="createAttributeForm.name" type="text" class="form-input" placeholder="مثلاً قطر داخلی" />
            </div>
            <div>
              <label for="attribute-slug">Slug</label>
              <div class="flex gap-2">
                <input id="attribute-slug" v-model.trim="createAttributeForm.slug" type="text" class="form-input" placeholder="inner-diameter" @input="createAttributeSlugTouched = true" />
                <button type="button" class="btn btn-outline-secondary shrink-0" @click="generateCreateAttributeSlug">تولید</button>
              </div>
            </div>
            <div>
              <label for="attribute-data-type">نوع داده</label>
              <select id="attribute-data-type" v-model="createAttributeForm.dataType" class="form-select">
                <option v-for="item in attributeDataTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>
            <div>
              <label for="attribute-unit">واحد</label>
              <input id="attribute-unit" v-model.trim="createAttributeForm.unit" type="text" class="form-input" placeholder="mm" />
            </div>
          </div>

          <div v-if="isAttributeOptionsVisible">
            <label for="attribute-options">گزینه‌ها</label>
            <textarea
              id="attribute-options"
              v-model.trim="createAttributeForm.optionsText"
              rows="4"
              class="form-textarea"
              placeholder="هر گزینه در یک خط یا با ویرگول جدا شود"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label for="attribute-default-text">مقدار پیش‌فرض متنی</label>
              <input id="attribute-default-text" v-model.trim="createAttributeForm.defaultValueText" type="text" class="form-input" />
            </div>
            <div>
              <label for="attribute-default-number">مقدار پیش‌فرض عددی</label>
              <input id="attribute-default-number" v-model.number="createAttributeForm.defaultValueNumber" type="number" step="0.01" class="form-input" />
            </div>
          </div>

          <div v-if="createAttributeForm.dataType === 'boolean'" class="rounded-[22px] border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
            <div class="flex items-center gap-3">
              <input id="attribute-default-boolean" v-model="createAttributeForm.defaultValueBoolean" type="checkbox" class="form-checkbox outline-primary" />
              <label for="attribute-default-boolean" class="!mb-0">مقدار پیش‌فرض بولی</label>
            </div>
          </div>

          <div v-if="createAttributeForm.dataType === 'json' || createAttributeForm.dataType === 'multiselect'">
            <label for="attribute-default-json">مقدار پیش‌فرض JSON</label>
            <textarea
              id="attribute-default-json"
              v-model.trim="createAttributeForm.defaultValueJsonText"
              rows="4"
              class="form-textarea font-mono text-sm"
              placeholder='{"key":"value"}'
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-[22px] border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <div class="flex items-center gap-3">
                <input id="attribute-filterable" v-model="createAttributeForm.isFilterable" type="checkbox" class="form-checkbox outline-primary" />
                <label for="attribute-filterable" class="!mb-0">قابل فیلتر</label>
              </div>
            </div>
            <div class="rounded-[22px] border border-white-light px-4 py-3 dark:border-[#1b2e4b]">
              <div class="flex items-center gap-3">
                <input id="attribute-visible" v-model="createAttributeForm.isVisible" type="checkbox" class="form-checkbox outline-primary" />
                <label for="attribute-visible" class="!mb-0">قابل نمایش</label>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-3 pt-2">
            <button type="button" class="btn btn-outline-secondary" :disabled="isCreatingAttribute" @click="closeCreateAttributeModal">انصراف</button>
            <button type="submit" class="btn btn-primary" :disabled="isCreatingAttribute">
              <span v-if="isCreatingAttribute">در حال ساخت...</span>
              <span v-else>ساخت ویژگی</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import MediaPickerModal from '@/components/admin/media/MediaPickerModal.vue'
import AdminFormSection from '@/components/admin/products/AdminFormSection.vue'
import ProductAttributesBuilder from '@/components/admin/products/ProductAttributesBuilder.vue'
import RichTextEditor from '@/components/admin/products/RichTextEditor.vue'
import IconBox from '@/components/icon/icon-box.vue'
import IconGallery from '@/components/icon/icon-gallery.vue'
import IconNotes from '@/components/icon/icon-notes.vue'
import IconSave from '@/components/icon/icon-save.vue'
import IconSettings from '@/components/icon/icon-settings.vue'
import IconShare from '@/components/icon/icon-share.vue'
import { extractApiErrorMessage } from '@/services/admin-api'
import brandService from '@/services/brand-service'
import categoryService from '@/services/category-service'
import productAttributeService from '@/services/product-attribute-service'
import productService from '@/services/product-service'
import type { ProductAttributeFormRow } from '@/types/admin-product-create'
import type { MediaItem, MediaSection } from '@/types/media'
import type {
  Brand,
  Category,
  CreateReusableProductAttributePayload,
  ProductAttributeAssignment,
  ProductAttributeDataType,
  ProductAttributeOption,
  ProductFormPayload,
  ProductListItem,
  ProductMeta,
  ProductStatus,
  ProductType,
  ReusableProductAttribute,
} from '@/types/product'
import {
  filterBrandsByProductType,
  filterCategoriesByType,
  formatCurrency,
  generateEnglishSlug,
  mapProductToForm,
  productStatusOptions,
  productTypeOptions,
  slugify,
} from '@/utils/product'

type MediaPickerKind = 'main' | 'gallery' | 'model' | 'share'

type GalleryAsset = {
  id: string
  name: string
  previewUrl: string
  file?: File
  existingUrl?: string
}

type CategoryTreeRow = {
  id: string
  name: string
  slug: string
  parentId: string
  level: number
  children: CategoryTreeRow[]
}

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    productId?: string
  }>(),
  {
    mode: 'create',
    productId: '',
  },
)

const MAX_SLUG_LENGTH = 16
const SLUG_CHECK_DELAY = 600

const router = useRouter()

const attributeDataTypeOptions: Array<{ value: ProductAttributeDataType; label: string }> = [
  { value: 'text', label: 'متنی' },
  { value: 'number', label: 'عددی' },
  { value: 'boolean', label: 'بولی' },
  { value: 'select', label: 'تک‌انتخابی' },
  { value: 'multiselect', label: 'چندانتخابی' },
  { value: 'json', label: 'JSON' },
]

const createEmptyMeta = (): ProductMeta => ({
  shortDescription: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  shareTitle: '',
  shareDescription: '',
  shareImageUrl: '',
})

const createEmptyAttributeRow = (displayOrder = 0): ProductAttributeFormRow => ({
  id: crypto.randomUUID(),
  attributeId: '',
  displayOrder,
  valueText: '',
  valueNumber: '',
  valueBoolean: false,
  valueJson: '',
  valueMultiText: [],
  overrideUnit: '',
})

const normalizeAttributeDisplayOrders = (rows: ProductAttributeFormRow[]) =>
  rows.map((row, index) => ({
    ...row,
    displayOrder: index,
  }))

const createEmptyReusableAttributeForm = () => ({
  name: '',
  slug: '',
  dataType: 'text' as ProductAttributeDataType,
  unit: '',
  optionsText: '',
  isFilterable: true,
  isVisible: true,
  defaultValueText: '',
  defaultValueNumber: null as number | null,
  defaultValueBoolean: false,
  defaultValueJsonText: '',
})

const form = reactive({
  sku: '',
  title: '',
  slug: '',
  technicalCode: '',
  brandId: '',
  brand: '',
  basePriceUSD: 0,
  salePriceUSD: null as number | null,
  stock: 0,
  type: 'Industrial' as ProductType,
  status: 'draft' as ProductStatus,
  featured: false,
  categoryId: '',
  tags: [] as string[],
  meta: createEmptyMeta(),
  existingMainImageUrl: '',
  existingThreeDModelUrl: '',
})

const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const reusableAttributes = ref<ReusableProductAttribute[]>([])
const attributeRows = ref<ProductAttributeFormRow[]>([createEmptyAttributeRow(0)])
const tagInput = ref('')
const validationErrors = ref<string[]>([])
const errorMessage = ref('')
const isBootLoading = ref(false)
const isSubmitting = ref(false)
const isAttributesLoading = ref(false)
const slugTouched = ref(false)
const slugGeneratedOnce = ref(false)
const slugDraft = ref('')
const isSlugEditing = ref(false)
const slugAutofillTimeout = ref<number | null>(null)
const slugCheckTimeout = ref<number | null>(null)
const slugCheckState = ref<'idle' | 'checking' | 'available' | 'taken'>('idle')
const createAttributeSlugTouched = ref(false)
const isCreateAttributeModalOpen = ref(false)
const isCreatingAttribute = ref(false)
const createAttributeForm = reactive(createEmptyReusableAttributeForm())
const categorySearch = ref('')
const mainImageFile = ref<File | null>(null)
const mainImagePreview = ref('')
const mainImageObjectUrl = ref('')
const modelFile = ref<File | null>(null)
const galleryAssets = ref<GalleryAsset[]>([])
const isMediaPickerOpen = ref(false)
const mediaPickerKind = ref<MediaPickerKind>('main')
const baseInfoTab = ref<'technical' | 'categories' | 'pricing' | 'other'>('technical')

const baseInfoTabs = [
  { value: 'technical', label: 'اطلاعات فنی و انبار' },
  { value: 'categories', label: 'دسته‌بندی‌ها' },
  { value: 'pricing', label: 'قیمت' },
  { value: 'other', label: 'سایر' },
] as const

const filteredCategories = computed(() => filterCategoriesByType(categories.value, form.type))
const categoryTree = computed<CategoryTreeRow[]>(() => {
  const nodeMap = new Map<string, CategoryTreeRow>()

  filteredCategories.value.forEach((category) => {
    nodeMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parent?.id || '',
      level: 0,
      children: [],
    })
  })

  const roots: CategoryTreeRow[] = []
  nodeMap.forEach((node) => {
    const parent = node.parentId ? nodeMap.get(node.parentId) : null
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortNodes = (nodes: CategoryTreeRow[], level = 0) => {
    nodes.sort((first, second) => first.name.localeCompare(second.name, 'fa'))
    nodes.forEach((node) => {
      node.level = level
      sortNodes(node.children, level + 1)
    })
  }

  sortNodes(roots)
  return roots
})
const categoryLookup = computed(() => {
  const map = new Map<string, CategoryTreeRow>()
  const visit = (nodes: CategoryTreeRow[]) => {
    nodes.forEach((node) => {
      map.set(node.id, node)
      visit(node.children)
    })
  }
  visit(categoryTree.value)
  return map
})
const checkedCategoryIds = computed(() => {
  const ids = new Set<string>()
  let currentId = form.categoryId

  while (currentId) {
    ids.add(currentId)
    currentId = categoryLookup.value.get(currentId)?.parentId || ''
  }

  return ids
})
const selectedCategoryLabel = computed(() => categoryLookup.value.get(form.categoryId)?.name || '')
const selectedCategoryTrail = computed(() => {
  if (!form.categoryId) return [] as string[]

  const trail: string[] = []
  let currentId = form.categoryId

  while (currentId) {
    const current = categoryLookup.value.get(currentId)
    if (!current) break
    trail.unshift(current.name)
    currentId = current.parentId
  }

  return trail
})
const selectedProductTypeLabel = computed(() => productTypeOptions.find((item) => item.value === form.type)?.label || form.type)
const visibleCategoryRows = computed<CategoryTreeRow[]>(() => {
  const query = categorySearch.value.trim().toLowerCase()

  const filterTree = (nodes: CategoryTreeRow[]): CategoryTreeRow[] =>
    nodes.reduce<CategoryTreeRow[]>((result, node) => {
      const children = filterTree(node.children)
      const matched = !query || [node.name, node.slug].join(' ').toLowerCase().includes(query)

      if (matched || children.length) {
        result.push({
          ...node,
          children,
        })
      }

      return result
    }, [])

  const rows: CategoryTreeRow[] = []
  const visit = (nodes: CategoryTreeRow[]) => {
    nodes.forEach((node) => {
      rows.push(node)
      if (node.children.length) {
        visit(node.children)
      }
    })
  }

  visit(filterTree(categoryTree.value))
  return rows
})
const filteredBrands = computed(() => filterBrandsByProductType(brands.value, form.type))
const selectedBrand = computed(() => brands.value.find((brand) => brand.id === form.brandId))
const pageBadgeLabel = computed(() => (props.mode === 'edit' ? 'ویرایش محصول' : 'ایجاد محصول'))
const pageTitle = computed(() => (props.mode === 'edit' ? 'ویرایش محصول' : 'افزودن محصول جدید'))
const pageDescription = computed(() =>
  props.mode === 'edit'
    ? 'مشخصات محصول، رسانه‌ها و ترتیب نمایش ویژگی‌ها را در همین فرم ویرایش کنید.'
    : 'فرم در چند بخش مجزا چیده شده تا اطلاعات پایه، محتوا، سئو، رسانه و ویژگی‌ها واضح‌تر ثبت شوند و صفحه شلوغ نشود.',
)
const shareImagePreview = computed(() => form.meta.shareImageUrl || '')
const modelDisplayName = computed(() => {
  if (modelFile.value) return modelFile.value.name
  if (form.existingThreeDModelUrl) return form.existingThreeDModelUrl.split('/').pop() || 'مدل سه‌بعدی'
  return ''
})
const productUrlPrefix = computed(() => `${window.location.origin}/product/`)
const productUrlPreview = computed(() => `${productUrlPrefix.value}${form.slug || 'new-product'}`)
const mediaPickerTitle = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'انتخاب تصاویر گالری'
    case 'model':
      return 'انتخاب مدل سه‌بعدی'
    case 'share':
      return 'انتخاب تصویر اشتراک‌گذاری'
    default:
      return 'انتخاب تصویر اصلی'
  }
})
const mediaPickerDescription = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'تصاویر گالری را از Media Library انتخاب کنید.'
    case 'model':
      return 'یک فایل مدل سه‌بعدی را انتخاب کنید.'
    case 'share':
      return 'برای share image بهتر است از Media Library استفاده شود.'
    default:
      return 'رسانه موردنظر را از Media Library انتخاب کنید.'
  }
})
const mediaPickerAllowedSections = computed<MediaSection[]>(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return ['image', 'gallery']
    case 'model':
      return ['model3d']
    default:
      return ['image']
  }
})
const mediaPickerInitialSection = computed<MediaSection>(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return 'gallery'
    case 'model':
      return 'model3d'
    default:
      return 'image'
  }
})
const mediaPickerSelectedUrls = computed(() => {
  switch (mediaPickerKind.value) {
    case 'gallery':
      return galleryAssets.value.map((item) => item.existingUrl).filter(Boolean) as string[]
    case 'model':
      return form.existingThreeDModelUrl ? [form.existingThreeDModelUrl] : []
    case 'share':
      return form.meta.shareImageUrl ? [form.meta.shareImageUrl] : []
    default:
      return form.existingMainImageUrl ? [form.existingMainImageUrl] : []
  }
})
const isAttributeOptionsVisible = computed(() => createAttributeForm.dataType === 'select' || createAttributeForm.dataType === 'multiselect')

const productStatusLabel = (value: ProductStatus) => productStatusOptions.find((item) => item.value === value)?.label || value
const isCategoryChecked = (categoryId: string) => checkedCategoryIds.value.has(categoryId)
const toggleCategorySelection = (categoryId: string) => {
  form.categoryId = form.categoryId === categoryId ? '' : categoryId
}

const normalizeProductSlug = (value: string) => slugify(value).slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '').replace(/^-|-$/g, '')

const revokeObjectUrl = (value?: string) => {
  if (value && value.startsWith('blob:')) URL.revokeObjectURL(value)
}

const resetMainImagePreview = () => {
  revokeObjectUrl(mainImageObjectUrl.value)
  mainImageObjectUrl.value = ''
  mainImagePreview.value = ''
}

const resetCreateAttributeForm = () => {
  Object.assign(createAttributeForm, createEmptyReusableAttributeForm())
  createAttributeSlugTouched.value = false
}

const openCreateAttributeModal = () => {
  resetCreateAttributeForm()
  isCreateAttributeModalOpen.value = true
}

const closeCreateAttributeModal = () => {
  if (isCreatingAttribute.value) return
  isCreateAttributeModalOpen.value = false
}

const startSlugEdit = () => {
  slugDraft.value = form.slug
  isSlugEditing.value = true
}

const cancelSlugEdit = () => {
  slugDraft.value = form.slug
  isSlugEditing.value = false
}

const saveSlugEdit = () => {
  form.slug = normalizeProductSlug(slugDraft.value)
  slugDraft.value = form.slug
  slugTouched.value = true
  slugGeneratedOnce.value = true
  isSlugEditing.value = false
}

const generateSlug = () => {
  form.slug = normalizeProductSlug(form.title || form.sku || form.technicalCode)
  slugDraft.value = form.slug
  slugTouched.value = true
  slugGeneratedOnce.value = true
}

const generateCreateAttributeSlug = () => {
  createAttributeForm.slug = generateEnglishSlug(createAttributeForm.name)
  createAttributeSlugTouched.value = true
}

const addTag = () => {
  const normalized = tagInput.value.trim()
  if (!normalized) return
  if (!form.tags.includes(normalized)) form.tags.push(normalized)
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  form.tags = form.tags.filter((item) => item !== tag)
}

const clearShareImage = () => {
  form.meta.shareImageUrl = ''
}

const clearMainImage = () => {
  mainImageFile.value = null
  form.existingMainImageUrl = ''
  resetMainImagePreview()
}

const clearModelFile = () => {
  modelFile.value = null
  form.existingThreeDModelUrl = ''
}

const clearGalleryAssets = () => {
  galleryAssets.value.forEach((item) => revokeObjectUrl(item.file ? item.previewUrl : ''))
  galleryAssets.value = []
}

const removeGalleryAsset = (assetId: string) => {
  const target = galleryAssets.value.find((item) => item.id === assetId)
  if (target?.file) revokeObjectUrl(target.previewUrl)
  galleryAssets.value = galleryAssets.value.filter((item) => item.id !== assetId)
}

const mergeGalleryAssets = (items: GalleryAsset[]) => {
  const map = new Map<string, GalleryAsset>()
  ;[...galleryAssets.value, ...items].forEach((item) => {
    const key = item.existingUrl || `${item.name}-${item.previewUrl}`
    map.set(key, item)
  })
  galleryAssets.value = Array.from(map.values())
}

const openMediaPicker = (kind: MediaPickerKind) => {
  mediaPickerKind.value = kind
  isMediaPickerOpen.value = true
}

const handleMediaPickerSelect = (items: MediaItem[]) => {
  if (!items.length) return

  if (mediaPickerKind.value === 'main') {
    mainImageFile.value = null
    resetMainImagePreview()
    form.existingMainImageUrl = items[0].url
    mainImagePreview.value = items[0].url
    isMediaPickerOpen.value = false
    return
  }

  if (mediaPickerKind.value === 'share') {
    form.meta.shareImageUrl = items[0].url
    isMediaPickerOpen.value = false
    return
  }

  if (mediaPickerKind.value === 'model') {
    modelFile.value = null
    form.existingThreeDModelUrl = items[0].url
    isMediaPickerOpen.value = false
    return
  }

  const nextAssets = items.map<GalleryAsset>((item) => ({
    id: item.id,
    name: item.title || item.originalName,
    previewUrl: item.url,
    existingUrl: item.url,
  }))
  mergeGalleryAssets(nextAssets)
  isMediaPickerOpen.value = false
}

const loadBootData = async () => {
  isBootLoading.value = true
  isAttributesLoading.value = true
  errorMessage.value = ''

  try {
    const [categoryList, brandList, attributeList] = await Promise.all([
      categoryService.getCategories(),
      brandService.getBrands(),
      productAttributeService.getReusableAttributes(),
    ])
    categories.value = categoryList
    brands.value = brandList
    reusableAttributes.value = attributeList
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'بارگذاری داده‌های فرم انجام نشد')
  } finally {
    isAttributesLoading.value = false
    isBootLoading.value = false
  }
}

const mapAssignmentsToAttributeRows = (attributes: ProductListItem['attributes']): ProductAttributeFormRow[] => {
  if (!Array.isArray(attributes)) return [createEmptyAttributeRow(0)]

  const sorted = [...attributes].sort((first, second) => {
    const firstOrder = typeof first.displayOrder === 'number' ? first.displayOrder : attributes.indexOf(first)
    const secondOrder = typeof second.displayOrder === 'number' ? second.displayOrder : attributes.indexOf(second)
    return firstOrder - secondOrder
  })

  const rows = sorted.map((item, index) => {
    const reusableAttribute = item.attributeId ? reusableAttributes.value.find((entry) => entry.id === item.attributeId) : undefined
    const dataType = item.dataType || reusableAttribute?.dataType || 'text'

    return {
      id: crypto.randomUUID(),
      attributeId: item.attributeId || '',
      displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index,
      valueText: item.valueText ?? (dataType === 'select' ? String(item.valueText ?? '') : ''),
      valueNumber: item.valueNumber === null || item.valueNumber === undefined ? '' : String(item.valueNumber),
      valueBoolean: Boolean(item.valueBoolean),
      valueJson: dataType === 'json' && item.valueJson !== undefined ? JSON.stringify(item.valueJson, null, 2) : '',
      valueMultiText: dataType === 'multiselect' && Array.isArray(item.valueJson) ? item.valueJson.map((value) => String(value)) : [],
      overrideUnit: item.overrideUnit || '',
    } satisfies ProductAttributeFormRow
  })

  return normalizeAttributeDisplayOrders(rows.length ? rows : [createEmptyAttributeRow(0)])
}

const loadProduct = async () => {
  if (props.mode !== 'edit' || !props.productId) return

  const product = await productService.getAdminProduct(props.productId)
  const mapped = mapProductToForm(product)

  form.sku = mapped.sku
  form.title = mapped.title
  form.slug = mapped.slug
  form.technicalCode = mapped.technicalCode
  form.brandId = mapped.brandId || ''
  form.brand = mapped.brand || ''
  form.basePriceUSD = mapped.basePriceUSD
  form.salePriceUSD = mapped.salePriceUSD === '' || mapped.salePriceUSD === undefined ? null : mapped.salePriceUSD
  form.stock = mapped.stock
  form.type = mapped.type
  form.status = mapped.status
  form.featured = mapped.featured
  form.categoryId = mapped.categoryId || ''
  form.tags = [...mapped.tags]
  form.meta = {
    ...createEmptyMeta(),
    ...mapped.meta,
  }
  form.existingMainImageUrl = mapped.existingMainImageUrl || ''
  form.existingThreeDModelUrl = mapped.existingThreeDModelUrl || ''

  mainImageFile.value = null
  mainImagePreview.value = mapped.existingMainImageUrl || ''
  modelFile.value = null
  categorySearch.value = ''
  tagInput.value = ''
  slugDraft.value = mapped.slug
  slugTouched.value = true
  slugGeneratedOnce.value = Boolean(mapped.slug)
  slugCheckState.value = 'idle'

  clearGalleryAssets()
  galleryAssets.value = (mapped.existingGalleryUrls || []).map((url, index) => ({
    id: `existing-${index}`,
    name: url.split('/').pop() || `gallery-${index + 1}`,
    previewUrl: url,
    existingUrl: url,
  }))

  attributeRows.value = mapAssignmentsToAttributeRows(product.attributes)
}

const checkSlugAvailability = async (slug: string) => {
  const normalized = normalizeProductSlug(slug)
  if (!normalized) {
    slugCheckState.value = 'idle'
    return
  }

  slugCheckState.value = 'checking'
  try {
    const isAvailable = await productService.checkAdminProductSlug(
      normalized,
      props.mode === 'edit' && props.productId ? props.productId : undefined,
    )
    slugCheckState.value = isAvailable ? 'available' : 'taken'
  } catch {
    slugCheckState.value = 'idle'
  }
}

const parseOptionsText = (value: string): ProductAttributeOption[] => {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ label: item, value: item }))
}

const submitCreateAttribute = async () => {
  if (!createAttributeForm.name.trim()) {
    await Swal.fire({ icon: 'error', title: 'خطا', text: 'نام ویژگی الزامی است' })
    return
  }
  if (!createAttributeForm.slug.trim()) {
    await Swal.fire({ icon: 'error', title: 'خطا', text: 'Slug ویژگی الزامی است' })
    return
  }

  let defaultValueJson: unknown = undefined
  if ((createAttributeForm.dataType === 'json' || createAttributeForm.dataType === 'multiselect') && createAttributeForm.defaultValueJsonText.trim()) {
    try {
      defaultValueJson = JSON.parse(createAttributeForm.defaultValueJsonText)
    } catch {
      await Swal.fire({ icon: 'error', title: 'خطا', text: 'مقدار پیش‌فرض JSON معتبر نیست' })
      return
    }
  }

  const payload: CreateReusableProductAttributePayload = {
    name: createAttributeForm.name.trim(),
    slug: createAttributeForm.slug.trim(),
    dataType: createAttributeForm.dataType,
    unit: createAttributeForm.unit.trim() || undefined,
    options: isAttributeOptionsVisible.value ? parseOptionsText(createAttributeForm.optionsText) : undefined,
    isFilterable: createAttributeForm.isFilterable,
    isVisible: createAttributeForm.isVisible,
    defaultValueText: createAttributeForm.defaultValueText.trim() || undefined,
    defaultValueNumber: createAttributeForm.defaultValueNumber,
    defaultValueBoolean: createAttributeForm.dataType === 'boolean' ? createAttributeForm.defaultValueBoolean : undefined,
    defaultValueJson,
  }

  isCreatingAttribute.value = true
  try {
    const created = await productAttributeService.createReusableAttribute(payload)
    reusableAttributes.value = [created, ...reusableAttributes.value]
    const emptyRow = attributeRows.value.find((item) => !item.attributeId)
    if (emptyRow) {
      emptyRow.attributeId = created.id
    } else {
      attributeRows.value = normalizeAttributeDisplayOrders([
        ...attributeRows.value,
        { ...createEmptyAttributeRow(attributeRows.value.length), attributeId: created.id },
      ])
    }
    closeCreateAttributeModal()
    await Swal.fire({ icon: 'success', title: 'موفق', text: 'ویژگی reusable ساخته شد', timer: 1400, showConfirmButton: false })
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'خطا', text: extractApiErrorMessage(error, 'ساخت ویژگی reusable انجام نشد') })
  } finally {
    isCreatingAttribute.value = false
  }
}

const getReusableAttribute = (attributeId: string) => reusableAttributes.value.find((item) => item.id === attributeId)

const buildAttributeAssignments = (): ProductAttributeAssignment[] => {
  return normalizeAttributeDisplayOrders(attributeRows.value)
    .filter((row) => row.attributeId)
    .map((row) => {
      const attribute = getReusableAttribute(row.attributeId)
      const base: ProductAttributeAssignment = {
        attributeId: row.attributeId,
        displayOrder: row.displayOrder,
        overrideUnit: row.overrideUnit.trim() || undefined,
        name: attribute?.name,
        slug: attribute?.slug,
        dataType: attribute?.dataType,
        isVisible: attribute?.isVisible,
        isFilterable: attribute?.isFilterable,
      }

      if (!attribute) return base

      switch (attribute.dataType) {
        case 'number':
          return { ...base, valueNumber: row.valueNumber === '' ? undefined : Number(row.valueNumber) }
        case 'boolean':
          return { ...base, valueBoolean: row.valueBoolean }
        case 'json':
          return { ...base, valueJson: row.valueJson.trim() ? JSON.parse(row.valueJson) : undefined }
        case 'multiselect':
          return { ...base, valueJson: row.valueMultiText }
        default:
          return { ...base, valueText: row.valueText.trim() || undefined }
      }
    })
}

const validateAttributeRows = () => {
  const errors: string[] = []
  const seenIds = new Set<string>()

  attributeRows.value.forEach((row, index) => {
    if (!row.attributeId) return

    if (seenIds.has(row.attributeId)) {
      errors.push(`ویژگی تکراری در ردیف ${index + 1} مجاز نیست`)
      return
    }
    seenIds.add(row.attributeId)

    const attribute = getReusableAttribute(row.attributeId)
    if (!attribute) {
      errors.push(`ویژگی ردیف ${index + 1} در لیست reusable پیدا نشد`)
      return
    }

    if ((attribute.dataType === 'text' || attribute.dataType === 'select') && !row.valueText.trim()) {
      errors.push(`مقدار ویژگی ردیف ${index + 1} الزامی است`)
    }

    if (attribute.dataType === 'number' && row.valueNumber !== '' && Number.isNaN(Number(row.valueNumber))) {
      errors.push(`مقدار عددی ردیف ${index + 1} معتبر نیست`)
    }

    if (attribute.dataType === 'json' && row.valueJson.trim()) {
      try {
        JSON.parse(row.valueJson)
      } catch {
        errors.push(`JSON ردیف ${index + 1} معتبر نیست`)
      }
    }
  })

  return errors
}

const validateForm = () => {
  const errors: string[] = []
  if (props.mode === 'edit' && !form.sku.trim()) errors.push('SKU الزامی است')
  if (!form.title.trim()) errors.push('عنوان محصول الزامی است')
  if (!form.slug.trim()) errors.push('Slug الزامی است')
  if (form.slug.trim().length > MAX_SLUG_LENGTH) errors.push('Slug نمی‌تواند بیشتر از 16 کاراکتر باشد')
  if (slugCheckState.value === 'taken') errors.push('این اسلاگ قبلاً ثبت شده است')
  if (props.mode === 'edit' && !form.technicalCode.trim()) errors.push('Technical code الزامی است')
  if (props.mode === 'edit' && !form.brandId && !form.brand.trim()) errors.push('برند الزامی است')
  if (!form.categoryId) errors.push('دسته‌بندی محصول الزامی است')
  if (Number(form.basePriceUSD) < 0) errors.push('قیمت اصلی نمی‌تواند منفی باشد')
  if (form.salePriceUSD !== null && Number(form.salePriceUSD) < 0) errors.push('قیمت فروش نمی‌تواند منفی باشد')
  if (Number(form.stock) < 0) errors.push('موجودی نمی‌تواند منفی باشد')
  errors.push(...validateAttributeRows())
  return errors
}

const resetForm = () => {
  clearGalleryAssets()
  clearMainImage()
  clearModelFile()
  form.sku = ''
  form.title = ''
  form.slug = ''
  form.technicalCode = ''
  form.brandId = ''
  form.brand = ''
  form.basePriceUSD = 0
  form.salePriceUSD = null
  form.stock = 0
  form.type = 'Industrial'
  form.status = 'draft'
  form.featured = false
  form.categoryId = ''
  categorySearch.value = ''
  form.tags = []
  form.meta = createEmptyMeta()
  form.existingMainImageUrl = ''
  form.existingThreeDModelUrl = ''
  slugDraft.value = ''
  isSlugEditing.value = false
  slugGeneratedOnce.value = false
  slugCheckState.value = 'idle'
  tagInput.value = ''
  attributeRows.value = [createEmptyAttributeRow(0)]
  validationErrors.value = []
  errorMessage.value = ''
  slugTouched.value = false
}

const submitForm = async () => {
  validationErrors.value = validateForm()
  errorMessage.value = ''
  if (validationErrors.value.length) return

  const payload: ProductFormPayload = {
    sku: form.sku.trim(),
    title: form.title.trim(),
    slug: normalizeProductSlug(form.slug.trim()),
    meta: {
      ...form.meta,
      shortDescription: form.meta.shortDescription.trim(),
      description: form.meta.description.trim(),
      metaTitle: form.meta.metaTitle.trim(),
      metaDescription: form.meta.metaDescription.trim(),
      shareTitle: form.meta.shareTitle.trim(),
      shareDescription: form.meta.shareDescription.trim(),
      shareImageUrl: form.meta.shareImageUrl.trim(),
    },
    technicalCode: form.technicalCode.trim(),
    brandId: form.brandId ?? '',
    brand: selectedBrand.value?.name || form.brand.trim(),
    basePriceUSD: Number(form.basePriceUSD),
    salePriceUSD: form.salePriceUSD === null ? null : Number(form.salePriceUSD),
    stock: Number(form.stock),
    featured: form.featured,
    type: form.type,
    status: form.status,
    primaryCategoryId: form.categoryId || undefined,
    categoryIds: form.categoryId ? [form.categoryId] : [],
    tags: [...form.tags],
    attributes: buildAttributeAssignments(),
    existingMainImageUrl: form.existingMainImageUrl || undefined,
    existingGalleryUrls: galleryAssets.value.map((item) => item.existingUrl).filter(Boolean) as string[],
    existingThreeDModelUrl: form.existingThreeDModelUrl || undefined,
    mainImage: mainImageFile.value,
    images: galleryAssets.value.map((item) => item.file).filter(Boolean) as File[],
    model3d: modelFile.value,
  }

  isSubmitting.value = true
  try {
    const response =
      props.mode === 'edit' && props.productId
        ? await productService.updateAdminProduct(props.productId, payload)
        : await productService.createAdminProduct(payload)
    await Swal.fire({ icon: 'success', title: 'محصول ایجاد شد', text: 'محصول با موفقیت ذخیره شد', timer: 1500, showConfirmButton: false })
    router.push(`/admin/products/${response.id}`)
  } catch (error) {
    errorMessage.value = extractApiErrorMessage(error, 'ذخیره محصول انجام نشد')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => form.title,
  (value) => {
    if (slugTouched.value || slugGeneratedOnce.value || form.slug.trim()) return
    if (slugAutofillTimeout.value) window.clearTimeout(slugAutofillTimeout.value)
    slugAutofillTimeout.value = window.setTimeout(() => {
      form.slug = normalizeProductSlug(value)
      slugDraft.value = form.slug
      slugGeneratedOnce.value = Boolean(form.slug)
    }, 1200)
  },
)

watch(
  () => createAttributeForm.name,
  (value) => {
    if (!createAttributeSlugTouched.value) createAttributeForm.slug = generateEnglishSlug(value)
  },
)

watch(
  () => form.slug,
  (value) => {
    const normalized = normalizeProductSlug(value)
    if (normalized !== value) {
      form.slug = normalized
      return
    }
    if (!isSlugEditing.value) slugDraft.value = value
    if (slugCheckTimeout.value) window.clearTimeout(slugCheckTimeout.value)
    if (!value) {
      slugCheckState.value = 'idle'
      return
    }
    slugCheckTimeout.value = window.setTimeout(() => {
      checkSlugAvailability(value)
    }, SLUG_CHECK_DELAY)
  },
)

watch(
  () => form.type,
  () => {
    if (form.categoryId && !filteredCategories.value.some((item) => item.id === form.categoryId)) {
      form.categoryId = ''
    }
    if (form.brandId && !filteredBrands.value.some((item) => item.id === form.brandId)) {
      form.brandId = ''
    }
  },
)

onMounted(async () => {
  await loadBootData()
  if (!errorMessage.value) {
    try {
      await loadProduct()
    } catch (error) {
      errorMessage.value = extractApiErrorMessage(error, 'بارگذاری اطلاعات محصول انجام نشد')
    }
  }
})

onBeforeUnmount(() => {
  if (slugAutofillTimeout.value) window.clearTimeout(slugAutofillTimeout.value)
  if (slugCheckTimeout.value) window.clearTimeout(slugCheckTimeout.value)
  revokeObjectUrl(mainImageObjectUrl.value)
  galleryAssets.value.forEach((item) => revokeObjectUrl(item.file ? item.previewUrl : ''))
})
</script>

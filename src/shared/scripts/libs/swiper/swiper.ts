import Swiper from 'swiper';
import type { SwiperOptions, Swiper as SwiperInstance, NavigationOptions, PaginationOptions } from 'swiper/types'
import {
  Autoplay,
  Controller,
  EffectFade,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs,
} from 'swiper/modules';

// --- Глубокое слияние объектов (deep merge) ---
const deepMerge = <T extends object, U extends object>(target: T, source: U): T & U => {
  const output = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    output[key as keyof typeof output] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge((target as any)[key] || {}, value)
        : value;
  });
  return output as T & U;
};

// --- Чистка всех data-swiper* атрибутов ---
const cleanSwiperDataAttrs = (slider: HTMLElement) => {
  Object.keys(slider.dataset)
    .filter(key => key.startsWith('swiper'))
    .forEach(key => {
      delete slider.dataset[key as keyof typeof slider.dataset];
    });
};

// --- Дефолтные настройки Swiper ---
const defaultConfig: SwiperOptions = {
  modules: [
    EffectFade,
    Navigation,
    Pagination,
    Thumbs,
    Keyboard,
    Autoplay,
    FreeMode,
    Controller,
  ],
  slidesPerView: 'auto',
  speed: 800,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
};

// --- Хранилище инстансов Swiper ---
const readySliders: Record<string, SwiperInstance> = {};

// --- Получение кастомных параметров (data-swiper-params) ---
const getCustomParams = (slider: HTMLElement): SwiperOptions => {
  const params = slider.dataset.swiperParams;
  return params ? JSON.parse(params) : {};
};

// --- Получить Swiper по ID ---
const getSlider = (sliderID?: string): SwiperInstance | undefined =>
  sliderID ? readySliders[sliderID] : undefined;

// --- Управление отображением навигации и пагинации ---
const updateNavigationAndPagination = (swiper: SwiperInstance) => {
  const sliderID = (swiper.el as HTMLElement).dataset.swiper;
  if (!sliderID) return;

  const navNext = document.querySelector<HTMLElement>(`[data-swiper-button-next="${sliderID}"]`);
  const navPrev = document.querySelector<HTMLElement>(`[data-swiper-button-prev="${sliderID}"]`);
  const showNav = swiper.snapGrid.length > 1;

  [navNext, navPrev].forEach(btn => btn?.classList.toggle('hidden', !showNav));

  if (swiper.pagination?.bullets) {
    const showBullets = swiper.pagination.bullets.length > 1;
    (swiper.pagination.el as HTMLElement | null)?.classList.toggle('hidden', !showBullets);
  }
};

// --- Инициализация Swiper ---
const init = (slider: HTMLElement): void => {
  const sliderID = slider.dataset.swiper;
  if (
    slider.dataset.swiperInit === 'true' ||
    !sliderID ||
    readySliders[sliderID]
  ) return;

  const sliderConfig = deepMerge(
    { ...defaultConfig },
    getCustomParams(slider)
  );

  sliderConfig.navigation = {
    nextEl: `[data-swiper-button-next="${sliderID}"]`,
    prevEl: `[data-swiper-button-prev="${sliderID}"]`,
    ...(typeof sliderConfig.navigation === 'object' && sliderConfig.navigation !== null ? sliderConfig.navigation : {}),
  } as NavigationOptions;

  sliderConfig.pagination = {
    el: `[data-swiper-pagination="${sliderID}"]`,
    type: 'bullets',
    clickable: true,
    modifierClass: 'slider-pagination-',
    bulletClass: 'slider-pagination__item',
    bulletActiveClass: 'slider-pagination__item_active',
    currentClass: 'slider-pagination__item_current',
    ...(typeof sliderConfig.pagination === 'object' && sliderConfig.pagination !== null ? sliderConfig.pagination : {}),
  } as PaginationOptions;

  sliderConfig.thumbs = {
    swiper: `[data-swiper-thumbs="${sliderID}"]`,
    ...(sliderConfig.thumbs || {}),
  };

  const swiperSlider = new Swiper(slider, sliderConfig);
  readySliders[sliderID] = swiperSlider;

  slider.dataset.swiperInit = 'true';

  // Навешиваем события по отдельности (TypeScript строг)
  const updateUI = () => updateNavigationAndPagination(swiperSlider);
  swiperSlider.on('init', updateUI);
  swiperSlider.on('resize', updateUI);
  swiperSlider.on('update', updateUI);
  swiperSlider.on('breakpoint', updateUI);
  swiperSlider.on('slidesLengthChange', updateUI);
  updateUI();
};

// --- Переинициализация Swiper ---
const reinit = (
  initialSlider: SwiperInstance,
  config?: SwiperOptions,
  rewrite = false
): SwiperInstance => {
  const sliderID = (initialSlider.el as HTMLElement).dataset.swiper!;
  const container = initialSlider.el as HTMLElement;

  // Сохраняем старые кастомные параметры, если новые не переданы
  const oldParams = getCustomParams(container);

  initialSlider.destroy(true, true);

  // Если config не передан, берем параметры из data-swiper-params
  let updatedParams: SwiperOptions;
  if (rewrite) {
    updatedParams = config || oldParams;
  } else {
    updatedParams = deepMerge(
      structuredClone(initialSlider.params),
      config || oldParams
    );
  }

  const newSlider = new Swiper(container, updatedParams);
  readySliders[sliderID] = newSlider;
  container.dataset.swiperInit = 'true';

  const updateUI = () => updateNavigationAndPagination(newSlider);
  newSlider.on('init', updateUI);
  newSlider.on('resize', updateUI);
  newSlider.on('update', updateUI);
  newSlider.on('breakpoint', updateUI);
  newSlider.on('slidesLengthChange', updateUI);
  updateUI();

  return newSlider;
};

// --- Удаление Swiper и чистка атрибутов ---
const destroy = (slider: HTMLElement): void => {
  const sliderID = slider.dataset.swiper;
  const current = getSlider(sliderID);

  if (current) {
    current.destroy(true, true);
    delete readySliders[sliderID!];
  }

  cleanSwiperDataAttrs(slider);
  slider.classList.remove('swiper-initialized', 'swiper-container-initialized');
};

// --- Экспортируем функции и хранилище ---
export { getSlider, init, reinit, destroy, readySliders };

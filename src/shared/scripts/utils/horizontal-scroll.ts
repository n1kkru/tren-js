const DELAY_MS = 150;

type ScrollState = {
  timer: number | null;
  enabled: boolean;
};

const stateMap = new WeakMap<HTMLElement, ScrollState>();

const handleLinksScroll = (e: WheelEvent): void => {
  const el = e.currentTarget as HTMLElement;
  let st = stateMap.get(el);

  if (!st) {
    st = { timer: null, enabled: false };
    stateMap.set(el, st);
  }

  if (!st.enabled) {
    if (st.timer === null) {
      st.timer = window.setTimeout(() => {
        const cur = stateMap.get(el);
        if (cur) cur.enabled = true;
      }, DELAY_MS);
    }
    return;
  }

  if (el.scrollWidth <= el.clientWidth) return;

  // Определяем, чем скроллить: deltaX (тачпад/сенсор) или deltaY (обычная мышка)
  let scrollAmount = 0;
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    scrollAmount = e.deltaX;
  } else {
    scrollAmount = e.deltaY;
  }

  if (scrollAmount === 0) return; // ничего не делать

  e.stopImmediatePropagation();
  e.preventDefault();
  el.scrollLeft += scrollAmount;
};


export const initHorizontalScroll = (): void => {
  document
    .querySelectorAll<HTMLElement>('[data-horizontal-scroll]')
    .forEach(el => {
      stateMap.set(el, { timer: null, enabled: false });

      el.addEventListener('mouseenter', () => {
        const st = stateMap.get(el);
        if (st?.timer) clearTimeout(st.timer);
        stateMap.set(el, { timer: null, enabled: false });
      });

      el.addEventListener('mouseleave', () => {
        const st = stateMap.get(el);
        if (st?.timer) clearTimeout(st.timer);
        stateMap.set(el, { timer: null, enabled: false });
      });

      el.addEventListener('wheel', handleLinksScroll, {
        passive: false,
        capture: true,
      });
    });
};

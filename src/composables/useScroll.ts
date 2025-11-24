import { ref } from 'vue';
import log from '@/utils/log';

/**
 * Composable for scrolling to the bottom of a scroll-view.
 * Automatically scrolls to the last element based on the provided selector generator.
 *
 * @param getSelector - Function that returns the CSS selector for the last element to scroll to.
 * @param componentInstance - The component instance (use `this` in Vue Options API or component ref in Composition API).
 * @returns Object containing scrollTop ref and scrollToBottom function.
 *
 * @example
 * import { useScrollToBottom } from '@/composables/useScroll';
 *
 * const messages = ref([]);
 * const { scrollTop, scrollToBottom } = useScrollToBottom(
 *   () => `#message-${messages.value.length - 1}`,
 *   getCurrentInstance()
 * );
 *
 * // In template: <scroll-view :scrollTop="scrollTop" ...>
 * // Call scrollToBottom() after data updates or in onMounted
 */
export function useScrollToBottom(
  getSelector: () => string,
  componentInstance: any
) {
  const scrollTop = ref(0);

  const scrollToBottom = () => {
    const selector = getSelector();
    log.info('useScrollToBottom: Scrolling to bottom with selector:', selector);
    uni.createSelectorQuery()
      .in(componentInstance)
      .select(selector)
      .boundingClientRect((rect: any) => {
        if (rect) {
          scrollTop.value = rect.bottom;
          log.info('useScrollToBottom: Scrolled to bottom, scrollTop set to:', rect.bottom);
        } else {
          log.warn('useScrollToBottom: Element not found for selector:', selector);
        }
      })
      .exec();
  };

  return {
    scrollTop,
    scrollToBottom,
  };
}
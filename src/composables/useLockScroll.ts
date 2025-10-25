import { onBeforeUnmount, onDeactivated, ref, watch } from "vue";

/**
 * 锁定页面滚动的组合式函数（仅在 H5 平台生效）
 * 用于防止弹窗、抽屉等组件显示时的滚动穿透问题
 * 
 * @param shouldLock - 返回是否应该锁定滚动的函数
 * @returns 包含 lock 和 unlock 方法的对象
 * 
 * @example
 * ```ts
 * // 在组件中使用
 * const visible = ref(false);
 * useLockScroll(() => visible.value);
 * ```
 */
export function useLockScroll(shouldLock: () => boolean) {
  const scrollLockCount = ref(0);

  const lock = () => {
    if (scrollLockCount.value === 0) {
      // #ifdef H5
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      // #endif
    }
    scrollLockCount.value++;
  };

  const unlock = () => {
    if (scrollLockCount.value > 0) {
      scrollLockCount.value--;
      if (scrollLockCount.value === 0) {
        // #ifdef H5
        document.getElementsByTagName("body")[0].style.overflow = "";
        // #endif
      }
    }
  };

  const destroy = () => {
    shouldLock() && unlock();
  };

  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });

  onDeactivated(destroy);
  onBeforeUnmount(destroy);

  return {
    lock,
    unlock,
  };
}

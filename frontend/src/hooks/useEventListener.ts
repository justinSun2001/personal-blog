import { onScopeDispose, unref, watch, type Ref } from "vue";

// 第一个重载签名: 参数是一个 DOM 元素和事件的名称和回调
export function useEventListener(
  element: Ref<HTMLElement | null | undefined>,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

// 第二个重载签名: 如果第一个参数是事件类型，默认为 window 元素
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

export function useEventListener(...args:any[]) {
  const element = typeof args[0] === "string" ? window : args.shift();

  let off =() => {};

 const stop = watch(
    () => unref(element),
    (el) => {
      off();

      if(!el) return;
      el.addEventListener(...args);

      off = () => el.removeEventListener(...args);
    },
    {immediate: true}
  );

  onScopeDispose(() => {
    off();
  });

  return () => {off(), stop()};
}
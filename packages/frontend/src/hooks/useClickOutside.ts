import { useEventListener } from './useEventListener';

export const useClickOutside = (
  ref: React.RefObject<HTMLElement> | null,
  callback: () => void
) => {
  useEventListener(
    'click',
    ({ target }: MouseEvent) => {
      if (ref && ref.current && target && ref.current.contains(target as Node)) {
        return;
      }
      callback();
    },
    document
  );
};

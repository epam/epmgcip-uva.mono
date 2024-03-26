import { useEffect, useRef } from 'react';

export const useEventListener = (
  eventType: 'click',
  callback: ({ target }: MouseEvent) => void,
  element = document
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) {
      return;
    }

    const eventHandler = (e: MouseEvent) =>
      callbackRef.current(e);

    element.addEventListener(eventType, eventHandler);

    return () => element.removeEventListener(eventType, eventHandler);
  }, [eventType, element]);
};

export const hideElement = (element: HTMLElement, message?: string, debounce?: number) => {
  setTimeout(() => {
    if (message) {
      element.innerText = message;
    }
  
    element.style.opacity = '0';
    element.style.zIndex = '-1';  
    element.style.pointerEvents = 'none';
  }, debounce ?? 0)
};

export const hideElement = (element: HTMLElement, message?: string, debounce?: number) => {
  setTimeout(() => {
    if (message) {
      element.innerText = message;
    }
  
    element.style.opacity = '0';
    element.style.zIndex = '-1';  
  }, debounce ?? 0)
};

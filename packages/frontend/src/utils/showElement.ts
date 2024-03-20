export const showElement = (element: HTMLElement, message?: string) => {
  if (message) {
    element.innerText = message;
  }

  element.style.opacity = '1';
  element.style.zIndex = '100';
  element.style.pointerEvents = 'all';
};

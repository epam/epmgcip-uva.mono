import { DEFAULT_NOTIFICATION } from "src/constants";
import { hideElement } from "./hideElement";
import { showElement } from "./showElement";

export const showNotification = (message: string, debounce: number) => {
    const notification = document.getElementById('notification');

    if (notification) {
        hideElement(notification, DEFAULT_NOTIFICATION, debounce);
        showElement(notification, message);
      }
}
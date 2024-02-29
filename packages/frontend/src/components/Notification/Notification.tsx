import { DEFAULT_NOTIFICATION } from 'src/constants';
import css from './Notification.module.sass';
import { hideElement } from 'src/utils/hideElement';

export const Notification = () => {
  const notification = document.getElementById('notification');
  const handleHideNotification = () => {
    if (notification) {
      hideElement(notification);
    }
  };

  return (
    <div id='notification' data-testid = 'notification-test-id' className={css.notificationWrapper} onClick={handleHideNotification}>
      {DEFAULT_NOTIFICATION}
    </div>
  );
};

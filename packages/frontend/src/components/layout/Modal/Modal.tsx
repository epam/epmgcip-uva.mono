import css from './Modal.module.sass';
import { Button } from '../../elements/Button/Button';
import { Loader } from '../../elements/Loader/Loader';
import { getClassesList } from 'src/utils/getClassesList';
import { useEffect } from 'react';

interface ModalProps {
  cancelButtonMessage: string;
  submitButtonMessage: string;
  isLoading: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  message: string;
  submitClassName?: string;
  cancelClassName?: string;
  onlySubmit?: boolean;
  headerMessage?: string;
}

export const Modal = ({
  headerMessage,
  cancelButtonMessage,
  submitButtonMessage,
  isLoading,
  handleClose,
  handleSubmit,
  message,
  submitClassName,
  cancelClassName,
  onlySubmit,
}: ModalProps) => {
  const submitClassNames = getClassesList(css.modalButton, submitClassName);
  const cancelClassNames = getClassesList(css.modalButton, cancelClassName);

  useEffect(() => {
    // prevents scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={css.modalWrapper}>
      <div className={css.modalContainer}>
        {headerMessage && <div className={css.modalHeader}>{headerMessage}</div>}
        <div className={css.modalMessage}>{message}</div>
        <div className={css.buttonsPanel}>
          {!onlySubmit && (
            <Button onClick={handleClose} className={cancelClassNames}>
              {cancelButtonMessage}
            </Button>
          )}
          <Button onClick={handleSubmit} className={submitClassNames} disabled={isLoading}>
            {isLoading ? <Loader size={'12px'} /> : submitButtonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
};

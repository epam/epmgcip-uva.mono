import css from './Modal.module.sass';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import { getClassesList } from 'src/utils';

interface ModalProps {
  cancelButtonMessage: string;
  submitButtonMessage: string;
  isLoading: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  message: string;
  submitClassName?: string;
  cancelClassName?: string;
}

export const Modal = ({
  cancelButtonMessage,
  submitButtonMessage,
  isLoading,
  handleClose,
  handleSubmit,
  message,
  submitClassName,
  cancelClassName,
}: ModalProps) => {
  const submitClassNames = getClassesList(css.deleteUserButton, submitClassName);
  const cancelClassNames = getClassesList(css.deleteUserButton, cancelClassName);

  return (
    <div className={css.modalWrapper}>
      <div className={css.modalContainer}>
        <div className={css.modalMessage}>{message}</div>
        <div className={css.buttonsPanel}>
          <Button onClick={handleClose} className={cancelClassNames}>
            {cancelButtonMessage}
          </Button>
          <Button
            onClick={handleSubmit}
            className={submitClassNames}
            disabled={isLoading}
          >
            {isLoading ? <Loader size={'12px'} /> : submitButtonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
};

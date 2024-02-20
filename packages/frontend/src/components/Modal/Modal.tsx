import css from './Modal.module.sass';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';

interface LoaderProps {
  cancelButtonMessage: string;
  submitButtonMessage: string;
  isLoading: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  message: string;
}

export const Modal = ({
  cancelButtonMessage,
  submitButtonMessage,
  isLoading,
  handleClose,
  handleSubmit,
  message,
}: LoaderProps) => {
  return (
    <div className={css.modalWrapper}>
      <div className={css.modalContainer}>
        <div className={css.modalMessage}>{message}</div>
        <div className={css.buttonsPanel}>
          <Button
            onClick={handleClose}
            className={`${css.deleteUserButton} ${css.backButton}`}
          >
            {cancelButtonMessage}
          </Button>
          <Button
            onClick={handleSubmit}
            className={`${css.deleteUserButton} ${css.submitButton}`}
            disabled={isLoading}
          >
            {isLoading ? <Loader size={'12px'} /> : submitButtonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Button, Input } from 'src/components';
import { IAction } from 'src/redux/types';
import Pencil from 'src/assets/pencil.svg';
import css from './Feedbacks.module.sass';

type InputChange = (value: string) => {
  type: string;
  payload: string;
};

export type OnInputChange = React.Dispatch<React.SetStateAction<string>> | InputChange | ((inputString: string) => IAction);

interface InputProps {
  value: string;
  setChange: OnInputChange;
  onClick: (() => void) | undefined;
}

export const FeedbackDetails = ({ value, setChange, onClick }: InputProps) => {
  return (
    <div className={css.feedbackForm}>
      <Input value={value} setChange={setChange} placeholder={'Комментарий о волонтёре'} />
      <Button onClick={onClick} className={`${css.createEventButton} ${css.submitButton}`}>
        <img src={Pencil} />
      </Button>
    </div>
  );
};

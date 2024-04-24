import { Button } from '../../elements/Button/Button';
import css from './Toolbar.module.sass';

interface ToolbarProps {
  title: string;
  buttonText: string;
  onClick: () => void;
}
export const Toolbar = ({ title, buttonText, onClick }: ToolbarProps) => {
  return (
    <div className={css.toolbarTitleWrapper}>
      <div className={css.toolbarTitle}>{title}</div>
      <Button className={css.toolbarButton} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};

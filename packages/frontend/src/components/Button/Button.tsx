import { getClassesList } from 'src/utils/getClassesList';
import css from './Button.module.sass';

interface ButtonProps {
  children: JSX.Element | string;
  onClick: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  className,
  id,
  disabled,
}: ButtonProps) => {
  const buttonClasses = getClassesList(css.button, className);

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

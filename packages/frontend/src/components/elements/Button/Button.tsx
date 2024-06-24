import { getClassesList } from 'src/utils/getClassesList';
import css from './Button.module.sass';

interface ButtonProps {
  children: JSX.Element | string | number;
  onClick?: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  stopPropagation?: boolean;
}

export const Button = ({
  children,
  onClick,
  className,
  id,
  disabled,
  stopPropagation,
}: ButtonProps) => {
  const buttonClasses = getClassesList(css.button, className);

  return (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        onClick && onClick();
      }}
      className={buttonClasses}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

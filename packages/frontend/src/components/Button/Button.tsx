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
  return (
    <button
      onClick={onClick}
      className={`${css.button} ${className}`}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

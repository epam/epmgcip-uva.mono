import css from './Link.module.sass'


interface ButtonProps {
  children: string | JSX.Element;
  onClick: () => void;
  className?: string;
}

export const Link = ({ children, onClick, className }: ButtonProps) => {
  return (
    <a className={`${css.link} ${className}`} onClick={onClick}>
      {children}
    </a>
  );
};

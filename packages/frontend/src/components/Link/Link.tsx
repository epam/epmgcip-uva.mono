import css from './Link.module.sass'


interface ButtonProps {
  children: string | JSX.Element;
  onClick: () => void;
  className?: string;
}

export const Link = ({ children, onClick, className }: ButtonProps) => {
  const linkClass = className ? `${css.link} ${className}` : css.link;

  return (
    <a className={linkClass} onClick={onClick}>
      {children}
    </a>
  );
};

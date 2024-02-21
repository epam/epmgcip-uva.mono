import css from './Loader.module.sass';

interface LoaderProps {
    size?: string;
    className?: string;
}

export const Loader = ({ size, className }: LoaderProps) => {
  const loadersClasses =  className ? `${css.loader} ${className}` : css.loader;

  return <div className={loadersClasses} style={{ width: size, height: size }}></div>;
};

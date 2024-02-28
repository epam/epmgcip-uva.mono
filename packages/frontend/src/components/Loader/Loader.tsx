import { getClassesList } from 'src/utils';
import css from './Loader.module.sass';

interface LoaderProps {
    size?: string;
    className?: string;
}

export const Loader = ({ size, className }: LoaderProps) => {
  const loadersClasses = getClassesList(css.loader, className);

  return <div className={loadersClasses} style={{ width: size, height: size }}></div>;
};

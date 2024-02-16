import css from './Loader.module.sass';

interface LoaderProps {
    size?: string;
}

export const Loader = ({ size }: LoaderProps) => {
  return <div className={css.loader} style={{ width: size, height: size }}></div>;
};

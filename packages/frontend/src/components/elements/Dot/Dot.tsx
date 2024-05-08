import { getClassesList } from 'src/utils/getClassesList';
import css from './Dot.module.sass';

interface IDotProps {
  color?: 'gray' | 'green';
}

export const Dot = ({ color }: IDotProps) => {
  return <span className={getClassesList(css.dot, css[color ?? 'gray'])}></span>;
};

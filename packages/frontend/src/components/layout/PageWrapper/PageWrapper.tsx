import { getClassesList } from 'src/utils/getClassesList';
import css from './PageWrapper.module.sass';

interface PageWrapperProps {
  page: JSX.Element;
  toolbar?: JSX.Element;
  withBottomBorder?: boolean;
}
export const PageWrapper = ({ page, toolbar, withBottomBorder = true }: PageWrapperProps) => {
  return (
    <div className={css.pageWrapper}>
      {toolbar !== undefined && (
        <div
          className={getClassesList(
            css.pagePanelWrapper,
            withBottomBorder ? css.bottomBorder : undefined
          )}
        >
          {toolbar}
        </div>
      )}
      {page}
    </div>
  );
};

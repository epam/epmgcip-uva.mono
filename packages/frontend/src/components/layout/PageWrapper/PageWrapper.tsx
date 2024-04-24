import css from './PageWrapper.module.sass';

interface PageWrapperProps {
  page: JSX.Element;
  toolbar?: JSX.Element;
}
export const PageWrapper = ({ page, toolbar }: PageWrapperProps) => {
  return (
    <div className={css.pageWrapper}>
      {toolbar !== undefined && <div className={css.pagePanelWrapper}>{toolbar}</div>}
      {page}
    </div>
  );
};

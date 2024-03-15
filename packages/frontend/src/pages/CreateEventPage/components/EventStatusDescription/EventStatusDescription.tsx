import css from './EventStatusDescription.module.sass';
import translation from 'src/translations/Russian.json';

export const EventStatusDescription = () => {
  return (
    <>
      <div className={css.eventStatusDescription}>
        <b>{translation.draftTitle}</b>
        {translation.draftDescription}
      </div>
      <div className={css.eventStatusDescription}>
        <b>{translation.activeTitle}</b>
        {translation.activeDescription}
      </div>
    </>
  );
};

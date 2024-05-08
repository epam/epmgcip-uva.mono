import translation from 'src/translations/Russian.json';
import { EventStatus, IEvent, Language } from 'src/types';
import css from './EventCard.module.sass';
import CalendarSvg from 'src/assets/calendar.svg';
import TimeSvg from 'src/assets/time.svg';
import GroupSvg from 'src/assets/group.svg';
import LocationSvg from 'src/assets/location.svg';
import { getClassesList } from 'src/utils/getClassesList';
import { Dot } from 'src/components';
import { useRegistrationStatus } from 'src/hooks/useRegistrationStatus';

export const EventCard = ({ event }: { event: IEvent }) => {
  const isRegistrationOpen = useRegistrationStatus(event);
  return (
    <article className={css.eventCard}>
      <div className={css.eventCardImageWrapper}>
        <img className={css.eventCardImage} src={event.image} />
        <div className={css.eventCardStatusBar}>
          <div className={css.eventCardStatus}>
            <Dot color={event.status === EventStatus.Active ? 'green' : 'gray'} />
            <div>{translation[(event.status + 'Event') as keyof typeof translation]}</div>
          </div>
          <div className={css.eventCardVolunteersQuantity}>
            <img className={css.groupIcon} src={GroupSvg} />
            {/* todo: query real number of volonteers here */}
            <span>{'0/' + event.volunteersQuantity}</span>
          </div>
        </div>
      </div>
      <div className={css.eventCardInfo}>
        <header>
          <h2 className={css.eventCardTitle}>
            {event.languageSpecificData?.[Language.Russian]?.name}
          </h2>
        </header>
        <div
          className={getClassesList(
            css.evenCardRegistration,
            isRegistrationOpen ? css._open : css._closed
          )}
        >
          {isRegistrationOpen ? translation.registrationOpened : translation.registrationClosed}
        </div>
        <section className={css.eventCardAdditionalInfo}>
          <div className={css.eventCardAdditionalInfoLine}>
            <img className={css.eventCardIcon} src={LocationSvg} />
            {event.languageSpecificData[Language.Russian]?.place}
          </div>
          <div className={css.eventCardAdditionalInfoLine}>
            <img className={css.eventCardIcon} src={CalendarSvg} />
            {event.startDate && new Date(event.startDate).toLocaleDateString()}
            {event.endDate && ` – ${new Date(event.endDate).toLocaleDateString()}`}
          </div>
          <div className={css.eventCardAdditionalInfoLine}>
            <img className={css.eventCardIcon} src={TimeSvg} />
            {event.startTime}
            {event.endTime && ` – ${event.endTime}`}
          </div>
        </section>
      </div>
    </article>
  );
};

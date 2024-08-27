import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, getEventNameInLanguage, getEventPlaceInLanguage } from 'src/utils/getEvent';
import { EventStatus, IEvent, Language, languagesShort } from 'src/types';
import { Toolbar } from './components/Toolbar/Toolbar';
import translation from 'src/translations/Russian.json';
import { EVENTS_ROUTE, languagesLong, VOLUNTEERS_ROUTE } from 'src/constants';
import css from './EventDetailsPage.module.sass';
import { Dot } from 'src/components';
import GroupSvg from 'src/assets/group.svg';
import UserSvg from 'src/assets/user.svg';
import TranslationSvg from 'src/assets/translation.svg';
import MapPinSvg from 'src/assets/mapPin.svg';
import CalendarSvg from 'src/assets/calendar.svg';
import TimeSvg from 'src/assets/time.svg';
import { getFormatDate } from 'src/components/formElements/DatePicker/utils';

export interface IToolbarActions {
  title: string;
  onClick: () => void;
}

type EventLanguageSpecificData = {
  description: string;
  name: string;
  place: string;
  type: Language;
};

export const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const buttonBack = { title: translation.return, onClick: () => navigate(EVENTS_ROUTE) };
  const menuActions: IToolbarActions[] = [
    { title: translation.edit, onClick: () => navigate(`/event/edit/${eventId}`) },
    { title: translation.closeRecruitment, onClick: () => console.log('Closing recruitment') },
  ];
  const languageDataArray: EventLanguageSpecificData[] = event
    ? Object.values(event.languageSpecificData.data)
    : [];

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const eventData = await getEvent(eventId);
          if (eventData) {
            setEvent(eventData);
          } else {
            setError('Event not found');
          }
        } catch (err) {
          console.error('Error fetching event:', err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No eventId provided');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <Toolbar menuActions={menuActions} buttonBack={buttonBack} />

      {event ? (
        <div>
          {imageLoading && <div>Loading Image...</div>}
          <div className={css.imageContainer}>
            {!imageLoading && (
              <div className={css.overlayTop}>
                {languageDataArray.map(lang => (
                  <span key={lang.type} className={css.eventLanguages}>
                    {languagesShort[lang.type]}
                  </span>
                ))}
              </div>
            )}

            <img
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              src={event.imageUrl}
              alt="Event"
              className={css.image}
            />
            {!imageLoading && (
              <div className={css.overlayBottom}>
                <div className={css.eventStatus}>
                  <Dot color={event.status === EventStatus.Active ? 'green' : 'gray'} />
                  <div
                    style={{
                      color: event.status === EventStatus.Active ? 'green' : 'gray',
                      marginLeft: '5px',
                    }}
                  >
                    {translation[(event.status + 'Event') as 'draftEvent']}
                  </div>
                </div>
                <div className={css.recruitmentWrapper}>
                  <span className={css.recruitmentStatus}>{translation.openedRecruitment}</span>
                </div>
                <div className={css.participantsWrapper}>
                  <span className={css.participants}>
                    <img className={css.groupIcon} src={GroupSvg} />
                    <span className={css.newApplications}>0</span>
                    <span style={{ color: '#6B6888' }}>/</span>
                    <span className={css.acceptedApplications}>0</span>
                    <span style={{ color: '#6B6888' }}>/</span>
                    <span className={css.participantsMaxNumber}>{event.volunteersQuantity}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={css.eventTitleWrapper}>
            <span className={css.eventTitle}>{getEventNameInLanguage(event)}</span>
          </div>
          <div className={css.paricipantsTgChatWrapper}>
            {event.status !== 'draft' ? (
              <button
                onClick={() => navigate(VOLUNTEERS_ROUTE)}
                className={css.paricipantsTgChatButtons}
              >
                {translation.participantsList}
              </button>
            ) : (
              <button disabled className={css.paricipantsTgChatButtons}>
                {translation.participantsList}
              </button>
            )}
            {event.telegramChannelLink ? (
              <a
                href={event.telegramChannelLink}
                target="_blank"
                className={css.paricipantsTgChatButtons}
              >
                {translation.telegramChat}
              </a>
            ) : (
              <a aria-disabled className={css.paricipantsTgChatButtons}>
                {translation.telegramChat}
              </a>
            )}
          </div>
          <div className={css.wrapperForInfoBlock}>
            <div>
              <img className={css.eventInfoIcons} src={UserSvg} />
              <span>Пол: {translation[event.gender]}</span>
            </div>
            <div className={css.ageInfo}>
              {translation.age}: {event.ageMin} - {event.ageMax}
            </div>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <img className={css.eventInfoIcons} src={TranslationSvg} />
            {languageDataArray
              .filter(lang => Object.values(Language).includes(lang.type))
              .map(lang => languagesLong[lang.type])
              .flat()
              .join(', ')}
          </div>
          <div className={css.wrapperForInfoBlock}>
            <img className={css.eventInfoIcons} src={MapPinSvg} />
            <span>{getEventPlaceInLanguage(event)}</span>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <img className={css.eventInfoIcons} src={CalendarSvg} />
            <span>
              {getFormatDate(event.startDate, '.')} - {getFormatDate(event.endDate as string, '.')}
            </span>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <img className={css.eventInfoIcons} src={TimeSvg} />
            <span>
              {event.startTime} - {event.endTime}
            </span>
            <div className={css.durationInfo}>{translation.totalHours} {event.duration}</div>
          </div>
          <div className={css.eventDescriptionWrapper}>
            <span className={css.eventDescription}>{translation.aboutEvent}</span>
          </div>
          <div className={css.wrapperForDescriptionBlock}>
            <span className={css.desciptionText}>{languageDataArray[0].description}</span>
          </div>
        </div>
      ) : (
        <p>No event data found</p>
      )}
    </div>
  );
};

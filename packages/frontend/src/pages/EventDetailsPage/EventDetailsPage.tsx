import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, getEventNameInLanguage, getEventPlaceInLanguage } from 'src/utils/getEvent';
import { IEvent } from 'src/types';
import { Toolbar } from './components/Toolbar/Toolbar';
import translation from 'src/translations/Russian.json';
import { EVENTS_ROUTE, VOLUNTEERS_ROUTE } from 'src/constants';
import css from './EventDetailsPage.module.sass';

export interface IToolbarActions {
  title: string;
  onClick: () => void;
}

type EventLanguageSpecificData = {
  description: string;
  name: string;
  place: string;
  type: string;
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
    { title: translation.edit, onClick: () => console.log('Redirection to edit event page') },
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
                    {lang.type == 'russian' ? 'Рус' : ''}
                    {lang.type == 'english' ? 'Eng' : ''}
                    {lang.type == 'uzbek' ? 'Uzb' : ''}
                    {lang.type == 'karapalak' ? 'Kaa' : ''}
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
                {event.status == 'active' ? (
                  <span className={css.activeEvent}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={css.dotIcon}
                      fill="#2aa616"
                      viewBox="0 0 15 20"
                    >
                      <path d="M7.8 10a2.2 2.2 0 004.4 0 2.2 2.2 0 00-4.4 0z"></path>
                    </svg>
                    {translation.activeEvent}
                  </span>
                ) : (
                  ''
                )}
                {event.status == 'draft' ? (
                  <span className={css.nonActiveEvent}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={css.dotIcon}
                      fill="#a1a9b9"
                      viewBox="0 0 15 20"
                    >
                      <path d="M7.8 10a2.2 2.2 0 004.4 0 2.2 2.2 0 00-4.4 0z"></path>
                    </svg>
                    {translation.draftEvent}
                  </span>
                ) : (
                  ''
                )}
                {event.status == 'completed' ? (
                  <span className={css.nonActiveEvent}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={css.dotIcon}
                      fill="#a1a9b9"
                      viewBox="0 0 15 20"
                    >
                      <path d="M7.8 10a2.2 2.2 0 004.4 0 2.2 2.2 0 00-4.4 0z"></path>
                    </svg>
                    {translation.completed}
                  </span>
                ) : (
                  ''
                )}
                <div className={css.recruitmentWrapper}>
                  <span className={css.recruitmentStatus}>Набор открыт</span>
                </div>
                <div className={css.participantsWrapper}>
                  <span className={css.participants}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className={css.participantsIcon}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
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
                Список участников
              </button>
            ) : (
              <button disabled className={css.paricipantsTgChatButtons}></button>
            )}
            {event.telegramChannelLink ? (
              <a
                href={event.telegramChannelLink}
                target="_blank"
                className={css.paricipantsTgChatButtons}
              >
                TG чат
              </a>
            ) : (
              <a aria-disabled className={css.paricipantsTgChatButtons}>
                TG чат
              </a>
            )}
          </div>
          <div className={css.wrapperForInfoBlock}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 19"
                stroke="currentColor"
                className={css.eventInfoIcons}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>Пол: {translation[event.gender]}</span>
            </div>
            <div className={css.ageInfo}>
              {translation.age}: {event.ageMin} - {event.ageMax}
            </div>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 21"
              stroke="currentColor"
              className={css.eventInfoIcons}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>
            {languageDataArray.map((lang, index) => (
              <span key={index}>
                {lang.type == 'russian' ? 'Русский' : ''}
                {lang.type == 'english' ? 'English,' : ''}
                {lang.type == 'qoraqalpoq' ? 'Karakalpak' : ''}
                {lang.type == 'uzbek' ? "O'zbek" : ''}
              </span>
            ))}
          </div>
          <div className={css.wrapperForInfoBlock}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 22"
              stroke="currentColor"
              className={css.eventInfoIcons}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <span>{getEventPlaceInLanguage(event)}</span>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 22"
              stroke="currentColor"
              className={css.eventInfoIcons}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <span>
              {event.startDate} - {event.endDate}
            </span>
          </div>
          <div className={css.wrapperForInfoBlock}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 22"
              stroke="currentColor"
              className={css.eventInfoIcons}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>
              {event.startTime} - {event.endTime}
            </span>
            <div className={css.durationInfo}>Всего часов: {event.duration}</div>
          </div>
          <div className={css.eventDescriptionWrapper}>
            <span className={css.eventDescription}>О событии</span>
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

import { useNavigate } from 'react-router-dom';
import { CREATE_EVENT_ROUTE, ROOT_ROUTE } from 'src/constants';
import { EventStatus, Gender, IEvent, IState, Language } from 'src/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import css from './ManageEventsPage.module.sass';
import LogoSvg from 'src/assets/logo.svg';
import translation from 'src/translations/Russian.json';
import { Toolbar } from 'src/components';
import { PageWrapper } from 'src/components';
import { EventCard } from './components/EventCard/EventCard';

export const ManageEventsPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
  }, [editor, navigate]);

  const handleCreateEvent = () => {
    navigate(CREATE_EVENT_ROUTE);
  };
  if (!isEditorHasPermissions) {
    return null;
  }

  // tmp data to show on page
  // todo: replace with real data
  const events: IEvent[] = [
    {
      id: '1',
      languageSpecificData: {
        [Language.Russian]: {
          type: Language.Russian,
          name: 'The point of attention is earthquake victims.',
          description: 'Описание',
          place: 'Uzbekistan, Mirzo Ulugbek District  ',
        },
        [Language.Uzbek]: {
          type: Language.Uzbek,
          name: 'Tadbir 1',
          description: 'Tavsif',
          place: 'Joy',
        },
        [Language.English]: {
          type: Language.English,
          name: 'Event 1',
          description: 'Description',
          place: 'Place',
        },
        [Language.Qoraqalpoq]: {
          type: Language.Qoraqalpoq,
          name: 'Tadbir 1',
          description: 'Tavsif',
          place: 'Joy',
        },
      },
      startDate: '2021-09-09',
      startTime: '09:00',
      endTime: '18:00',
      duration: '9',
      registrationDate: '2021-09-09',
      ageMin: 18,
      ageMax: 60,
      volunteersQuantity: '10',
      status: EventStatus.Active,
      image:
        'https://s3-alpha-sig.figma.com/img/39bf/7eca/105e6f3393ba71cb0f2985de0675d7b6?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gGofVn0xvG4bFL2TsdVM0O3W-Ml5-MKQ78Cj-dU6lzATvWjIAh-iZu8Op0zQ3UcAOGDicAoYtZn0Lea7KDihiyxrRjb6u2j1WrZCcHJrOZwFLQhcTrPT2q6A65XvyyeMtvJ5eWTkpfRUre1tNonOBjQh4PbVYjdNIODS-gNAzz2LgmPnWBWek6wS1zSJGcgvn~6GpfeTRUnT1ez~3L3kvyIyy6MxuQIQR5DB10Jzz-c7~mLlqDcOXgXF2A71S2h4pB6lX-5RrCPXqvxuueQhYmCj~DuCqPreSG8QcNBfQDEmLrmyMGE6j0gprSLAluQd89vyHKqvgKkj1KxrmUCl9g__',
      endDate: '2021-09-09',
      telegramChannelLink: 'https://t.me',
      gender: Gender.Men,
    },
  ];

  return (
    <PageWrapper
      toolbar={
        <Toolbar
          title={translation.events}
          buttonText={translation.create}
          onClick={handleCreateEvent}
        />
      }
      page={
        <div className={css.eventsBlockWrapper}>
          {events.length > 0 ? (
            events.map(event => <EventCard event={event} key={event.id} />)
          ) : (
            <>
              <img className={css.eventsBlockLogo} src={LogoSvg} />
              <div className={css.emptyMessage}>{translation.emptyEventsList}</div>
            </>
          )}
        </div>
      }
    />
  );
};

import { useNavigate } from 'react-router-dom';
import {
  EVENTS_ROUTE,
  EVENT_STATUS,
  LANGUAGE,
  ROOT_ROUTE,
  VOLUNTEER_GENDER,
} from 'src/constants';
import { EventStatus, IState } from 'src/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import css from './CreateEventPage.module.sass';
import translation from 'src/translations/Russian.json';
import { Button, Input, Loader, Select } from 'src/components';
import { EventStatusDescription } from './components/EventStatusDescription/EventStatusDescription';
import { EventTimeDuration } from './components/EventTimeDuration/EventTimeDuration';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPlace, setEventPlace] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [eventRegistrationDate, setEventRegistrationDate] = useState('');
  const [gender, setGender] = useState('');
  const [eventLanguage, setEventLanguage] = useState<string[]>([]);
  const [volunteersQuantity, setVolunteersQuantity] = useState('');
  const [telegramChannelLink, setTelegramChannelLink] = useState('');
  const [eventStatus, setEventStatus] = useState(EventStatus.Draft);

  const handleCreateEvent = () => {
    navigate(EVENTS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setIsCreating(() => true);

    handleCreateEvent();
  };

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
  }, [editor, navigate]);

  return (
    isEditorHasPermissions && (
      <div className={css.createEventWrapper}>
        <div className={css.createEventTitle}>{translation.createEvent}</div>
        <form className={css.createEventForm} onSubmit={handleSubmit}>
          <Input
            value={eventName}
            setChange={setEventName}
            labelText={translation.title}
            required
          />
          <Input
            value={eventDescription}
            setChange={setEventDescription}
            labelText={translation.description}
            required
          />
          <Input
            value={eventPlace}
            setChange={setEventPlace}
            labelText={translation.place}
            required
          />
          <Input
            value={eventStartDate}
            setChange={setEventStartDate}
            type='date'
            labelText={translation.eventStartDate}
            required
          />
          <EventTimeDuration
            eventStartTime={eventStartTime}
            setEventStartTime={setEventStartTime}
            eventEndTime={eventEndTime}
            setEventEndTime={setEventEndTime}
          />
          <Input
            value={eventEndDate}
            setChange={setEventEndDate}
            type='date'
            labelText={translation.eventEndDate}
          />
          <Input
            value={eventDuration}
            setChange={setEventDuration}
            type='number'
            labelText={translation.timeDuration}
            required
          />
          <Input
            value={eventRegistrationDate}
            setChange={setEventRegistrationDate}
            type='date'
            labelText={translation.registrationPeriod}
            required
          />
          <Select
            value={gender}
            setChange={setGender}
            options={VOLUNTEER_GENDER}
            labelText={translation.gender}
            required
            placeholder={translation.choice}
            selectClassName={!gender ? css.selectPlaceholder : undefined}
          />
          <Select
            value={eventLanguage}
            setChange={setEventLanguage}
            options={LANGUAGE}
            labelText={translation.language}
            multiple
            required
            placeholder={translation.choice}
            selectClassName={eventLanguage.length === 0 ? css.selectPlaceholder : undefined}
          />
          <Input
            value={volunteersQuantity}
            setChange={setVolunteersQuantity}
            type='number'
            labelText={translation.volunteersQuantity}
            required
          />
          <Input
            value={telegramChannelLink}
            setChange={setTelegramChannelLink}
            type='text'
            labelText={translation.telegramChannelLink}
          />
          <Select
            value={eventStatus}
            setChange={setEventStatus}
            options={EVENT_STATUS}
            labelText={translation.status}
            required
          />
          <EventStatusDescription />
          <div className={css.buttonsPanel}>
            <Button
              onClick={handleCreateEvent}
              className={`${css.createEventButton} ${css.backButton}`}
            >
              {translation.back}
            </Button>
            <Button
              onClick={() => null}
              className={`${css.createEventButton} ${css.submitButton}`}
              id='create-event-submit'
            >
              {isCreating ? <Loader size={'12px'} /> : translation.add}
            </Button>
          </div>
        </form>
      </div>
    )
  );
};

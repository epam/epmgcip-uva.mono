import { useNavigate } from 'react-router-dom';
import {
  EVENTS_ROUTE,
  EVENT_STATUS,
  LANGUAGE,
  ROOT_ROUTE,
  VOLUNTEER_GENDER,
} from 'src/constants';
import { EventStatus, Gender, IEvent, IState, Language } from 'src/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import css from './CreateEventPage.module.sass';
import translation from 'src/translations/Russian.json';
import { Button, Input, Loader, Select } from 'src/components';
import { EventStatusDescription } from './components/EventStatusDescription/EventStatusDescription';
import { EventTimeDuration } from './components/EventTimeDuration/EventTimeDuration';
import { Slider } from 'src/components/Slider/Slider';
import { ImageLoader } from 'src/components/ImageLoader/ImageLoader';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from 'src/components/DatePicker/DatePicker';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [image, setImage] = useState<File | null>(null);
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
  const [minVolunteersAge, setMinVolunteersAge] = useState(16);
  const [maxVolunteersAge, setMaxVolunteersAge] = useState(61);
  const [eventLanguage, setEventLanguage] = useState<Language[]>([]);
  const [volunteersQuantity, setVolunteersQuantity] = useState('');
  const [telegramChannelLink, setTelegramChannelLink] = useState('');
  const [eventStatus, setEventStatus] = useState(EventStatus.Draft);

  const handleCreateEvent = () => {
    navigate(EVENTS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setIsCreating(() => true);

    const newEvent: IEvent = {
      id: uuidv4(),
      name: eventName,
      description: eventDescription,
      place: eventPlace,
      startDate: eventStartDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      duration: eventDuration,
      registrationDate: eventRegistrationDate,
      gender: gender as Gender,
      ageMin: minVolunteersAge,
      ageMax: maxVolunteersAge,
      language: eventLanguage,
      volunteersQuantity: volunteersQuantity,
      status: eventStatus,
      image: image as File,
      endDate: eventEndDate,
      telegramChannelLink,
    };

    console.log(newEvent);

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
          <ImageLoader setImage={setImage} />
          <Input
            value={eventName}
            setChange={setEventName}
            labelText={translation.title}
            required
            labelClassName={css.createEventPadding}
          />
          <Input
            value={eventDescription}
            setChange={setEventDescription}
            labelText={translation.description}
            required
            labelClassName={css.createEventPadding}
          />
          <Input
            value={eventPlace}
            setChange={setEventPlace}
            labelText={translation.place}
            required
            labelClassName={css.createEventPadding}
          />
          <DatePicker
            value={eventStartDate}
            setChange={setEventStartDate}
            labelText={translation.eventStartDate}
            max={eventEndDate}
            required
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventStartDate ? css.selectPlaceholder : undefined}
          />
          <EventTimeDuration
            eventStartTime={eventStartTime}
            setEventStartTime={setEventStartTime}
            eventEndTime={eventEndTime}
            setEventEndTime={setEventEndTime}
          />
          <DatePicker
            value={eventEndDate}
            setChange={setEventEndDate}
            labelText={translation.eventEndDate}
            min={eventStartDate}
            required
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventEndDate ? css.selectPlaceholder : undefined}
          />
          <Input
            value={eventDuration}
            setChange={setEventDuration}
            type='number'
            labelText={translation.timeDuration}
            required
            labelClassName={css.createEventPadding}
          />
          <DatePicker
            value={eventRegistrationDate}
            setChange={setEventRegistrationDate}
            labelText={translation.registrationPeriod}
            max={eventStartDate}
            required
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventRegistrationDate ? css.selectPlaceholder : undefined}
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
          <Slider
            min={16}
            max={61}
            minValue={minVolunteersAge}
            setMinValue={setMinVolunteersAge}
            maxValue={maxVolunteersAge}
            setMaxValue={setMaxVolunteersAge}
            labelText={translation.age}
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
            labelClassName={css.createEventPadding}
          />
          <Input
            value={telegramChannelLink}
            setChange={setTelegramChannelLink}
            type='text'
            labelText={translation.telegramChannelLink}
            labelClassName={css.createEventPadding}
          />
          <Select
            value={eventStatus}
            setChange={setEventStatus}
            options={EVENT_STATUS}
            labelText={translation.status}
            required
            labelClassName={css.createEventPadding}
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

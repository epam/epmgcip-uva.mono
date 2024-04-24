import { useNavigate } from 'react-router-dom';
import { EVENTS_ROUTE, EVENT_STATUS, LANGUAGE, ROOT_ROUTE, VOLUNTEER_GENDER } from 'src/constants';
import { EventStatus, Gender, IEvent, IState, IValidationError, Language } from 'src/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import css from './CreateEventPage.module.sass';
import translation from 'src/translations/Russian.json';
import { Button, Input, Loader, Select } from 'src/components';
import { EventStatusDescription } from './components/EventStatusDescription/EventStatusDescription';
import { EventTimeDuration } from './components/EventTimeDuration/EventTimeDuration';
import { Slider } from 'src/components';
import { ImageLoader } from 'src/components';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from 'src/components';
import { TextArea } from 'src/components';
import { createEvent } from 'src/utils/createEvent';
import { Dispatch } from '@reduxjs/toolkit';
import { addEventsToList } from 'src/redux/actions';
import { validatEventValues } from 'src/utils/validateEventValues';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<IValidationError>({});

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

    setIsSubmitting(() => true);

    if (Object.keys(validation).length === 0) {
      const eventId = uuidv4();
      const newEvent: IEvent = {
        id: eventId,
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
        image: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/public/${eventId}`,
        endDate: eventEndDate,
        telegramChannelLink,
      };

      setIsCreating(() => true);

      createEvent(newEvent, image as File).then(result => {
        if (result) {
          dispatch(addEventsToList([newEvent]));
        }
        handleCreateEvent();
      });
    }
  };

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    setValidation(
      validatEventValues({
        name: eventName,
        description: eventDescription,
        place: eventPlace,
        startDate: eventStartDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        duration: eventDuration,
        registrationDate: eventRegistrationDate,
        gender: gender as Gender,
        language: eventLanguage.join(''),
        volunteersQuantity: volunteersQuantity,
        image: image ? image.name : '',
      })
    );
  }, [
    editor,
    navigate,
    eventName,
    eventDescription,
    eventStartDate,
    image,
    eventPlace,
    eventStartTime,
    eventEndTime,
    eventDuration,
    eventRegistrationDate,
    gender,
    eventLanguage,
    volunteersQuantity,
  ]);

  return (
    isEditorHasPermissions && (
      <div className={css.createEventWrapper}>
        <div className={css.createEventTitle}>{translation.createEvent}</div>
        <form className={css.createEventForm} onSubmit={handleSubmit}>
          <ImageLoader
            setImage={setImage}
            isValidationError={isSubmitting && !!validation.image}
            errorMessage={validation.image}
          />
          <Input
            value={eventName}
            setChange={setEventName}
            labelText={translation.title}
            required
            labelClassName={css.createEventPadding}
            isValidationError={isSubmitting && !!validation.name}
            errorMessage={validation.name}
          />
          <TextArea
            value={eventDescription}
            setChange={setEventDescription}
            labelText={translation.description}
            required
            labelClassName={css.createEventPadding}
            isValidationError={isSubmitting && !!validation.description}
            errorMessage={validation.description}
          />
          <Input
            value={eventPlace}
            setChange={setEventPlace}
            labelText={translation.place}
            required
            labelClassName={css.createEventPadding}
            isValidationError={isSubmitting && !!validation.place}
            errorMessage={validation.place}
          />
          <DatePicker
            value={eventStartDate}
            setChange={setEventStartDate}
            labelText={translation.eventStartDate}
            max={eventEndDate}
            required
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventStartDate ? css.selectPlaceholder : undefined}
            isValidationError={isSubmitting && !!validation.startDate}
            errorMessage={validation.startDate}
          />
          <EventTimeDuration
            eventStartTime={eventStartTime}
            setEventStartTime={setEventStartTime}
            eventEndTime={eventEndTime}
            setEventEndTime={setEventEndTime}
            isValidationErrorForStart={isSubmitting && !!validation.startTime}
            errorMessageForStart={validation.startTime}
            isValidationErrorForEnd={isSubmitting && !!validation.endTime}
            errorMessageForEnd={validation.endTime}
          />
          <DatePicker
            value={eventEndDate}
            setChange={setEventEndDate}
            labelText={translation.eventEndDate}
            min={eventStartDate}
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventEndDate ? css.selectPlaceholder : undefined}
          />
          <Input
            value={eventDuration}
            setChange={setEventDuration}
            type="number"
            labelText={translation.timeDuration}
            required
            labelClassName={css.createEventPadding}
            isValidationError={isSubmitting && !!validation.duration}
            errorMessage={validation.duration}
          />
          <DatePicker
            value={eventRegistrationDate}
            setChange={setEventRegistrationDate}
            labelText={translation.registrationPeriod}
            max={eventStartDate}
            required
            labelClassName={css.createEventPadding}
            datePickerClassName={!eventRegistrationDate ? css.selectPlaceholder : undefined}
            isValidationError={isSubmitting && !!validation.registrationDate}
            errorMessage={validation.registrationDate}
          />
          <Select
            value={gender}
            setChange={setGender}
            options={VOLUNTEER_GENDER}
            labelText={translation.gender}
            required
            placeholder={translation.choice}
            selectClassName={!gender ? css.selectPlaceholder : undefined}
            isValidationError={isSubmitting && !!validation.gender}
            errorMessage={validation.gender}
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
            isValidationError={isSubmitting && !!validation.language}
            errorMessage={validation.language}
          />
          <Input
            value={volunteersQuantity}
            setChange={setVolunteersQuantity}
            type="number"
            labelText={translation.volunteersQuantity}
            required
            labelClassName={css.createEventPadding}
            isValidationError={isSubmitting && !!validation.volunteersQuantity}
            errorMessage={validation.volunteersQuantity}
          />
          <Input
            value={telegramChannelLink}
            setChange={setTelegramChannelLink}
            type="text"
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
              id="create-event-submit"
            >
              {isCreating ? <Loader size={'12px'} /> : translation.add}
            </Button>
          </div>
        </form>
      </div>
    )
  );
};

import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DatePicker,
  ImageLoader,
  Input,
  Loader,
  Modal,
  Select,
  Slider,
} from 'src/components';
import { getShortDate } from 'src/components/formElements/DatePicker/utils';
import {
  EVENTS_ROUTE,
  EVENT_STATUS,
  LANGUAGE,
  ROOT_ROUTE,
  STORAGE_BUCKET,
  STORAGE_IMAGES_PATH,
  VOLUNTEER_GENDER,
} from 'src/constants';
import { saveEvents, setEventsLoading } from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import {
  CreateEventAlerts,
  EventStatus,
  Gender,
  IEvent,
  IState,
  IValidationError,
  Language,
  languages,
} from 'src/types';
import { createEvent } from 'src/utils/createEvent';
import { validateEventValues } from 'src/utils/validateEventValues';
import { v4 as uuidv4 } from 'uuid';
import css from './CreateEventPage.module.sass';
import { EventStatusDescription } from './components/EventStatusDescription/EventStatusDescription';
import { EventTimeDuration } from './components/EventTimeDuration/EventTimeDuration';
import { LanguageButtons } from './components/LanguageButtons/LanguageButtons';
import { LanguageSpecificFields } from './components/LanguageSpecificFields/LanguageSpecificFields';
import { LanguageEvent } from './types';
import { getEmptyLanguageData, languageSpecificDataReducer } from './utils/languages';

const submitTextMap: Record<CreateEventAlerts, string> = {
  [CreateEventAlerts.Leaving]: translation.leave,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.ok,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.delete,
  [CreateEventAlerts.None]: '',
};

const alertTextMap: Record<CreateEventAlerts, string> = {
  // todo: move all alerts messages to translation.alerts (group them)
  [CreateEventAlerts.Leaving]: translation.alerts.unsavedChanges,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.alerts.deletingLastEventLanguage,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.alerts.deleteEventLanguage,
  [CreateEventAlerts.None]: '',
};

const alertHeaderMap: Record<CreateEventAlerts, string> = {
  // todo: move all alerts messages to translation.alerts (group them)
  [CreateEventAlerts.Leaving]: translation.alerts.closePage,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.alerts.removeLanguage,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.alerts.removeLanguage,
  [CreateEventAlerts.None]: '',
};

// todo: this page needs simplification
export const CreateEventPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();

  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<IValidationError>({});
  const [alert, setAlert] = useState(CreateEventAlerts.None);

  const [image, setImage] = useState<File | null>(null);
  const [languageSpecificData, dispatchLanguageSpecificData] = useReducer(
    languageSpecificDataReducer,
    { data: { [Language.Russian]: getEmptyLanguageData(Language.Russian) } }
  );
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
    dispatch(saveEvents([], true, false));
    dispatch(setEventsLoading(true));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setIsSubmitting(() => true);

    if (Object.keys(validation).length === 0) {
      const eventId = uuidv4();
      const newEvent: IEvent = {
        id: eventId,
        languageSpecificData,
        startDate: getShortDate(eventStartDate),
        startTime: eventStartTime,
        endTime: eventEndTime,
        duration: eventDuration,
        registrationDate: eventRegistrationDate,
        gender: gender as Gender,
        ageMin: minVolunteersAge,
        ageMax: maxVolunteersAge,
        volunteersQuantity: volunteersQuantity,
        status: eventStatus,
        image: `${STORAGE_BUCKET}/${STORAGE_IMAGES_PATH}/${eventId}`,
        endDate: getShortDate(eventEndDate),
        telegramChannelLink,
      };

      setIsCreating(() => true);

      createEvent(newEvent, image as File).then(() => {
        handleCreateEvent();
      });
    }
  };

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    setValidation(
      validateEventValues(
        {
          startDate: eventStartDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          duration: eventDuration,
          registrationDate: eventRegistrationDate,
          gender: gender as Gender,
          language: eventLanguage.join(''),
          volunteersQuantity: volunteersQuantity,
          image: image ? image.name : '',
        },
        languageSpecificData.data
      )
    );
  }, [
    editor,
    navigate,
    languageSpecificData,
    eventStartDate,
    image,
    eventStartTime,
    eventEndTime,
    eventDuration,
    eventRegistrationDate,
    gender,
    eventLanguage,
    volunteersQuantity,
  ]);

  const combinedAlert =
    alert === CreateEventAlerts.None ? languageSpecificData.alert ?? CreateEventAlerts.None : alert;

  const closeModal = () => {
    if (languageSpecificData.alert) {
      dispatchLanguageSpecificData({
        event: LanguageEvent.ClearAlert,
        language: Language.Russian,
        withApproval: false,
      });
    } else {
      setAlert(CreateEventAlerts.None);
    }
  };

  const submitModal = () => {
    if (languageSpecificData.alert === CreateEventAlerts.ConfirmLanguageDeletion) {
      dispatchLanguageSpecificData({
        language: languageSpecificData.alertData!.language,
        withApproval: false,
        event: LanguageEvent.Toggle,
      });
    } else if (alert === CreateEventAlerts.Leaving) {
      handleCreateEvent();
    }

    closeModal();
  };

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
          <div className={css.postLanguages}>
            <LanguageButtons
              languages={languages}
              labelText={translation.addLanguage}
              dispatch={dispatchLanguageSpecificData}
              languageSpecificData={languageSpecificData}
            />
            {Object.values(languageSpecificData.data).map((lang, index) => (
              <LanguageSpecificFields
                key={lang.type}
                name={lang.name}
                description={lang.description}
                language={lang.type}
                place={lang.place}
                isLast={Object.keys(languageSpecificData).length === index + 1}
                dispatch={dispatchLanguageSpecificData}
                validation={validation}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
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
              onClick={() => setAlert(CreateEventAlerts.Leaving)}
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
        {combinedAlert !== CreateEventAlerts.None && (
          <Modal
            cancelButtonMessage={translation.cancel}
            submitButtonMessage={submitTextMap[combinedAlert]}
            isLoading={false}
            handleClose={closeModal}
            handleSubmit={submitModal}
            message={alertTextMap[combinedAlert]}
            submitClassName={
              combinedAlert === CreateEventAlerts.ForbidOnlyLanguageDeletion
                ? css.modalCancelButton
                : css.modalDeleteButton
            }
            cancelClassName={css.modalCancelButton}
            headerMessage={alertHeaderMap[combinedAlert]}
            onlySubmit={combinedAlert === CreateEventAlerts.ForbidOnlyLanguageDeletion}
          />
        )}
      </div>
    )
  );
};

import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, ImageLoader, Input, Loader, Modal, Select, Slider } from 'src/components';
import { RadioButton } from 'src/components/formElements/RadioButton/RadioButton';
import { getFormatDate, getShortDate } from 'src/components/formElements/DatePicker/utils';
import {
  DEFAULT_MAX_AGE,
  DEFAULT_MIN_AGE,
  EVENT_STATUS,
  EVENT_STATUS_FOR_ACTIVE,
  EVENTS_ROUTE,
  LANGUAGE,
  ROOT_ROUTE,
  STORAGE_BUCKET,
  STORAGE_IMAGES_PATH,
  VOLUNTEER_GENDER,
} from 'src/constants';
import { changeEventInitializerValue, saveEvents, setEventsLoading } from 'src/redux/actions';
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
  UpdateEventAlerts,
} from 'src/types';
import { getEvent } from 'src/utils/getEvent';
import { isCreateFormDirty, saveEvent } from 'src/utils/saveEvent';
import { validateEventValues } from 'src/utils/validateEventValues';
import { v4 as uuidv4 } from 'uuid';
import css from './EventFormPage.module.sass';
import { EventTimeDuration } from './components/EventTimeDuration/EventTimeDuration';
import { LanguageButtons } from './components/LanguageButtons/LanguageButtons';
import { LanguageSpecificFields } from './components/LanguageSpecificFields/LanguageSpecificFields';
import { LanguageEvent } from './types';
import { getEmptyLanguageData, languageSpecificDataReducer } from './utils/languages';

const submitTextMap: Record<CreateEventAlerts | UpdateEventAlerts, string> = {
  [CreateEventAlerts.Leaving]: translation.leave,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.ok,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.delete,
  [CreateEventAlerts.None]: '',
  [UpdateEventAlerts.None]: '',
  [UpdateEventAlerts.ConfirmUpdateDraft]: translation.yes,
  [UpdateEventAlerts.ConfirmUpdateActive]: translation.yes,
  [UpdateEventAlerts.ConfirmPublishToTelegram]: translation.yes,
  [UpdateEventAlerts.ConfirmDeleteFromTelegram]: translation.yes,
  [UpdateEventAlerts.ShowEventPublishSuccess]: translation.yes,
  [UpdateEventAlerts.ShowEventPublishCancellation]: translation.yes,
  [UpdateEventAlerts.ConfirmAddNewLanguageSpecificData]: translation.yes,
  [UpdateEventAlerts.ConfirmDefaultUpdate]: translation.yes,
  [UpdateEventAlerts.ConfirmEventWithExistingStatusActive]: translation.yes,
};

const alertTextMap: Record<CreateEventAlerts | UpdateEventAlerts, string> = {
  // todo: move all alerts messages to translation.alerts (group them)
  [CreateEventAlerts.Leaving]: translation.alerts.unsavedChanges,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.alerts.deletingLastEventLanguage,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.alerts.deleteEventLanguage,
  [CreateEventAlerts.None]: '',
  [UpdateEventAlerts.None]: '',
  [UpdateEventAlerts.ConfirmUpdateDraft]: translation.yes,
  [UpdateEventAlerts.ConfirmUpdateActive]: translation.updateEvent,
  [UpdateEventAlerts.ConfirmPublishToTelegram]: translation.saveAndPublishToTG,
  [UpdateEventAlerts.ConfirmDeleteFromTelegram]: translation.saveAndDeleteFromTG,
  [UpdateEventAlerts.ShowEventPublishSuccess]: translation.changesSavedEventPublished,
  [UpdateEventAlerts.ShowEventPublishCancellation]: translation.changesSavedEventCanceclled,
  [UpdateEventAlerts.ConfirmAddNewLanguageSpecificData]: translation.addNewLanguageSpecificData,
  [UpdateEventAlerts.ConfirmDefaultUpdate]: translation.askSaveChanges,
  [UpdateEventAlerts.ConfirmEventWithExistingStatusActive]: translation.saveEventWithExistingStatusActive,
};

const alertHeaderMap: Record<CreateEventAlerts | UpdateEventAlerts, string> = {
  // todo: move all alerts messages to translation.alerts (group them)
  [CreateEventAlerts.Leaving]: translation.alerts.closePage,
  [CreateEventAlerts.ForbidOnlyLanguageDeletion]: translation.alerts.removeLanguage,
  [CreateEventAlerts.ConfirmLanguageDeletion]: translation.alerts.removeLanguage,
  [CreateEventAlerts.None]: '',
  [UpdateEventAlerts.None]: '',
  [UpdateEventAlerts.ConfirmUpdateDraft]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmUpdateActive]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmPublishToTelegram]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmDeleteFromTelegram]: translation.updateEventTitle,
  [UpdateEventAlerts.ShowEventPublishSuccess]: translation.updateEventTitle,
  [UpdateEventAlerts.ShowEventPublishCancellation]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmAddNewLanguageSpecificData]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmDefaultUpdate]: translation.updateEventTitle,
  [UpdateEventAlerts.ConfirmEventWithExistingStatusActive]: translation.updateEventTitle,
};

// todo: this page needs simplification
export const EventFormPage = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const [existingEvent, setExisingEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();

  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<IValidationError>({});
  const [alert, setAlert] = useState<CreateEventAlerts | UpdateEventAlerts>(CreateEventAlerts.None);

  const [image, setImage] = useState<File | null>(null);
  const [languageSpecificData, dispatchLanguageSpecificData] = useReducer(languageSpecificDataReducer, {
    data: { [Language.Russian]: getEmptyLanguageData(Language.Russian) },
  });
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [eventRegistrationDate, setEventRegistrationDate] = useState('');
  const [gender, setGender] = useState('');
  const [minVolunteersAge, setMinVolunteersAge] = useState(DEFAULT_MIN_AGE);
  const [maxVolunteersAge, setMaxVolunteersAge] = useState(DEFAULT_MAX_AGE);
  const [eventLanguage, setEventLanguage] = useState<Language[]>([]);
  const [volunteersQuantity, setVolunteersQuantity] = useState('');
  const [telegramChannelLink, setTelegramChannelLink] = useState('');
  const [eventStatus, setEventStatus] = useState(EventStatus.Draft);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const eventData = await getEvent(eventId);
          if (eventData) {
            const languages: Language[] = Object.keys(eventData.languageSpecificData.data) as Language[];
            Object.keys(eventData.languageSpecificData.data).forEach(language =>
              dispatchLanguageSpecificData({
                event: LanguageEvent.ReplaceData,
                language: language as Language,
                update: eventData.languageSpecificData.data[language as Language],
                withApproval: false,
              }),
            );
            setEventStartDate(getFormatDate(eventData.startDate));
            if (eventData.endDate) setEventEndDate(getFormatDate(eventData.endDate));
            setEventStartTime(eventData.startTime);
            setEventEndTime(eventData.endTime);
            setEventDuration(eventData.duration);
            setEventRegistrationDate(eventData.registrationDate);
            setGender(eventData.gender);
            setMinVolunteersAge(eventData.ageMin);
            setMaxVolunteersAge(eventData.ageMax);
            setEventLanguage(languages);
            setVolunteersQuantity(eventData.volunteersQuantity);
            if (eventData.telegramChannelLink) setTelegramChannelLink(eventData.telegramChannelLink);
            setEventStatus(eventData.status);
          }
          if (eventData) {
            setExisingEvent(eventData);
          } else {
            setError('Event not found');
          }
        } catch (err) {
          console.error('Error fetching event:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // show warning on page close if there are changes
  useEffect(() => {
    const handleUnload = (e: { preventDefault: () => void; returnValue: string }) => {
      if (
        isCreateFormDirty(
          {
            startDate: eventStartDate,
            startTime: eventStartTime,
            endTime: eventEndTime,
            duration: eventDuration,
            registrationDate: eventRegistrationDate,
            gender: gender as Gender,
            volunteersQuantity: volunteersQuantity,
            endDate: eventEndDate,
            telegramChannelLink,
          },
          languageSpecificData,
          minVolunteersAge,
          maxVolunteersAge,
          eventStatus,
        )
      ) {
        e.preventDefault();
        e.returnValue = alertTextMap[CreateEventAlerts.Leaving];
        return alertTextMap[CreateEventAlerts.Leaving];
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [
    eventDuration,
    eventEndDate,
    eventEndTime,
    eventRegistrationDate,
    eventStartDate,
    eventStartTime,
    eventStatus,
    gender,
    languageSpecificData,
    maxVolunteersAge,
    minVolunteersAge,
    telegramChannelLink,
    volunteersQuantity,
  ]);

  // validate form on sumbit
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
          image: existingEvent ? existingEvent.imageUrl! : image ? image.name : '',
        },
        languageSpecificData.data,
      ),
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
    existingEvent,
  ]);

  const combinedAlert = alert === CreateEventAlerts.None ? languageSpecificData.alert ?? CreateEventAlerts.None : alert;

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

  const handleSaveEvent = () => {
    if (!existingEvent) {
      dispatch(saveEvents([], false, false, false));
      dispatch(setEventsLoading(true));
    } else {
      dispatch(changeEventInitializerValue(false));
    }
    navigate(EVENTS_ROUTE);
  };

  const onLeave = () => {
    if (eventId || !eventId) {
      navigate(EVENTS_ROUTE);
      return;
    }
    if (
      isCreateFormDirty(
        {
          startDate: eventStartDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          duration: eventDuration,
          registrationDate: eventRegistrationDate,
          gender: gender as Gender,
          volunteersQuantity: volunteersQuantity,
          endDate: eventEndDate,
          telegramChannelLink,
        },
        languageSpecificData,
        minVolunteersAge,
        maxVolunteersAge,
        eventStatus,
      )
    ) {
      setAlert(CreateEventAlerts.Leaving);
    } else {
      handleSaveEvent();
    }
  };
  
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSubmitting(() => true);
    if (error) {
      console.log(error);
      return;
    }
    if (Object.keys(validation).length === 0) {
      if (existingEvent) {
        if (eventStatus == 'active' && existingEvent.status !== 'active') {
          setAlert(UpdateEventAlerts.ConfirmPublishToTelegram);
        } else if (eventStatus == 'draft' && existingEvent.status !== 'draft') {
          setAlert(UpdateEventAlerts.ConfirmDeleteFromTelegram);
        } else if (eventStatus == 'active' && existingEvent.status == 'active') {
          setAlert(UpdateEventAlerts.ConfirmEventWithExistingStatusActive);
        } else if (
          Object.keys(existingEvent.languageSpecificData.data).length < Object.keys(languageSpecificData.data).length
        ) {
          setAlert(UpdateEventAlerts.ConfirmAddNewLanguageSpecificData);
        } else {
          setAlert(UpdateEventAlerts.ConfirmDefaultUpdate);
        }
      } else {
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

        saveEvent(newEvent, image as File).then(() => {
          handleSaveEvent();
        });
      }
    }
  };

  const submitModal = () => {
    if (existingEvent) {
      const updatedEvent: IEvent = {
        id: existingEvent.id,
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
        image: `${STORAGE_BUCKET}/${STORAGE_IMAGES_PATH}/${existingEvent.imageUrl}`,
        imageUrl: existingEvent.imageUrl,
        endDate: getShortDate(eventEndDate),
        telegramChannelLink,
      };
      setIsCreating(() => true);
      saveEvent(updatedEvent, image as File, 'update').then(() => {
        handleSaveEvent();
      });
    }
    closeModal();
  };

  return (
    isEditorHasPermissions &&
    !loading && (
      <div className={css.createEventWrapper}>
        <div className={css.createEventTitle}>{existingEvent ? translation.edit : translation.createEvent}</div>
        <form className={css.createEventForm} onSubmit={handleSubmit}>
          <ImageLoader
            setImage={setImage}
            isValidationError={isSubmitting && !!validation.image}
            errorMessage={validation.image}
            previewExistingImage={existingEvent?.imageUrl}
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
                isLast={
                  Object.keys(existingEvent ? existingEvent.languageSpecificData.data : languageSpecificData.data).length ===
                  index + 1
                }
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
            labelText={translation.registrationDeadline}
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
          <RadioButton
            value={eventStatus}
            descriptions={[
              { value: 'draft', name: translation.draftTitle + translation.draftDescription },
              { value: 'canceled', name: translation.cancelledTitle + translation.cancelledDescription },
              { value: 'active', name: translation.activeTitle + translation.activeDescription },
            ]}
            setChange={setEventStatus}
            options={existingEvent?.status === EventStatus.Active ? EVENT_STATUS_FOR_ACTIVE : EVENT_STATUS}
            label={translation.status}
            required
          />

          <div className={css.buttonsPanel}>
            <Button onClick={onLeave} className={`${css.createEventButton} ${css.backButton}`}>
              {translation.back}
            </Button>
            <Button className={`${css.createEventButton} ${css.submitButton}`} id="create-event-submit">
              {isCreating ? <Loader size={'12px'} /> : existingEvent ? translation.save : translation.create}
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
              combinedAlert === CreateEventAlerts.ForbidOnlyLanguageDeletion ? css.modalCancelButton : css.modalDeleteButton
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

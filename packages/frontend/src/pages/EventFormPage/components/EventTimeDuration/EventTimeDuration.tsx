import { Input } from 'src/components';
import css from './EventTimeDuration.module.sass';
import translation from 'src/translations/Russian.json';

interface EventTimeDurationProps {
  eventStartTime: string;
  setEventStartTime: React.Dispatch<React.SetStateAction<string>>;
  eventEndTime: string;
  setEventEndTime: React.Dispatch<React.SetStateAction<string>>;
  isValidationErrorForStart?: boolean;
  errorMessageForStart?: string;
  isValidationErrorForEnd?: boolean;
  errorMessageForEnd?: string;
}

export const EventTimeDuration = ({
  eventStartTime,
  setEventStartTime,
  eventEndTime,
  setEventEndTime,
  isValidationErrorForStart,
  errorMessageForStart,
  isValidationErrorForEnd,
  errorMessageForEnd,
}: EventTimeDurationProps) => {
  return (
    <>
      <div className={css.eventTimeDurationTitle}>
        {translation.eventTimeDuration}
        <span className={css.inputRequired}> *</span>
      </div>
      <div className={css.eventTimeDurationContent}>
        <div className={css.eventTimeDurationContainer}>
          <div className={css.eventTimeDurationColumnTitle}>{translation.beginning}</div>
          <Input
            value={eventStartTime}
            setChange={setEventStartTime}
            type="time"
            required
            inputClassName={css.eventTimeDurationInput}
            isValidationError={isValidationErrorForStart}
            errorMessage={errorMessageForStart}
          />
        </div>
        <div className={css.eventTimeDurationContainer}>
          <div className={css.eventTimeDurationColumnTitle}>{translation.ending}</div>
          <Input
            value={eventEndTime}
            setChange={setEventEndTime}
            type="time"
            required
            inputClassName={css.eventTimeDurationInput}
            isValidationError={isValidationErrorForEnd}
            errorMessage={errorMessageForEnd}
          />
        </div>
      </div>
    </>
  );
};

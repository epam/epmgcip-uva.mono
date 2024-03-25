import { Input } from 'src/components';
import css from './EventTimeDuration.module.sass';
import translation from 'src/translations/Russian.json';

interface EventTimeDurationProps {
  eventStartTime: string;
  setEventStartTime: React.Dispatch<React.SetStateAction<string>>;
  eventEndTime: string;
  setEventEndTime: React.Dispatch<React.SetStateAction<string>>;
}

export const EventTimeDuration = ({
  eventStartTime,
  setEventStartTime,
  eventEndTime,
  setEventEndTime,
}: EventTimeDurationProps) => {
  return (
    <>
      <div className={css.eventTimeDurationTitle}>
        {translation.eventTimeDuration}
        <span className={css.inputRequired}> *</span>
      </div>
      <div className={css.eventTimeDurationContent}>
        <div className={css.eventTimeDurationContainer}>
          <div className={css.eventTimeDurationColumnTitle}>
            {translation.beginning}
          </div>
          <Input
            value={eventStartTime}
            setChange={setEventStartTime}
            type='time'
            max={eventEndTime}
            required
            inputClassName={css.eventTimeDurationInput}
          />
        </div>
        <div className={css.eventTimeDurationContainer}>
          <div className={css.eventTimeDurationColumnTitle}>
            {translation.ending}
          </div>
          <Input
            value={eventEndTime}
            setChange={setEventEndTime}
            type='time'
            min={eventStartTime}
            required
            inputClassName={css.eventTimeDurationInput}
          />
        </div>
      </div>
    </>
  );
};

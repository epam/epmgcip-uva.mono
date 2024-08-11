import { Button, Input, TextArea } from 'src/components';
import { Line } from 'src/components/elements/Line/Line';
import { Language } from 'src/types';
import { LanguageEvent, LanguageReducerAction } from '../../types';
import { getLabels } from '../../utils/languages';
import DeleteSvg from 'src/assets/delete.svg';
import css from './LanguageSpecificFields.module.sass';

interface LanguageSpecificFieldsProps {
  name: string;
  description: string;
  place: string;
  language: Language;
  dispatch: React.Dispatch<LanguageReducerAction>;
  isSubmitting: boolean;
  validation: Record<string, string>;
  isLast: boolean;
}

export const LanguageSpecificFields = ({
  name,
  description,
  place,
  language,
  isLast,
  dispatch,
  validation,
  isSubmitting,
}: LanguageSpecificFieldsProps) => {
  const labels = getLabels(language);

  const isValidationErrorForDescription = isSubmitting && !!validation[`${language}Description`];
  const isValidationErrorForName = isSubmitting && !!validation[`${language}Name`];
  const errorMessageForName = validation[`${language}Name`];
  const errorMessageForDescription = validation[`${language}Description`];
  const isValidationErrorForPlace = isSubmitting && !!validation[`${language}Place`];
  const errorMessageForPlace = validation[`${language}Place`];

  function onChange(key: string) {
    return (value: string | React.SetStateAction<string>) => {
      dispatch({
        language,
        event: LanguageEvent.Change,
        update: { [key]: value as string },
        withApproval: false,
      });
    };
  }

  function onToggle() {
    dispatch({ language, withApproval: true, event: LanguageEvent.Toggle });
  }

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.header}>
          <h2 className={css.title}>{labels.title}</h2>
          <Button onClick={onToggle} stopPropagation={true}>
            <img src={DeleteSvg} alt={`delete ${language} language button`} />
          </Button>
        </div>
        <Input
          value={name}
          setChange={onChange('name')}
          labelText={labels.name}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isValidationErrorForName}
          errorMessage={errorMessageForName}
        />
        <TextArea
          value={description}
          setChange={onChange('description')}
          labelText={labels.description}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isValidationErrorForDescription}
          errorMessage={errorMessageForDescription}
        />
        <Input
          value={place}
          setChange={onChange('place')}
          labelText={labels.place}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isValidationErrorForPlace}
          errorMessage={errorMessageForPlace}
        />
        {!isLast && <Line />}
      </div>
      {isLast && <div className={css.last}></div>}
    </>
  );
};

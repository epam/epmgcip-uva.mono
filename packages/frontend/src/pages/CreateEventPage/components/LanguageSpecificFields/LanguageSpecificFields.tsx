import { Input, TextArea } from 'src/components';
import { Line } from 'src/components/elements/Line/Line';
import { Language } from 'src/types';
import { LanguageReducerAction } from '../../types';
import { getLabels } from '../../utils/languages';
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
  return (
    <>
      <div className={css.wrapper}>
        <h2 className={css.title}>{labels.title}</h2>
        <Input
          value={name}
          setChange={(name: string | React.SetStateAction<string>) => {
            dispatch({
              language,
              event: 'change',
              update: { name: name as string },
              withApproval: false,
            });
          }}
          labelText={labels.name}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isValidationErrorForName}
          errorMessage={errorMessageForName}
        />
        <TextArea
          value={description}
          setChange={(description: string | React.SetStateAction<string>) => {
            dispatch({
              language,
              event: 'change',
              update: { description: description as string },
              withApproval: false,
            });
          }}
          labelText={labels.description}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isValidationErrorForDescription}
          errorMessage={errorMessageForDescription}
        />
        <Input
          value={place}
          setChange={(place: string | React.SetStateAction<string>) => {
            dispatch({
              language,
              event: 'change',
              update: { place: place as string },
              withApproval: false,
            });
          }}
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

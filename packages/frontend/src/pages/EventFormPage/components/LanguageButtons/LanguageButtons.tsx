import { Button } from 'src/components';
import { IEvent, Language, languagesShort } from 'src/types';
import css from './LanguageButtons.module.sass';
import { Dispatch } from 'react';
import { LanguageEvent, LanguageReducerAction } from '../../types';

interface LanguageButtonsProps {
  languages: Language[];
  dispatch: Dispatch<LanguageReducerAction>;
  labelText: string;
  languageSpecificData: IEvent['languageSpecificData'];
}
export const LanguageButtons = ({
  languages,
  dispatch,
  languageSpecificData,
  labelText,
}: LanguageButtonsProps) => {
  return (
    <div className={css.createEventLanguageSpecific}>
      <div className={css.createEventLanguageSpecificButtons}>
        <div className={css.header}>{labelText}</div>
        <div className={css.buttonRow}>
          {languages.map(lang => (
            <Button
              key={lang}
              onClick={() =>
                dispatch({
                  language: lang,
                  withApproval: true,
                  event: LanguageEvent.Toggle,
                })
              }
              stopPropagation={true}
              className={
                css.toggleLanguageButton +
                `${
                  languageSpecificData && lang in languageSpecificData.data
                    ? ` ${css.toggleLanguageButtonPressed}`
                    : ''
                }`
              }
            >
              {languagesShort[lang]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

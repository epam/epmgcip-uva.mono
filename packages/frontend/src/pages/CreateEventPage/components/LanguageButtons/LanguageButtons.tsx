import { Button } from 'src/components';
import { IEvent, Language, languagesShort } from 'src/types';
import css from './LanguageButtons.module.sass';
import { Dispatch } from 'react';
import { LanguageReducerAction } from '../../types';

interface LanguageButtonsProps {
  languages: Language[];
  dispatch: Dispatch<LanguageReducerAction>;
  languageSpecificData: IEvent['languageSpecificData'];
}
export const LanguageButtons = ({
  languages,
  dispatch,
  languageSpecificData,
}: LanguageButtonsProps) => {
  return (
    <div className={css.createEventLanguageSpecific}>
      {/* todo: 
          validation - add it + it should not be provoked by buttons clicking; add remove button and alerts;
          fix tests (14 errors)
        */}
      <div className={css.createEventLanguageSpecificButtons}>
        {languages.map(lang => (
          <Button
            key={lang}
            onClick={() =>
              dispatch({
                language: lang,
                withApproval: true,
                event: 'toggle',
              })
            }
            className={
              css.toggleLanguageButton +
              `${lang in languageSpecificData ? ` ${css.toggleLanguageButtonPressed}` : ''}`
            }
          >
            {languagesShort[lang]}
          </Button>
        ))}
      </div>
    </div>
  );
};

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
      {/* todo: add remove button and alerts; */}
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
            stopPropagation={true}
            className={
              css.toggleLanguageButton +
              `${
                languageSpecificData && lang in languageSpecificData
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
  );
};

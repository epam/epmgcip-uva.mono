import { IValidationError } from 'src/types';
import translation from 'src/translations/Russian.json';

export const validateValues = (inputValues: IValidationError) => {
  const errors = {} as IValidationError;
  const telegramNameRegex = /\B@[a-zA-Z0-9_]+/g;

  if (!inputValues.name) {
    errors.name = translation.enterName;
  }

  if (inputValues.name && inputValues.name.length > 256) {
    errors.name = translation.nameTooLong;
  }

  if (!inputValues.telegramName) {
    errors.telegramName = translation.enterTelegramName;
  }

  if (inputValues.telegramName && inputValues.telegramName.length < 6) {
    errors.telegramName = translation.telegramNameTooShort;
  }

  if (inputValues.telegramName && inputValues.telegramName.length > 32) {
    errors.telegramName = translation.telegramNameTooLong;
  }

  if (
    inputValues.telegramName &&
    inputValues.telegramName.match(telegramNameRegex)?.[0] !==
      inputValues.telegramName
  ) {
    errors.telegramName = translation.telegramNameIncorrect;
  }

  if (!inputValues.role) {
    errors.role = translation.chooseRole;
  }

  return errors;
};

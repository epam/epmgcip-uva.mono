import { IValidationError } from "src/types";

export const validateValues = (inputValues: IValidationError) => {
    const errors = {} as IValidationError;
  
    if (inputValues.name && inputValues.name.length > 256) {
      errors.name = 'Name is too long';
    }
  
    if (inputValues.telegramName && inputValues.telegramName.length < 6) {
      errors.telegramName = 'Telegram Name is too short';
    }
  
    if (inputValues.telegramName && inputValues.telegramName.length > 32) {
      errors.telegramName = 'Telegram Name is too long';
    }
  
    return errors;
  };
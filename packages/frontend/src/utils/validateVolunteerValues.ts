import { IValidationError } from 'src/types';
import translation from 'src/translations/Russian.json';

export const validateVolunteerValues = (inputValues: IValidationError) => {
  const errors = {} as IValidationError;
  const telegramNameRegex = /\B@[a-zA-Z0-9_]+/g;

  if (!inputValues.firstName) {
    errors.firstName = translation.enterName;
  }

  if (!inputValues.lastName) {
    errors.lastName = translation.enterName;
  }

  if (!inputValues.gender) {
    errors.gender = translation.enterGender;
  }

  if (!inputValues.birthDate) {
    errors.birthDate = translation.enterBirthDate;
  }

  if (!inputValues.languages) {
    errors.language = translation.language;
  }

  if (!inputValues.education) {
    errors.education = translation.education;
  }

  if (!inputValues.phone) {
    errors.phone = translation.phone;
  }

  if (!inputValues.telegramId) {
    errors.telegramId = translation.telegramId;
  }

  if (inputValues.firstName && inputValues.firstName.length > 50) {
    errors.firstName = translation.nameTooLong;
  }

  if (inputValues.lastName && inputValues.lastName.length > 50) {
    errors.lastName = translation.nameTooLong;
  }

  if (inputValues.specialization && inputValues.specialization.length > 100) {
    errors.specialization = translation.specialization;
  }

  if (inputValues.interests && inputValues.interests.length > 200) {
    errors.interests = translation.interests;
  }

  if (inputValues.imageType && inputValues.imageType != "image/jpeg" && inputValues.imageType != "image/png") {
    errors.image = translation.wrongImageType;
  }

  if (inputValues.imageSize && (+inputValues.imageSize) > 1024 * 1024 * 2) {
    errors.image = translation.largeImage;
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

  return errors;
};

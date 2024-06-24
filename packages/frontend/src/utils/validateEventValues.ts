import { EventLanguageSpecificData, IValidationError, languages } from 'src/types';
import translation from 'src/translations/Russian.json';
import { AtLeastOne } from 'src/types/utiliy';

const compareTimes = (firstValue: string, secondValue: string) => {
  const [firstHours, firstMinutes] = firstValue.split(':');
  const [secondHours, secondMinutes] = secondValue.split(':');
  const firstTime = Number(firstHours) * 60 + Number(firstMinutes);
  const secondTime = Number(secondHours) * 60 + Number(secondMinutes);

  return firstTime > secondTime;
};

export const validateEventValues = (inputValues: IValidationError, languageSpecificData: AtLeastOne<EventLanguageSpecificData>): IValidationError => {
  const errors = {} as IValidationError;

  if (!inputValues.image) {
    errors.image = translation.addImage;
  }

  languages.forEach(language => {
    if (language in languageSpecificData && languageSpecificData[language]) {
      if (!languageSpecificData[language]!.name) {
        errors[`${language}Name`] = translation.enterEventName;
      }

      if (languageSpecificData[language]!.name && languageSpecificData[language]!.name.length > 30) {
        errors[`${language}Name`] = translation.eventNameTooLong;
      }

      if (!languageSpecificData[language]!.description) {
        errors[`${language}Description`] = translation.enterEventDescription;
      }

      if (languageSpecificData[language]!.description && languageSpecificData[language]!.description.length > 4096) {
        errors[`${language}Description`] = translation.eventDescriptionTooLong;
      }

      if (!languageSpecificData[language]!.place) {
        errors[`${language}Place`] = translation.enterEventPlace;
      }

      if (languageSpecificData[language]!.place && languageSpecificData[language]!.place.length > 256) {
        errors[`${language}Place`] = translation.eventPlaceTooLong;
      }
    }
  })

  if (!inputValues.startDate) {
    errors.startDate = translation.enterStartDate;
  }

  if (!inputValues.startTime) {
    errors.startTime = translation.enterStartTime;
  }

  if (
    inputValues.startTime &&
    inputValues.endTime &&
    compareTimes(inputValues.startTime, inputValues.endTime)
  ) {
    errors.startTime = translation.startTimeTooBig;
  }

  if (!inputValues.endTime) {
    errors.endTime = translation.enterStartTime;
  }

  if (
    inputValues.startTime &&
    inputValues.endTime &&
    !compareTimes(inputValues.endTime, inputValues.startTime)
  ) {
    errors.endTime = translation.endTimeTooSmall;
  }

  if (!inputValues.duration) {
    errors.duration = translation.enterDuration;
  }

  if (inputValues.duration && inputValues.duration.length > 3) {
    errors.duration = translation.durationTooLong;
  }

  if (!inputValues.registrationDate) {
    errors.registrationDate = translation.enterRegistrationDate;
  }

  if (!inputValues.gender) {
    errors.gender = translation.enterGender;
  }

  if (!inputValues.language) {
    errors.language = translation.enterLanguage;
  }

  if (!inputValues.volunteersQuantity || Number(inputValues.volunteersQuantity) === 0) {
    errors.volunteersQuantity = translation.enterVolunteersQuantity;
  }

  if (inputValues.volunteersQuantity && inputValues.volunteersQuantity.length > 3) {
    errors.volunteersQuantity = translation.volunteersQuantityTooLong;
  }

  return errors;
};

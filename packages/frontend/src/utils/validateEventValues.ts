import { IValidationError } from 'src/types';
import translation from 'src/translations/Russian.json';

const compareTimes = (firstValue: string, secondValue: string) => {
  const [firstHours, firstMinutes] = firstValue.split(':');
  const [secondHours, secondMinutes] = secondValue.split(':');
  const firstTime = Number(firstHours) * 60 + Number(firstMinutes);
  const secondTime = Number(secondHours) * 60 + Number(secondMinutes);

  return firstTime > secondTime;
};

export const validateEventValues = (inputValues: IValidationError) => {
  const errors = {} as IValidationError;

  if (!inputValues.image) {
    errors.image = translation.addImage;
  }

  if (!inputValues.name) {
    errors.name = translation.enterEventName;
  }

  if (inputValues.name && inputValues.name.length > 30) {
    errors.name = translation.eventNameTooLong;
  }

  if (!inputValues.description) {
    errors.description = translation.enterEventDescription;
  }

  if (inputValues.description && inputValues.description.length > 4096) {
    errors.description = translation.eventDescriptionTooLong;
  }

  if (!inputValues.place) {
    errors.place = translation.enterEventPlace;
  }

  if (inputValues.place && inputValues.place.length > 256) {
    errors.place = translation.eventPlaceTooLong;
  }

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

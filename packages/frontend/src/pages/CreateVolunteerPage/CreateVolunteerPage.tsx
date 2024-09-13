import { useEffect, useState } from 'react';
import translation from 'src/translations/Russian.json';
import { Button, Input, Loader, Select, DatePicker, ImageLoader } from 'src/components';
import { IValidationError, Language } from 'src/types';
import css from './CreateVolunteerPage.module.sass';
import { LANGUAGE, VOLUNTEERS_ROUTE, VOLUNTEER_GENDER, VOLUNTEER_EDUCATION, STORAGE_BUCKET, VOLUNTEERS_IMAGES_PATH } from 'src/constants';
import { validateVolunteerValues } from 'src/utils/validateVolunteerValues';
import { useNavigate } from 'react-router-dom';
import { IVolunteer } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import { createVolunteer } from 'src/utils/createVolunteer';
import { PhoneInput } from 'src/components/formElements/PhoneInput/PhoneInput';

export const CreateVolunteerPage = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [language, setLanguage] = useState<Language[]>([]);
  const [education, setEducation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [interests, setInterests] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locations, setLocations] = useState('');
  const [telegramName, setTelegramName] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [validation, setValidation] = useState<IValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleCreateVolunteer = () => {
    navigate(VOLUNTEERS_ROUTE);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSubmitting(() => true);
    if(Object.keys(validation).length === 0) {
      const eventCount = 0;
      const newVolunteer: IVolunteer = {
        id: uuidv4(),
        firstName,
        lastName,
        gender,
        birthDate,
        language,
        education,
        specialization,
        interests,
        phone,
        email,
        telegramName,
        image: `${STORAGE_BUCKET}/${VOLUNTEERS_IMAGES_PATH}/${telegramName}`, // image does not work in the setDoc or getDoc VOLUNTEERS_IMAGES_PATH
        eventCount,
      }

      setIsCreating(() => true);

      createVolunteer(newVolunteer, image!).then(() => {
        handleCreateVolunteer();
      })
    }
  }

  useEffect(() => {
    const languages = language.join('');
    const imageSize = image?.size as unknown as string;
    const imageType = image?.type as string;
    setValidation(
      validateVolunteerValues({
        firstName,
        lastName,
        gender,
        birthDate,
        education,
        languages,
        specialization,
        interests,
        phone,
        email,
        imageSize,
        imageType,
        telegramName
      })
    );
  }, [firstName, lastName, gender, birthDate, education, language, specialization, interests, phone, email, image, telegramName])

  return (
    <div className={css.createVolunteerWrapper}>
      <div className={css.createVolunteerTitle}>{translation.volunteerRegistration}</div>
      <form className={css.createVolunteerForm} onSubmit={handleSubmit}>
        <ImageLoader
          setImage={setImage}
          isValidationError={isSubmitting && !!validation.image}
          errorMessage={validation.image}
        />
        <Input
          value={firstName}
          setChange={setFirstName}
          labelText={translation.firstName}
          required
          isValidationError={isSubmitting && !!validation.firstName}
          errorMessage={validation.firstName}
        />
        <Input
          value={lastName}
          setChange={setLastName}
          labelText={translation.lastName}
          required
          isValidationError={isSubmitting && !!validation.lastName}
          errorMessage={validation.lastName}
        />
        <Select
          value={gender}
          setChange={setGender}
          options={VOLUNTEER_GENDER}
          labelText={translation.genderV}
          required
          placeholder={translation.choice}
          isValidationError={isSubmitting && !!validation.gender}
          errorMessage={validation.gender}
        />
        <DatePicker
          value={birthDate}
          setChange={setBirthDate}
          labelText={translation.birthDate}
          required
          labelClassName={css.createEventPadding}
          isValidationError={isSubmitting && !!validation.birthDate}
          errorMessage={validation.birthDate}
        />
        <Select
            value={language}
            setChange={setLanguage}
            options={LANGUAGE}
            labelText={translation.language}
            multiple
            required
            placeholder={translation.choice}
            selectClassName={language.length === 0 ? css.selectPlaceholder : undefined}
            isValidationError={isSubmitting && !!validation.language}
            errorMessage={validation.language}
          />
        <Select
          value={education}
          setChange={setEducation}
          options={VOLUNTEER_EDUCATION}
          labelText={translation.education}
          required
          placeholder={translation.choice}
          isValidationError={isSubmitting && !!validation.education}
          errorMessage={validation.education}
        />
        <Input
          value={specialization}
          setChange={setSpecialization}
          labelText={translation.specialization}
          isValidationError={isSubmitting && !!validation.specialization}
          errorMessage={validation.specialization}
        />
        <Input
          value={interests}
          setChange={setInterests}
          labelText={translation.interests}
          isValidationError={isSubmitting && !!validation.interests}
          errorMessage={validation.interests}
        />
        <PhoneInput
        labelText={translation.phone}
        required
        placeholder={translation.choice}
        onChange={setPhone}
        isValidationError={isSubmitting && !!validation.phone}
        errorMessage={validation.phone}
        />
        <Input
          value={email}
          setChange={setEmail}
          labelText={translation.email}
          type="email"
          isValidationError={isSubmitting && !!validation.email}
          errorMessage={validation.email}
        />
        <Input
          value={locations}
          setChange={setLocations}
          labelText={translation.locations}
          isValidationError={isSubmitting && !!validation.locations}
          errorMessage={validation.locations}
        />
        <Input
          value={telegramName}
          setChange={setTelegramName}
          labelText={translation.telegramName}
          required
          isValidationError={isSubmitting && !!validation.telegramName}
          errorMessage={validation.telegramName}
        />
        <div className={css.buttonsPanel}>
          <Button
            id="create-volun-submit"
            className={`${css.createVolunteerButton} ${css.submitButton}`}
          >
            {isCreating ? <Loader size={'12px'} /> : translation.add}
          </Button>
        </div>
      </form>
    </div>
  );
};

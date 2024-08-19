import { getClassesList } from 'src/utils/getClassesList';
import css from './ImageLoader.module.sass';
import { useState } from 'react';
import CameraSvg from './assets/camera.svg';
import { showNotification } from 'src/utils/showNotification';
import { IMAGE_TYPE, NOTIFICATIONS } from 'src/constants';

interface ImageLoaderProps {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  isValidationError?: boolean;
  errorMessage?: string;
  previewExistingImage?: string;
}

const convertBytesToMegabytes = (value: number) =>
  Number((value / (1024 * 1024)).toFixed(4));

export const ImageLoader = ({
  setImage,
  isValidationError,
  errorMessage,
  previewExistingImage
}: ImageLoaderProps) => {
  const imageLoaderClasses = getClassesList(css.imageLoader);
  const [preview, setPreview] = useState<string>(previewExistingImage ? previewExistingImage : '');
  

  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const imageFile = e.target.files[0];

      if (convertBytesToMegabytes(imageFile.size) > 10) {
        showNotification(NOTIFICATIONS().IMAGE_TOO_BIG, 6000);
        return;
      }

      if (!IMAGE_TYPE.some((type) => type === imageFile.type)) {
        showNotification(NOTIFICATIONS().IMAGE_WRONG_TYPE, 6000);
        return;
      }

      setImage(() => imageFile);
      setPreview(() => URL.createObjectURL(imageFile));
    }
  };

  return (
    <div className={css.imageLoaderWrapper}>
      <div className={imageLoaderClasses}>
        <label className={css.imageLoaderContainer}>
          <img className={css.downloadButton} width={19} src={CameraSvg} />
          <input
            className={css.imageLoaderInput}
            type='file'
            onChange={(e) => handleSetImage(e)}
          />
          {preview && (
            <img
              className={css.imagePreview}
              src={preview}
              alt='Your Image Preview'
            />
          )}
        </label>
      </div>
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </div>
  );
};

export const getClassesList = (
  mainClass: string,
  additionalClass?: string,
  errorClass?: string
) => {
  let classesList = `${mainClass}`;

  if (additionalClass) {
    classesList += ` ${additionalClass}`;
  }

  if (errorClass) {
    classesList += ` ${errorClass}`;
  }

  return classesList;
};

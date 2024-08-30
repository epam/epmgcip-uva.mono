export const getFormatDate = (date: Date | string, separator: '/' | '.' | '-' = '-') => {
  const formattedDate = typeof date === 'string' ? new Date(date) : date;

  const day = String(formattedDate.getDate()).padStart(2, '0');
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  const year = formattedDate.getFullYear();

  return (typeof date === 'string' ? [day, month, year] : [year, month, day]).join(separator);
};

export const getNormalizeDate = (date: string) => {
  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year}`;
};

export const getShortDate = (date: string) => {
  const [day, month, year] = date.split("-");
  const dateObj = new Date(+year, +month - 1, +day);

  // eslint-disable-next-line max-len
  const options: Intl.DateTimeFormatOptions = {day: "2-digit", month: "short", year: "numeric"};
  const formattedDate = dateObj.toLocaleDateString("en-GB", options);

  return formattedDate.replace(/\./g, "");
};


export const getDaysInMonth = (
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) => {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(getFormatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export const getMonth = (currentMonth: number, currentYear: number) => {
  const month: (null | string)[] = getDaysInMonth(currentMonth, currentYear);
  const emptySlots = new Date(month[0] as string | number | Date).getDay();

  for (let i = 0; i < emptySlots; i++) {
    month.unshift(null);
  }

  return month;
};

export const getFormatDate = (date: Date) => {
  let day = '' + date.getDate();
  let month = '' + (date.getMonth() + 1);
  const year = date.getFullYear();

  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  return [year, month, day].join('-');
};

export const getNormalizeDate = (date: string) => {
  const [year, month, day] = date.split('-');

  return `${day}-${month}-${year}`;
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
export const getFormatDate = (date: Date | string) => {
  if(typeof date ==='string'){
    const formatedDate = new Date(date);
    return `${String(formatedDate.getDate()).padStart(2, '0')}-${String(formatedDate.getMonth() + 1).padStart(
      2,
      '0'
    )}-${formatedDate.getFullYear()}`;
  }
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

export const getShortDate = (date: string) => {
  const [day, month, year] = date.split('-');
  const dateObj = new Date(+year, +month - 1, +day);

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-GB', options);

  return formattedDate.replace(/\./g, '');
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
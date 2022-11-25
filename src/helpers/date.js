/**
 * Returns the date as a date Object in the fromat
 * @param date - YYYY-MM-DD
 * @param time - HH:mm
  @returns date
 */
export const createDate = (date, time) => {
  const [month, day, year] = date.split("-");
  const [hours, minutes] = time.split(":");
  return new Date(+year, +month - 1, +day, +hours, +minutes).toJSON();
};

/**
 * Returns the date as a date Object in the fromat
 * @param arr - []
  @returns An Array Of Dates Sorted from earliest to late. i.e 01:00,02:00,03;00,04:00 next and so on.
 */
export const sortByDate = (arr) => {
  return arr.sort(function (a, b) {
    return new Date(a.datetime) - new Date(b.datetime);
  });
};

/**
 * Returns the date as a text in the fromat
 * note: month and days are 0 based in js i.e. 0 - 11 / Jan - Dec, 0 - 6 / Sun - Sat
 * @param year - full year i.e (2012)
 * @param month - month is in the range 0..11
  @returns Text
 */
export const formatDate = (month, year, day) => {
  let initialFormat = `${year}-${
    Number(month + 1) < 10 ? `0${month + 1}` : month + 1
  }`;
  if (day) {
    day = Number(day) < 10 ? `0${day}` : day;
    initialFormat = initialFormat + "-" + day; // YYYY-MM-DD format
  }
  return initialFormat; // YYYY-MM format
};

/**
 * Returns number of days in the given month
 * note:  the last day of the month = total number of days in the month
 * @param year - full year i.e (2012)
 * @param month - month is in the range 0..11
 @returns number - Number

 */
export function getDaysInMonth(month, year) {
  const lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();
  return numDays;
}

/**
 * Returns count of weeks for year and month
 * @param year - full year i.e (2012)
 * @param month - month is in the range 0..11
  @returns [{}] An Array Of Objects
 */
export function getWeeksInMonth(month, year) {
  const weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();

  let dayOfWeekCounter = firstDate.getDay();

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(date);
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
  }

  return weeks
    .filter((w) => !!w.length)
    .map((w) => ({
      start: w[0],
      end: w[w.length - 1],
      dates: w,
    }));
}

/**
 * Returns Date Related Data For A Given Date Or The Current Date
 * @param dateArg - date
  @returns {} - An Object
 */
export function getDate(dateArg) {
  const init = dateArg ? new Date(dateArg) : new Date();
  const month = init.getMonth();
  const year = init.getFullYear();
  const dateOfFirstDay = new Date(year, month, 1);
  const weekDay = dateOfFirstDay.getDay();
  const day = dateOfFirstDay.getDate();
  const dateObject = {
    json: init.toJSON(),
    yearAndMonth: formatDate(month, year),
    year,
    month,
    day,
    monthName: months.names[month],
    weekDayName: weekdays.names[weekDay],
    weekDay,
    weeksInMonth: getWeeksInMonth(month, year),
    weeksInPreviousMonth: getWeeksInMonth(month - 1, year),
    daysInMonth: getDaysInMonth(month, year),
  };
  return dateObject;
}

export const weekdays = {
  names: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  abbreviatedNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export const months = {
  names: [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  abbreviatedNames: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

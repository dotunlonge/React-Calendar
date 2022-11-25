import React from "react";
import Header from "../components/Header";
import { weekdays, formatDate, sortByDate } from "../helpers/date.js";
import { changeMonth, toggleModal, setFilterParams } from "../store/reminders";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Calendar(props) {
  // your calendar implementation Goes here!
  // Be creative
  // fetch date object - today's date
  const dateSelected = useSelector((state) => state.reminders.dateSelected);
  const all = useSelector((state) => state.reminders.all);
  const { yearAndMonth, weekDay, weeksInMonth, weeksInPreviousMonth } =
    dateSelected;

  // create calendar grid with default configuration data
  let layout = new Array(weeksInMonth.length * 7).fill(null).map((e, i) => {
    return {
      i,
      yearAndMonth,
      weekDay: i % 7,
      weekDayName: weekdays.abbreviatedNames[i % 7],
      isWeekend: i % 7 === 0 || i % 7 === 6,
      disabled: i < weekDay && i < 7,
      month: dateSelected.month,
      year: dateSelected.year,
    };
  });
  // get how many days exist in view, before month starts
  const howManyDisabled =
    layout.filter((configuration) => configuration.disabled).length - 1;

  // default numbering value configuration for calendar dates.
  layout = layout.map((e, i) => {
    const dayEndingPrevMonth =
      weeksInPreviousMonth[weeksInPreviousMonth.length - 1].end;

    // start from 1
    if (i > howManyDisabled) {
      e.number = i - howManyDisabled;
    }

    // handle Previously disabled cases
    if (i <= howManyDisabled) {
      e.month -= 1;
      e.number = dayEndingPrevMonth - howManyDisabled + i;
    }

    // start from 1, after ending current month
    if (!e.disabled && e.number > weeksInMonth[weeksInMonth.length - 1].end) {
      e.disabled = true;
      e.month = e.month + 1;
      e.number = e.number - weeksInMonth[weeksInMonth.length - 1].end;
    }
    // add a date to each object
    e.dateCreated = new Date(e.year + "-" + e.month + "-" + e.number).toJSON();
    e.fullDateFormatted = formatDate(e.month, e.year, e.number);
    return e;
  });

  layout = layout.map((daybox, i) => {
    daybox.reminders = all.filter(
      (reminder) => reminder.date === daybox.fullDateFormatted
    );
    return daybox;
  });

  return (
    <div className="calendar">
      <Header title="Calendar" link="/reminders" CTA="View Reminders" />
      <div className="layout-heading">
        <ul>
          {weekdays.names.map((day, i) => (
            <li key={i}>{day}</li>
          ))}
        </ul>
      </div>
      <div className="layout-grid">
        {layout.map((dateData, i) => (
          <CalendarDay key={i} {...dateData} weeksInMonth={weeksInMonth} />
        ))}
      </div>
    </div>
  );
}

export default Calendar;

function CalendarDay(props) {
  const {
    isWeekend,
    number,
    disabled = false,
    weeksInMonth,
    reminders,
  } = props;

  const style = { minHeight: `calc((100vh - 105px) / ${weeksInMonth.length})` };
  let className = "dateUnit";
  if (isWeekend) className = className + " isWeekend";
  const dispatch = useDispatch();
  const handleOnClick = (e) => {
    e.preventDefault();
    dispatch(
      toggleModal({
        open: true,
        type: "add",
        data: { date: props.fullDateFormatted },
      })
    );
  };
  const minimumReminders = 3;

  const navigate = useNavigate();

  const viewMore = (e) => {
    e.stopPropagation();
    dispatch(setFilterParams({ filter: true, date: props.fullDateFormatted }));
    navigate("/reminders");
  };

  return (
    <button
      className={className}
      disabled={disabled}
      style={style}
      onClick={handleOnClick}
    >
      <h3>{number}</h3>
      {Boolean(reminders.length) && (
        <ul className="reminders">
          {sortByDate(reminders)
            .slice(0, minimumReminders)
            .map((e, i) => {
              return (
                <li key={i}>
                  {e.time} - {e.reminder}
                </li>
              );
            })}
        </ul>
      )}
      {reminders.length > minimumReminders && (
        <span className="more" onClick={viewMore}>
          {reminders.length - minimumReminders} More
        </span>
      )}
    </button>
  );
}

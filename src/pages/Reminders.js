import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getDate, months, weekdays } from "../helpers/date.js";
import { remove, toggleModal } from "../store/reminders";

function Reminders(props) {
  // your calendar implementation Goes here!
  // Be creative
  // fetch date object - today's date
  const dateSelected = useSelector((state) => state.reminders.dateSelected);
  const reminders = useSelector((state) => state.reminders.all);
  const filterParams = useSelector((state) => state.reminders.filterParams);
  const [remindersStateLocal, updateRemindersStateLocal] = useState(reminders);
  const daySelected = filterParams.date;
  useEffect(() => {
    if (daySelected && filterParams.filter) {
      updateRemindersStateLocal(
        reminders.filter((e) => {
          return e.date === daySelected;
        })
      );
    } else {
      updateRemindersStateLocal(reminders);
    }
  }, [filterParams, reminders]);
  const dispatch = useDispatch();
  const {
    yearAndMonth,
    weekDay,
    weeksInMonth,
    weeksInPreviousMonth,
    daysInMonth,
    day,
  } = dateSelected;

  const removeReminder = (id) => dispatch(remove(id));
  const openModal = (i) =>
    dispatch(
      toggleModal({ open: true, type: "edit", data: remindersStateLocal[i] })
    );

  return (
    <div className="calendar">
      <Header
        title="Reminders"
        link="/"
        CTA="View Calendar"
        filtered={filterParams.filter}
        count={remindersStateLocal.length}
        date={daySelected}
      />
      <div className="layout-heading">
        <ul id="reminder-heading">
          <li>S/N</li>
          <li>Reminder</li>
          <li>Date</li>
          <li>Time</li>
          <li>City</li>
          <li>Weather</li>
          <li>Actions</li>
        </ul>
      </div>

      {remindersStateLocal.map((reminder, i) => (
        <ul id="reminder-list" key={i}>
          <li>{i + 1}</li>
          <li>{reminder.reminder}</li>
          <li>{reminder.time}</li>
          <li>{reminder.date}</li>
          <li>{reminder.city}</li>
          <li>{reminder.weather}</li>
          <li>
            <button onClick={() => openModal(i)}>Edit</button>
            <button onClick={() => removeReminder(reminder.id)}>Delete</button>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default Reminders;

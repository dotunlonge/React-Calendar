import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDate } from "../helpers/date.js";
import { changeMonth, toggleModal, setFilterParams } from "../store/reminders";
import { Link } from "react-router-dom";

export default function Header(props) {
  const dateSelected = useSelector((state) => state.reminders.dateSelected);
  const reminders = useSelector((state) => state.reminders.all);

  const yearAndMonth = dateSelected.yearAndMonth;
  const [state, update] = useState(yearAndMonth);

  const dispatch = useDispatch();
  // fetch new date object with value selected via UI element
  const handleChange = (e) => {
    const { value } = e.target;
    if (value) {
      update(getDate(value).yearAndMonth);
    }
  };

  const openModal = (e) => dispatch(toggleModal({ open: true, type: "add" }));

  useEffect(() => {
    if (yearAndMonth !== state) {
      dispatch(changeMonth(getDate(state).yearAndMonth));
    }
  }, [state]);

  return (
    <>
      <header>
        <h1> {props.title} </h1>
        <Link
          to={props.link}
          onClick={() => {
            dispatch(setFilterParams({ filter: false, date: null }));
          }}
        >
          {props.CTA}
        </Link>
        {props.filtered ? (
          <p id="indicator">
            You Have {props.count} Reminders For {props.date}
          </p>
        ) : (
          <p id="indicator">Total Of {reminders.length} Reminders</p>
        )}
        <button onClick={() => openModal(true)}>Create Reminder</button>
        <div className="date-selector">
          <input
            type="month"
            name="month"
            onChange={handleChange}
            value={state}
          />
        </div>
      </header>
    </>
  );
}

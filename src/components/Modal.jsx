import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSharedDate,
  add,
  remove,
  edit,
  toggleModal,
} from "../store/reminders";
import { Link } from "react-router-dom";
import config from "../helpers/config";

export default function ModalForm() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.reminders.modal);
  const empty = { reminder: "", time: "", date: "", city: "", weather: "" };
  const [formData, modFormState] = useState(empty);
  const [forecast, setForecast] = useState(empty.weather);
  const [alertText, setAlertText] = useState({ value: null, type: null });

  useEffect(() => {
    if (typeof modal.data === "object" && formData.data !== modal.data) {
      const not_empty = { ...empty, ...modal.data };
      modFormState(not_empty);
      setForecast(modal.data.weather);
    }

    if (!modal.data) {
      setForecast(null);
      modFormState(empty);
    }
  }, [modal.data]);

  const handleSave = (e) => {
    e.preventDefault();
    setAlertText({ value: "Saving...", type: "modal-save" });
    modal.type === "add" && dispatch(add(formData));
    modal.type === "edit" && dispatch(edit(formData));
    setTimeout(() => setAlertText({ value: "Saved", type: "modal-save" }), 200);
    setTimeout(() => setAlertText({ value: null, type: null }), 800);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    modFormState({
      ...formData,
      [name]: value,
    });
  };

  const closeModal = (e) => {
    setAlertText({ value: null, type: null });
    dispatch(toggleModal({ open: false, type: modal.type }));
    modFormState(empty);
  };

  const WeatcherForcast = (props) => {
    const { date, city } = props;

    const fetchForecast = (e) => {
      e.preventDefault();
      if (date && city) {
        setAlertText({
          value: "Getting Weather Data...",
          type: "weather-fetch",
        });
        fetch(
          `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${config.apiKey}&q=${city}`
        )
          .then((response) => response.json())
          .then((response) => {
            if (response && response[0]) {
              const key = response[0].Key;
              return fetch(
                `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${config.apiKey}`
              );
            }
            return response;
          })
          .then((response) => response.json())
          .then((response) => {
            if (response) {
              if (response.length === 0) {
                formData.weather = "No Forecast";
              }
              formData.weather =
                response.DailyForecasts[0].Day.IconPhrase || "Forecast Dey Sha";
              return formData.weather;
            }
            throw response;
          })
          .catch((error) => {
            console.log(error);
          })
          .finally((result) => {
            setForecast(formData.weather);
            setAlertText({ value: null, type: null });
            modFormState(formData);
          });
      }
    };
    return (
      <div className="form-control weather">
        <label htmlFor="weather">Weather Forecast</label>
        <div className="weather-elements">
          <p>
            {forecast ||
              (alertText.type === "weather-fetch" && alertText.value) ||
              "Please Provide Date & City"}
          </p>
          <button
            onClick={fetchForecast}
            disabled={!date || !city || Boolean(alertText.type)}
          >
            {alertText.type === "weather-fetch" ? "Fetching..." : "Fetch"}
          </button>
        </div>
      </div>
    );
  };

  if (modal.open) {
    return (
      <div className="modal">
        <div id="modal-bg" />
        <form
          className="xs-12 sm-10 sm-off-1 sm-4 sm-off-4"
          onSubmit={handleSave}
        >
          <div className="form-control">
            <label htmlFor="reminder">
              Reminder
              <textarea
                name="reminder"
                value={formData["reminder"]}
                onChange={handleChange}
                maxLength={30}
                required
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="time">
              Time
              <input
                name="time"
                value={formData["time"]}
                onChange={handleChange}
                type="time"
                required
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="date">
              Date
              <input
                name="date"
                value={formData["date"]}
                onChange={handleChange}
                type="date"
                required
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="city">
              City
              <input
                name="city"
                value={formData["city"]}
                onChange={handleChange}
                type="text"
                required
              />
            </label>
          </div>
          <WeatcherForcast date={formData.date} city={formData.city} />
          <div
            className="form-control"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div className="form-control">
              <button type="submit" disabled={Boolean(alertText.type)}>
                {(alertText.type === "modal-save" && alertText.value) || "Save"}
              </button>
              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return null;
  }
}

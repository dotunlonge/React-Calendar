import { createSlice, nanoid } from "@reduxjs/toolkit";

import { getDate, createDate } from "../helpers/date";

const initialState = {
  all: [],
  dateSelected: getDate(),
  filterParams: {
    filter: false,
    date: null,
  },
  modal: {
    open: false,
    type: "add",
    data: {
      reminder: "",
      time: "",
      date: "",
      city: "",
      weather: "",
    },
  },
};

export const reminderSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    add: (state, action) => {
      state.all = [
        ...state.all,
        {
          ...action.payload,
          id: nanoid(),
          datetime: createDate(action.payload.date, action.payload.time),
        },
      ];
    },
    edit: (state, action) => {
      state.all = state.all.map((reminder) => {
        if (reminder.id === action.payload.id) {
          reminder = action.payload;
          reminder.datetime = createDate(
            action.payload.date,
            action.payload.time
          );
        }
        return reminder;
      });
    },
    remove: (state, action) => {
      state.all = state.all.filter(
        (reminder) => reminder.id !== action.payload
      );
    },
    changeMonth: (state, action) => {
      state.dateSelected = getDate(action.payload);
    },
    toggleModal: (state, action) => {
      state.modal = action.payload;
    },
    setFilterParams: (state, action) => {
      state.filterParams = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  add,
  remove,
  clear,
  changeMonth,
  edit,
  toggleModal,
  setFilterParams,
} = reminderSlice.actions;

export default reminderSlice.reducer;

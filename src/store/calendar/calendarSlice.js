import { createSlice } from "@reduxjs/toolkit";

// const tempEvent = {
//   id: `${new Date().getTime()}`,
//   title: "My first event",
//   notes: "ny first notes of my first event",
//   start: new Date(),
//   end: addHours(new Date(), 1),
//   bgColor: "#fafafa",
//   user: {
//     id: "123jk",
//     name: "Juanky Panky",
//   },
// };

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
      // don´t know if the payload is the event or the id
    },

    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },

    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });
      state.activeEvent = null;
    },

    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.id !== state.activeEvent.id
        );
        state.activeEvent = null;
      }
    },
    onLoadedEvent: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      // esto funciona pero voy recorrer los eventos de la Db y ver si existe en el store para tomar o No acciones
      // state.events = payload;
      payload.forEach((event) => {
        const exists = state.events.some(
          (storeEvent) => storeEvent.id === event.id
        );
        if (!exists) {
          state.events.push(event);
        }
      });
    },

    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true;
      state.events = [];
      state.activeEvent = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadedEvent,
  onLogoutCalendar,
} = calendarSlice.actions;

import { useSelector, useDispatch } from "react-redux";
import {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadedEvent,
} from "../store";
import { calendarApi } from "../apis";
import { convertEventsDate } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, activeEvent } = useSelector((state) => state.calendar);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      // * if _id property exists
      if (calendarEvent.id) {
        // * Update event in DB
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user })); // the spread operator is used to be sure that is a new object
        return;
      }
      // * if this is a new event => CREATE
      const { data } = await calendarApi.post("/events", calendarEvent);
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
    } catch (error) {
      console.log(error);
      Swal.fire("Saving error!", error.response.data.msg, "error");
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire("Deleting error!", error.response.data.msg, "error");
    }
  };

  const starLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const events = convertEventsDate(data.events);
      dispatch(onLoadedEvent(events));
    } catch (error) {
      console.error(error);
      console.log("Error loading events");
    }
  };

  return {
    // * Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // * Methods
    starLoadingEvents,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
  };
};

import { useSelector, useDispatch } from "react-redux";
import {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
} from "../store";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    // TODO: Call API to save event

    // * if _id property exists
    if (calendarEvent._id) {
      // * Update event
      dispatch(onUpdateEvent({ ...calendarEvent })); // the spread operator is used to be sure that is a new object
    } else {
      // * Create event and assign a fake _id
      dispatch(
        onAddNewEvent({ ...calendarEvent, _id: `${new Date().getTime()}` })
      );
    }
  };

  const startDeletingEvent = () => {
    dispatch(onDeleteEvent());
  };

  return {
    // * Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // * Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
  };
};

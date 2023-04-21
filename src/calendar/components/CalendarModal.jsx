import { useEffect, useMemo, useState } from "react";
import { addHours, differenceInSeconds } from "date-fns";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Modal from "react-modal";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import es from "date-fns/locale/es";
import { useCalendarStore, useUiStore } from "../../hooks";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root"); //the #root is the one defined in the index.html

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValue, setFormValue] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    return formSubmitted && formValue.title.length <= 0 ? "is-invalid" : "";
  }, [formValue.title, formSubmitted]);

  useEffect(() => {
    //* the activeEvent could be null, so...
    if (activeEvent !== null) {
      setFormValue({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChange = ({ target }) => {
    setFormValue({
      ...formValue,
      [target.name]: target.value,
    });
  };

  const onDateChange = (event, changing) => {
    setFormValue({
      ...formValue,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    //prevent that final date is after the initial date
    const dateDiff = differenceInSeconds(formValue.end, formValue.start);
    if (isNaN(dateDiff) || dateDiff <= 0) {
      Swal.fire({ icon: "error", title: "Error", text: "Dates invalid" });
      return;
    }

    // Event title mandatory
    if (formValue.title.length <= 0) {
      Swal.fire({ icon: "error", title: "Error", text: "Title mandatory" });
      return;
    }

    await startSavingEvent(formValue);
    closeDateModal();
    setFormSubmitted(false); // to disable warning in form
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      style={customStyles}
      onRequestClose={onCloseModal}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> New Event</h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Date & start time</label>
          <DatePicker
            className="form-control"
            selected={formValue.start}
            onChange={(event) => onDateChange(event, "start")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <div className="form-group mb-2">
          <label>Date & end time</label>
          <DatePicker
            minDate={formValue.start}
            className="form-control"
            selected={formValue.end}
            onChange={(event) => onDateChange(event, "end")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Title & notes</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Event title"
            name="title"
            autoComplete="off"
            value={formValue.title}
            onChange={onInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Short description
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notes"
            rows="5"
            name="notes"
            value={formValue.notes}
            onChange={onInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Additional information
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Save</span>
        </button>
      </form>
    </Modal>
  );
};

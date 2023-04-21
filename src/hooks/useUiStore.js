import { useSelector, useDispatch } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store";

export const useUiStore = () => {
  const dispatch = useDispatch();
  const { isDateModalOpen } = useSelector((state) => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const toggleDateModal = () => {
    //TODO: check is this is the right order
    isDateModalOpen ? openDateModal() : closeDateModal(); 
  };

  return {
    // * Properties
    isDateModalOpen,

    // * Methods
    openDateModal,
    closeDateModal,
    toggleDateModal
  };
};

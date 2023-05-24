import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../apis";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from "../store";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    // 1. Change status
    dispatch(onChecking());
    try {
      // 2. Call API
      const { data } = await calendarApi.post("/auth", { email, password });

      // 3. Save token and tokenDate to local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      // 4. dispatch login from slice
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispatch(onLogout("Invalid credentials"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    dispatch(onChecking);

    try {
      const { data } = await calendarApi.post("auth/new", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      console.error(error);

      dispatch(onLogout(error.response.data?.msg || "Invalid register info"));

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      // 4. dispatch login from slice
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //* Properties
    status,
    user,
    errorMessage,

    //* Methods
    startLogin,
    startLogout,
    startRegister,
    checkAuthToken,
  };
};

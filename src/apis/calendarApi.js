import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({ baseURL: VITE_API_URL });

// Todo: setup interceptors :
// * Interceptors -> allow to intercept a request before or after is done , and add info to the response or request
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers, //spread all existing headers to keep previous status
    "x-token": localStorage.getItem("token"),
  };

  return config;
});

export default calendarApi;

import axios, { type AxiosResponse } from "axios";
import { setToday } from "@/lib/today";
import { TODAY_HEADER, USER_HEADER } from "@/types/api";

let currentUserId: number | null = null;

export function setApiUserId(id: number | null) {
  currentUserId = id;
}

export const api = axios.create({ baseURL: "/api" });

function readToday(response: AxiosResponse | undefined) {
  const value = response?.headers[TODAY_HEADER.toLowerCase()];
  if (typeof value === "string") setToday(value);
}

api.interceptors.request.use((config) => {
  if (currentUserId !== null) config.headers.set(USER_HEADER, String(currentUserId));
  return config;
});

api.interceptors.response.use(
  (response) => {
    readToday(response);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) readToday(error.response);
    return Promise.reject(error);
  },
);

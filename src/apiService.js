
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = (data) => api.post("/signup", data);
export const login = (data) => api.post("/login", data);

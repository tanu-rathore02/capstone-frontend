import axios from "axios";
const baseUrl = "http://localhost:8080";
const app = axios.create({
  baseURL: baseUrl,
});
export default app;
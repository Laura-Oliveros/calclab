import axios from "axios";

const api = axios.create({
  baseURL: "https://calclab-5jkj.onrender.com/api",
});

export default api;
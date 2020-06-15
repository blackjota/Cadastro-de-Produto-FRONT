import axios from "axios";

const api = axios.create({
  baseURL: "https://cadastro-de-produtos-api.herokuapp.com/api/v1.0",
});

export default api;

import axios from "axios";

const api = axios.create({
  // baseURL: "https://localhost:5001/api/v1.0",
  baseURL: "https://cadastroproduto-api.azurewebsites.net/api/v1.0",
});

export default api;

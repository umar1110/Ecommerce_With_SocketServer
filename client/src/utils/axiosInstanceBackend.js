import axios from "axios";

const axiosBackend = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://luxuryloomshop.com/server",
});

export default axiosBackend;

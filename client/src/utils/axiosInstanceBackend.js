import axios from "axios";

const axiosBackend = axios.create({
  baseURL: "",
  // baseURL: "https://luxuryloomshop.com/server",
});

export default axiosBackend;

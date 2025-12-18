import axios from "axios";

const auth0Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default auth0Api;
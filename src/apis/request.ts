import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const api = axios.create({
  headers: {
    Authorization: "Bearer " + apiKey,
    'Content-Type': 'application/json',
  },
});

export default api;
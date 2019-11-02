import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tin-dev-backend.herokuapp.com',
});

export default api;

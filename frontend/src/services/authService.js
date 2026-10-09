
import api from './api';

const authService = {
  async register(name, email, password) {
    return api.post('/auth/register', { name, email, password });
  },

  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },
};

export default authService;


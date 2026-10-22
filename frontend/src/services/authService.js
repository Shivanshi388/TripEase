
import api from "./api";

const authService = {
  async register(name, email, password) {
    return api.post("/auth/register", { name, email, password });
  },

  async login(email, password) {
    return api.post("/auth/login", { email, password });
  },

  async verifyEmail(token) {
    return api.post("/auth/verify-email", { token });
  },

  async resendVerification(email) {
    return api.post("/auth/resend-verification", { email });
  },

  async forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  async resetPassword(token, password) {
    return api.post("/auth/reset-password", { token, password });
  },
};

export default authService;

import api from './api';

export const authApi = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  googleLogin: async (googleData) => {
    return await api.post('/auth/google', googleData);
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout');
    } catch (err) {
      // client cleanup
      return { success: true };
    }
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },

  verifyEmail: async (email) => {
    return await api.post('/auth/verify-email', { email });
  },

  sendOtp: async ({ email, name }) => {
    return await api.post('/auth/send-otp', { email, name });
  },

  verifyOtp: async ({ email, otp, password, name }) => {
    return await api.post('/auth/verify-otp', { email, otp, password, name });
  },

  // Passkey WebAuthn endpoints
  getPasskeyLoginChallenge: async (email) => {
    return await api.post('/auth/passkey/login-challenge', { email });
  },

  verifyPasskeyLogin: async ({ challengeId, credential, email }) => {
    return await api.post('/auth/passkey/login-verify', { challengeId, credential, email });
  },

  getPasskeyRegisterChallenge: async (deviceName) => {
    return await api.post('/auth/passkey/register-challenge', { deviceName });
  },

  verifyPasskeyRegister: async ({ challengeId, credential, deviceName }) => {
    return await api.post('/auth/passkey/register-verify', { challengeId, credential, deviceName });
  },

  getPasskeys: async () => {
    return await api.get('/auth/passkey/credentials');
  },

  deletePasskey: async (id) => {
    return await api.delete(`/auth/passkey/credentials/${id}`);
  },
};

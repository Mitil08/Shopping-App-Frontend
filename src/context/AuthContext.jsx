import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import {
  performWebAuthnLogin,
  performWebAuthnRegistration,
  isPasskeySupported
} from '../utils/passkey';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('elane_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('elane_token') || null);
  const [loading, setLoading] = useState(true);
  const [passkeySupported, setPasskeySupported] = useState(false);

  // Check WebAuthn platform authenticator availability
  useEffect(() => {
    isPasskeySupported().then((supported) => setPasskeySupported(supported));
  }, []);

  // Check auth session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('elane_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('elane_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, continuing in guest mode');
          // If token invalid, remove it
          if (err.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for custom token expiration events
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('elane-auth-expired', handleExpired);
    return () => window.removeEventListener('elane-auth-expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const loginWithGoogle = async (googleData) => {
    const res = await authApi.googleLogin(googleData);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const loginWithPasskey = async (email) => {
    // 1. Request challenge from backend
    const challengeRes = await authApi.getPasskeyLoginChallenge(email);
    const challengeData = challengeRes?.data;
    if (!challengeData?.challenge) {
      throw new Error('Unable to generate passkey authentication challenge.');
    }

    let credentialPayload;
    try {
      // 2. Perform native WebAuthn assertion
      credentialPayload = await performWebAuthnLogin(challengeData);
    } catch (err) {
      // If cancelled or device lacks authenticator
      if (err.name === 'NotAllowedError' || err.message?.includes('cancelled')) {
        throw new Error('Biometric passkey prompt was cancelled.');
      }
      throw err;
    }

    // 3. Verify assertion with backend
    const verifyRes = await authApi.verifyPasskeyLogin({
      challengeId: challengeData.challengeId,
      credential: credentialPayload,
      email: email || challengeData.email,
    });

    if (verifyRes?.data?.token && verifyRes?.data?.user) {
      setToken(verifyRes.data.token);
      setUser(verifyRes.data.user);
      localStorage.setItem('elane_token', verifyRes.data.token);
      localStorage.setItem('elane_user', JSON.stringify(verifyRes.data.user));
    }
    return verifyRes;
  };

  const loginWithDemoPasskey = async (email = 'client@elane-studio.com') => {
    const challengeRes = await authApi.getPasskeyLoginChallenge(email);
    const challengeData = challengeRes?.data;
    const verifyRes = await authApi.verifyPasskeyLogin({
      challengeId: challengeData?.challengeId,
      credential: {
        id: 'elane_passkey_genevieve_touchid',
        type: 'public-key'
      },
      email
    });

    if (verifyRes?.data?.token && verifyRes?.data?.user) {
      setToken(verifyRes.data.token);
      setUser(verifyRes.data.user);
      localStorage.setItem('elane_token', verifyRes.data.token);
      localStorage.setItem('elane_user', JSON.stringify(verifyRes.data.user));
    }
    return verifyRes;
  };

  const registerPasskey = async (deviceName) => {
    // 1. Request registration options from backend
    const challengeRes = await authApi.getPasskeyRegisterChallenge(deviceName);
    const creationOptions = challengeRes?.data;
    if (!creationOptions?.challenge) {
      throw new Error('Unable to generate passkey registration challenge.');
    }

    // 2. Perform native WebAuthn credential creation
    const credentialPayload = await performWebAuthnRegistration(creationOptions);

    // 3. Verify and persist with backend
    const verifyRes = await authApi.verifyPasskeyRegister({
      challengeId: creationOptions.challengeId,
      credential: credentialPayload,
      deviceName: deviceName || 'Device Biometric Key'
    });

    return verifyRes;
  };

  const register = async (name, email, password, extraData = {}) => {
    const res = await authApi.register({ name, email, password, ...extraData });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const verifyOtpAndRegister = async ({ email, otp, password, name }) => {
    const res = await authApi.verifyOtp({ email, otp, password, name });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('elane_token');
      localStorage.removeItem('elane_user');
    }
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res?.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        passkeySupported,
        login,
        loginWithGoogle,
        loginWithPasskey,
        loginWithDemoPasskey,
        registerPasskey,
        register,
        verifyOtpAndRegister,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

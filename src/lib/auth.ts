import api from './api';
import { setCookie } from 'cookies-next';
import { getMessagingIfSupported } from './firebase';

// Login and save tokens to cookies
export const login = async (username: string, password: string) => {
  const res = await api.post('/api/token/', { username, password });

  // Store access and refresh tokens in cookies with expiry time (e.g., 1 hour for access token)
  setCookie('reminderx_access', res.data.access, { maxAge: 60 * 60 }); // 1 hour expiry
  setCookie('reminderx_refresh', res.data.refresh, { maxAge: 60 * 60 * 24 * 30 }); // 30 days expiry

  // Register FCM token with backend
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const messaging = await getMessagingIfSupported();
        if (messaging) {
          const { getToken } = await import('firebase/messaging');
          const fcmToken = await getToken(messaging, { vapidKey: 'BI7W24jOKJ_fAfEUaGnr5j0qKuZcrjeH-Hlq9wMqqEzYvSGneVK2RUZUdusdf_4B-SQWToUSdqbcR-uXXbzC2eQ' });
          if (fcmToken) {
            await api.post('/api/fcm-token/', {
              token: fcmToken,
              platform: 'web',
            }, {
              headers: { Authorization: `Bearer ${res.data.access}` }
            });
          }
        }
      }
    } catch (err) {
      console.error('FCM registration failed:', err);
    }
  }

  return res.data;
};

// Verify organization ID
export const verifyOrganization = async (orgId: string) => {
  const res = await api.get('/api/verify-organization/', { params: { org_id: orgId } });
  return res.data;
};

// Send verification email (OTP)
export const sendVerificationEmail = async (email: string, username: string) => {
  const res = await api.post('/api/verify-email/', { email, username });
  return res.data;
};

// Resend OTP (same as sendVerificationEmail)
export const resendOtp = async (email: string, username: string) => {
  return sendVerificationEmail(email, username);
};

// Register a new user and save tokens
export const register = async (username: string, email: string, password: string, otp: string, organization_id?: string) => {
  const res = await api.post('/api/register/', { username, email, password, otp, organization_id: organization_id || null });

  // Store access and refresh tokens in cookies
  setCookie('reminderx_access', res.data.access, { maxAge: 60 * 60 });
  setCookie('reminderx_refresh', res.data.refresh, { maxAge: 60 * 60 * 24 * 30 });

  return res.data;
};

//Reset password token request
export const requestPasswordReset = async (email: string) => {
 const res = await api.post('/api/password_reset/', { email });
  return res.data;
};

// Confirm password reset (with token and new password)
export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const res = await api.post('/api/password_reset/confirm/', { token, password: newPassword, });
  return res.data;
};

// Logout user and remove tokens from cookies
export const logout = () => {
  // Remove the access and refresh tokens cookies
  document.cookie = 'reminderx_access=; Max-Age=0';
  document.cookie = 'reminderx_refresh=; Max-Age=0';
};

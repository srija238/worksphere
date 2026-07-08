import axiosInstance from '../../lib/axios';
import { LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse } from './types';

const API_BASE = '/auth';

/**
 * Login user with email and password
 * Returns authentication token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      `${API_BASE}/login`,
      credentials
    );

    // Store token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('tokenType', response.data.token_type);
    }

    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.detail || error.response?.data?.message || 'Login failed',
      status: error.response?.status,
    };
  }
};

/**
 * Request password reset for email
 */
export const forgotPassword = async (
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      `${API_BASE}/forgot-password`,
      request
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.detail || error.response?.data?.message || 'Failed to send reset email',
      status: error.response?.status,
    };
  }
};

/**
 * Logout user
 * Clear authentication data
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenType');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

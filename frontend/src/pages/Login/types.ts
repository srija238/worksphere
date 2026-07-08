// Login Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

// Feature Card Type
export interface FeatureCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// API Error Type
export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
}

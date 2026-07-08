import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import Card from '../../components/ui/Card';
import { login } from './authApi';
import { validateLoginForm, hasValidationErrors, ValidationErrors } from './validation';
import { FeatureCard } from './types';
import '../../../src/styles/login-glow.css';

interface FeatureCardData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const LoginPage: React.FC = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate form
    const errors = validateLoginForm(email, password);
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call login API
      const response = await login({ email, password });

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear email error on change
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear password error on change
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Feature cards for left panel
  const featureCards: FeatureCardData[] = [
    {
      id: 'collaboration',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Team Collaboration',
      description: 'Work together and achieve more',
    },
    {
      id: 'tracking',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Project Tracking',
      description: 'Track progress and hit deadlines',
    },
    {
      id: 'productivity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Smart Productivity',
      description: 'Plan better, work smarter',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative flex items-center justify-center overflow-x-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Hero Content - Left side on desktop */}
      <div className="hidden lg:flex absolute left-0 top-0 w-1/2 h-full flex-col justify-between p-12 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26H22L17.55 12.59L19.64 18.85L12 14.52L4.36 18.85L6.45 12.59L2 8.26H8.91L12 2Z" />
            </svg>
            <span className="text-white font-bold text-xl">WorkSphere</span>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <p className="text-orange-500 text-sm font-semibold tracking-wider mb-4">WELCOME TO</p>
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-white">Work</span>
              <span className="text-orange-500">Sphere</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Manage projects, collaborate with your team, and track progress seamlessly.
            </p>
          </div>

          {/* Glowing curved line */}
          {/* <div className="my-12 glow-line">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 400 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-md"
            >
              <path
                d="M0 30 Q 100 10, 200 30 T 400 30"
                stroke="url(#gradientOrange)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#FF6B35" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div> */}
        </div>

        {/* Feature cards */}
        <div className="space-y-4 pointer-events-auto">
          {featureCards.map((card) => (
            <Card
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              className="animate-fade-in-up"
            />
          ))}
        </div>
      </div>

      {/* Main centered login card */}
      <div className="absolute inset-0 flex items-center justify-end pr-24 xl:pr-32 2xl:pr-40 z-20">

    <div className="w-full max-w-[620px]">
        <div className="w-full max-w-md">
          {/* Mobile logo - only shown on mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26H22L17.55 12.59L19.64 18.85L12 14.52L4.36 18.85L6.45 12.59L2 8.26H8.91L12 2Z" />
            </svg>
            <span className="text-white font-bold text-lg">WorkSphere</span>
          </div>

          {/* Login card with glow effect */}
          <div className="relative group">
            {/* Glow background - prominent orange glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 to-orange-600/40 rounded-2xl blur-2xl opacity-100"></div>

            {/* Card content */}
            <div className="relative bg-gray-800/95 backdrop-blur-md border-2 border-orange-500/60 rounded-2xl p-8 shadow-2xl hover:border-orange-500/80 transition-colors duration-300">
              {/* Welcome message */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-gray-400 text-sm">Sign in to continue to your account</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email input */}
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  error={validationErrors.email}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  disabled={loading}
                />

                {/* Password input */}
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={validationErrors.password}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  showPasswordToggle
                  showPassword={showPassword}
                  onPasswordToggle={setShowPassword}
                  disabled={loading}
                />

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between pt-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    label="Remember me"
                  />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Navigate to forgot password page
                    }}
                    className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Sign in button */}
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full mt-6"
                  size="lg"
                >
                  Sign in
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* Secure access footer */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span>Secure access to your workspace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hero content */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-auto pt-8 px-6 pointer-events-none z-0">
        <div className="flex items-center gap-2 mb-4 pointer-events-auto">
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26H22L17.55 12.59L19.64 18.85L12 14.52L4.36 18.85L6.45 12.59L2 8.26H8.91L12 2Z" />
          </svg>
          <span className="text-white font-bold">WorkSphere</span>
        </div>
      </div>
     </div>
    </div>
  );
};

export default LoginPage;

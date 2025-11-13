import React, { useState } from 'react';
import { User, Lock, Building2, Hash, UserCheck, Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import apiService from './services/api';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  accountNumber: string;
  ifscCode: string;
}

interface RegisterErrors {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  accountNumber: string;
  ifscCode: string;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation functions
  const validateName = (name: string): string => {
    if (!name) return 'Name is required';
    if (!/^[A-Za-z\s]+$/.test(name)) return 'Name can only contain alphabets and spaces';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain @ symbol';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email format';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    return '';
  };

  const validatePasswordConfirm = (passwordConfirm: string, password: string): string => {
    if (!passwordConfirm) return 'Please confirm your password';
    if (passwordConfirm !== password) return 'Passwords do not match';
    return '';
  };

  const validateAccountNumber = (accountNumber: string): string => {
    if (!accountNumber) return 'Account number is required';
    if (!/^\d+$/.test(accountNumber)) return 'Account number can only contain numbers';
    if (accountNumber.length < 9 || accountNumber.length > 18) return 'Account number must be between 9-18 digits';
    return '';
  };

  const validateIFSC = (ifsc: string): string => {
    if (!ifsc) return 'IFSC code is required';
    if (!/^[A-Z0-9]+$/.test(ifsc)) return 'IFSC code can only contain uppercase letters and numbers';
    if (ifsc.length !== 11) return 'IFSC code must be exactly 11 characters';
    return '';
  };

  // Handle field changes
  const handleFieldChange = (field: keyof RegisterData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validate the changed field
    let error = '';
    if (field === 'name') {
      error = validateName(value);
    } else if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
      // Also revalidate password confirm if password changes
      if (newFormData.passwordConfirm) {
        const confirmError = validatePasswordConfirm(newFormData.passwordConfirm, value);
        setErrors(prev => ({ ...prev, passwordConfirm: confirmError }));
      }
    } else if (field === 'passwordConfirm') {
      error = validatePasswordConfirm(value, newFormData.password);
    } else if (field === 'accountNumber') {
      error = validateAccountNumber(value);
    } else if (field === 'ifscCode') {
      error = validateIFSC(value.toUpperCase());
      // Auto-uppercase IFSC code
      newFormData.ifscCode = value.toUpperCase();
    }

    setErrors(prev => ({ ...prev, [field]: error }));

    // Check if form is valid
    const nameError = field === 'name' ? error : validateName(newFormData.name);
    const emailError = field === 'email' ? error : validateEmail(newFormData.email);
    const passwordError = field === 'password' ? error : validatePassword(newFormData.password);
    const passwordConfirmError = field === 'passwordConfirm' ? error : validatePasswordConfirm(newFormData.passwordConfirm, newFormData.password);
    const accountError = field === 'accountNumber' ? error : validateAccountNumber(newFormData.accountNumber);
    const ifscError = field === 'ifscCode' ? error : validateIFSC(newFormData.ifscCode);

    setIsValid(
      !nameError &&
      !emailError &&
      !passwordError &&
      !passwordConfirmError &&
      !accountError &&
      !ifscError &&
      !!newFormData.name &&
      !!newFormData.email &&
      !!newFormData.password &&
      !!newFormData.passwordConfirm &&
      !!newFormData.accountNumber &&
      !!newFormData.ifscCode
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.passwordConfirm,
          account_number: formData.accountNumber,
          ifsc_code: formData.ifscCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.email) {
          setErrors(prev => ({ ...prev, email: Array.isArray(data.email) ? data.email[0] : data.email }));
        }
        if (data.password) {
          setErrors(prev => ({ ...prev, password: Array.isArray(data.password) ? data.password[0] : data.password }));
        }
        if (data.non_field_errors) {
          setErrorMessage(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        } else {
          setErrorMessage(data.error || data.message || 'Registration failed. Please try again.');
        }
        return;
      }

      // Store token if provided
      if (data.token) {
        apiService.setToken(data.token);
        if (data.user) {
          localStorage.setItem('user_data', JSON.stringify(data.user));
        }
      }

      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      
      // Redirect after a short delay
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-green-400/8 to-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400/5 to-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300 shadow-lg shadow-green-400/50"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-bounce delay-700 shadow-lg shadow-green-500/50"></div>
        <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-1000 shadow-lg shadow-green-400/50"></div>
      </div>

      {/* Register Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-300">Sign up to get started</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-center space-x-2 text-green-400 animate-slide-up">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center space-x-2 text-red-400 animate-slide-up">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.passwordConfirm}
                  onChange={(e) => handleFieldChange('passwordConfirm', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.passwordConfirm
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* Account Number Field */}
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => handleFieldChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.accountNumber
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.accountNumber && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.accountNumber}</p>
                )}
              </div>

              {/* IFSC Code Field */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="IFSC Code (e.g., SBIN0001234)"
                  value={formData.ifscCode}
                  onChange={(e) => handleFieldChange('ifscCode', e.target.value.toUpperCase())}
                  maxLength={11}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                    errors.ifscCode
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                  }`}
                />
                {errors.ifscCode && (
                  <p className="text-red-400 text-sm mt-1 ml-1">{errors.ifscCode}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg text-lg flex items-center justify-center space-x-2 ${
                  isValid && !loading
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 hover:shadow-xl shadow-green-500/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{loading ? 'Creating Account...' : 'Register'}</span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-4">Already have an account?</p>
              <button
                onClick={onGoToLogin}
                className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors duration-300 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


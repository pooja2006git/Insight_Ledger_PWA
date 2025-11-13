import React, { useState, useEffect } from 'react';
import { User, Lock, Fingerprint, Brain, WifiOff, Clock, CreditCard, DollarSign, ShoppingCart, GraduationCap, Home, Car, Shield, Search, Filter, X, CheckCircle, AlertCircle, Loader2, ArrowRight, LogOut, XCircle, FileText } from 'lucide-react';
import apiService, { FrontendTransaction, TransactionStats } from './services/api';
import Register from './Register';

interface Transaction extends FrontendTransaction {
  icon: React.ReactNode;
}

// Map categories to icons
const getCategoryIcon = (category: string): React.ReactNode => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('salary') || categoryLower.includes('income')) {
    return <DollarSign className="w-5 h-5" />;
  } else if (categoryLower.includes('grocery')) {
    return <ShoppingCart className="w-5 h-5" />;
  } else if (categoryLower.includes('fees') || categoryLower.includes('education')) {
    return <GraduationCap className="w-5 h-5" />;
  } else if (categoryLower.includes('utilities') || categoryLower.includes('home')) {
    return <Home className="w-5 h-5" />;
  } else if (categoryLower.includes('transport') || categoryLower.includes('car')) {
    return <Car className="w-5 h-5" />;
  } else {
    return <CreditCard className="w-5 h-5" />;
  }
};

// Format relative time (e.g., "2h ago", "Yesterday", "3d ago")
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// Generate dummy transactions
const generateDummyTransactions = (): Transaction[] => {
  const now = new Date();
  const createTransaction = (
    id: string,
    title: string,
    amount: number,
    type: 'income' | 'expense',
    category: string,
    date: Date,
    description: string
  ): Transaction => ({
    id,
    title,
    amount,
    type,
    category,
    date: date.toISOString(),
    time: formatRelativeTime(date),
    description,
    icon: getCategoryIcon(category),
  });

  const dummyData: Transaction[] = [
    createTransaction(
      'TXN-001',
      'Grocery Shopping',
      1250.50,
      'expense',
      'grocery',
      new Date(now.getTime() - 1 * 3600000), // 1h ago
      'Weekly groceries from supermarket'
    ),
    createTransaction(
      'TXN-002',
      'Freelance Payment',
      3200.00,
      'income',
      'salary',
      new Date(now.getTime() - 2 * 3600000), // 2h ago
      'Payment for web development project'
    ),
    createTransaction(
      'TXN-003',
      'Uber Ride',
      350.00,
      'expense',
      'transport',
      new Date(now.getTime() - 3 * 3600000), // 3h ago
      'Ride to office'
    ),
    createTransaction(
      'TXN-004',
      'Coffee Shop',
      280.00,
      'expense',
      'other',
      new Date(now.getTime() - 5 * 3600000), // 5h ago
      'Morning coffee and breakfast'
    ),
    createTransaction(
      'TXN-005',
      'Part-time Job',
      1800.00,
      'income',
      'salary',
      new Date(now.getTime() - 8 * 3600000), // 8h ago
      'Weekly part-time work payment'
    ),
    createTransaction(
      'TXN-006',
      'Restaurant Dinner',
      1850.00,
      'expense',
      'other',
      new Date(now.getTime() - 12 * 3600000), // 12h ago
      'Dinner with friends'
    ),
    createTransaction(
      'TXN-007',
      'Online Tutoring',
      2400.00,
      'income',
      'salary',
      new Date(now.getTime() - 18 * 3600000), // 18h ago
      'Tutoring session payment'
    ),
    createTransaction(
      'TXN-008',
      'Pharmacy',
      650.00,
      'expense',
      'other',
      new Date(now.getTime() - 24 * 3600000), // Yesterday
      'Medicine and health supplies'
    ),
    createTransaction(
      'TXN-009',
      'Bookstore',
      890.00,
      'expense',
      'other',
      new Date(now.getTime() - 26 * 3600000), // 26h ago
      'Purchased study materials'
    ),
    createTransaction(
      'TXN-010',
      'Graphic Design Project',
      4200.00,
      'income',
      'salary',
      new Date(now.getTime() - 2 * 86400000), // 2d ago
      'Payment for logo design work'
    ),
    createTransaction(
      'TXN-011',
      'Electricity Bill',
      2200.00,
      'expense',
      'utilities',
      new Date(now.getTime() - 2 * 86400000 - 4 * 3600000), // 2d 4h ago
      'Monthly electricity bill payment'
    ),
    createTransaction(
      'TXN-012',
      'Movie Tickets',
      750.00,
      'expense',
      'other',
      new Date(now.getTime() - 3 * 86400000), // 3d ago
      'Weekend movie with family'
    ),
    createTransaction(
      'TXN-013',
      'Content Writing',
      3100.00,
      'income',
      'salary',
      new Date(now.getTime() - 3 * 86400000 - 6 * 3600000), // 3d 6h ago
      'Article writing payment'
    ),
    createTransaction(
      'TXN-014',
      'Gym Membership',
      1500.00,
      'expense',
      'other',
      new Date(now.getTime() - 4 * 86400000), // 4d ago
      'Monthly gym subscription'
    ),
    createTransaction(
      'TXN-015',
      'Course Fees',
      3800.00,
      'expense',
      'fees',
      new Date(now.getTime() - 4 * 86400000 - 8 * 3600000), // 4d 8h ago
      'Online course enrollment'
    ),
    createTransaction(
      'TXN-016',
      'Photography Gig',
      4500.00,
      'income',
      'salary',
      new Date(now.getTime() - 5 * 86400000), // 5d ago
      'Event photography payment'
    ),
    createTransaction(
      'TXN-017',
      'Gas Station',
      1200.00,
      'expense',
      'transport',
      new Date(now.getTime() - 5 * 86400000 - 12 * 3600000), // 5d 12h ago
      'Fuel for vehicle'
    ),
    createTransaction(
      'TXN-018',
      'Consulting Fee',
      2800.00,
      'income',
      'salary',
      new Date(now.getTime() - 6 * 86400000), // 6d ago
      'Business consulting payment'
    ),
    createTransaction(
      'TXN-019',
      'Internet Bill',
      950.00,
      'expense',
      'utilities',
      new Date(now.getTime() - 6 * 86400000 - 18 * 3600000), // 6d 18h ago
      'Monthly internet subscription'
    ),
    createTransaction(
      'TXN-020',
      'Translation Work',
      1650.00,
      'income',
      'salary',
      new Date(now.getTime() - 7 * 86400000), // 7d ago
      'Document translation payment'
    ),
  ];
  
  // Sort by date (most recent first)
  return dummyData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

function App() {
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'register' | 'dashboard'>('splash');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Validation states
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [isLoginValid, setIsLoginValid] = useState(false);

  // API states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Validation functions
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

  
  // Transaction filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Lazy loading states
  const [displayedCount, setDisplayedCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  
  // Online/Offline states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Load dashboard data (transactions and stats) - using dummy data
  const loadDashboardData = React.useCallback(async () => {
    if (!apiService.isAuthenticated()) return;

    setLoading(true);
    setError(null);
    try {
      // Use dummy transactions instead of API call
      const dummyTransactions = generateDummyTransactions();
      
      // Calculate stats from dummy transactions
      const totalIncome = dummyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = dummyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const netAmount = totalIncome - totalExpenses;
      
      const statsData: TransactionStats = {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_amount: netAmount,
        total_transactions: dummyTransactions.length,
        transaction_types: {},
      };

      setTransactions(dummyTransactions);
      setStats(statsData);
      // Reset displayed count to 5 when transactions are loaded
      setDisplayedCount(5);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading dashboard data:', err);
      
      // If authentication failed, redirect to login
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        apiService.logout();
        setCurrentStep('login');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is already authenticated on mount and verify token
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        // Verify token is still valid
        const isValid = await apiService.verifyToken();
        if (isValid) {
          setCurrentStep('dashboard');
          loadDashboardData();
        } else {
          // Token is invalid, redirect to login
          setCurrentStep('login');
          apiService.logout();
        }
      }
    };
    checkAuth();
  }, [loadDashboardData]);

  // Auto-transition from splash to login or dashboard after 3 seconds
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(async () => {
        // Check if user is authenticated
        if (apiService.isAuthenticated()) {
          const isValid = await apiService.verifyToken();
          if (isValid) {
            setCurrentStep('dashboard');
          } else {
            setCurrentStep('login');
          }
        } else {
          setCurrentStep('login');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Check for valid token when on login page
  useEffect(() => {
    const checkTokenOnLogin = async () => {
      if (currentStep === 'login') {
        if (apiService.isAuthenticated()) {
          const isValid = await apiService.verifyToken();
          setHasValidToken(isValid);
        } else {
          setHasValidToken(false);
        }
      }
    };
    checkTokenOnLogin();
  }, [currentStep]);

  // Load dashboard data when dashboard is shown and verify token
  useEffect(() => {
    const loadDashboardIfAuthenticated = async () => {
      if (currentStep === 'dashboard') {
        if (!apiService.isAuthenticated()) {
          // No token, redirect to login
          setCurrentStep('login');
          return;
        }
        
        // Verify token is valid
        const isValid = await apiService.verifyToken();
        if (isValid) {
          loadDashboardData();
        } else {
          // Token is invalid, redirect to login
          setCurrentStep('login');
          apiService.logout();
        }
      }
    };
    loadDashboardIfAuthenticated();
  }, [currentStep, loadDashboardData]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      if (!isOnline) {
        setIsOnline(true);
        setConnectionMessage('Online mode active — recent transactions are now synced.');
        setShowConnectionPopup(true);
      }
    };

    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        setConnectionMessage('Offline mode active — recent transactions will sync when you are back online.');
        setShowConnectionPopup(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  // Get unique categories from transactions
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get displayed transactions (lazy loaded)
  const displayedTransactions = filteredTransactions.slice(0, displayedCount);
  const hasMoreTransactions = displayedCount < filteredTransactions.length;

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(5);
  }, [searchTerm, selectedCategory]);

  // Load more transactions function
  const loadMoreTransactions = React.useCallback(() => {
    if (isLoadingMore || !hasMoreTransactions) return;
    
    setIsLoadingMore(true);
    
    // Simulate async loading with a small delay for smooth UX
    setTimeout(() => {
      setDisplayedCount(prev => {
        const nextCount = prev + 5;
        return Math.min(nextCount, filteredTransactions.length);
      });
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, hasMoreTransactions, filteredTransactions.length]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!hasMoreTransactions || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreTransactions && !isLoadingMore) {
          loadMoreTransactions();
        }
      },
      {
        root: null,
        rootMargin: '150px', // Start loading 150px before reaching the bottom
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreTransactions, isLoadingMore, loadMoreTransactions]);

  // Validation handlers
  const handleLoginFieldChange = (field: 'email' | 'password', value: string) => {
    const newCredentials = {...credentials, [field]: value};
    setCredentials(newCredentials);
    
    const error = field === 'email' ? validateEmail(value) : validatePassword(value);
    setLoginErrors({...loginErrors, [field]: error});
    
    // Check if form is valid
    const emailError = field === 'email' ? error : validateEmail(newCredentials.email);
    const passwordError = field === 'password' ? error : validatePassword(newCredentials.password);
    setIsLoginValid(!emailError && !passwordError && !!newCredentials.email && !!newCredentials.password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid) return;

    setLoginLoading(true);
    setError(null);
    setLoginErrors({ email: '', password: '' });

    try {
      await apiService.login(credentials.email, credentials.password);
      // Token is automatically stored by apiService
      // Redirect to dashboard
      setCurrentStep('dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setLoginErrors({
        email: errorMessage.includes('email') || errorMessage.includes('Invalid') ? errorMessage : '',
        password: errorMessage.includes('password') || errorMessage.includes('Invalid') ? errorMessage : '',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    // Simulate biometric authentication
    setCurrentStep('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentStep('dashboard');
  };

  const handleGoToRegister = () => {
    setCurrentStep('register');
  };

  const handleGoToLogin = () => {
    setCurrentStep('login');
    setError(null);
    setCredentials({ email: '', password: '' });
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    setShowFilterDropdown(false);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowFilterDropdown(false);
  };

  // Splash Screen
  if (currentStep === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-green-400/8 to-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400/5 to-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Splash Content */}
        <div className="relative z-10 text-center animate-fade-in-zoom">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/25 animate-bounce">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 animate-slide-up">
            Insight Ledger
          </h1>
          <p className="text-2xl text-gray-300 animate-slide-up delay-300">
            A Smarter E-Passbook
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-green-400/8 to-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400/5 to-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* 3D Earth Animation */}
        <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-64 h-64">
            {/* Earth Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Earth Body */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-full shadow-2xl animate-spin-slow overflow-hidden">
              {/* Continent Highlights */}
              <div className="absolute top-8 left-12 w-16 h-8 bg-gradient-to-r from-green-400/30 to-green-500/30 rounded-full blur-sm"></div>
              <div className="absolute top-20 right-8 w-12 h-12 bg-gradient-to-l from-green-500/25 to-green-400/25 rounded-full blur-sm"></div>
              <div className="absolute bottom-16 left-8 w-20 h-6 bg-gradient-to-r from-green-400/28 to-green-500/28 rounded-full blur-sm"></div>
              <div className="absolute bottom-8 right-16 w-8 h-8 bg-gradient-to-l from-green-500/30 to-green-400/30 rounded-full blur-sm"></div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-green-400 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
              </div>
            </div>

            {/* Orbiting Security Shield */}
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md w-12 h-12"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Orbiting Elements */}
            <div className="absolute inset-0 animate-spin-slow-reverse">
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-500 shadow-lg shadow-green-500/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Security Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300 shadow-lg shadow-green-400/50"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-bounce delay-700 shadow-lg shadow-green-500/50"></div>
          <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-1000 shadow-lg shadow-green-400/50"></div>
        </div>

        {/* Login Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-300">Sign in to your secure account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={credentials.email}
                      onChange={(e) => handleLoginFieldChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                        loginErrors.email 
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
                          : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                      }`}
                    />
                    {loginErrors.email && (
                      <p className="text-red-400 text-sm mt-1 ml-1">{loginErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => handleLoginFieldChange('password', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-700/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg placeholder-gray-400 text-white ${
                        loginErrors.password 
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
                          : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500'
                      }`}
                    />
                    {loginErrors.password && (
                      <p className="text-red-400 text-sm mt-1 ml-1">{loginErrors.password}</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isLoginValid || loginLoading}
                  className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg text-lg flex items-center justify-center space-x-2 ${
                    isLoginValid && !loginLoading
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 hover:shadow-xl shadow-green-500/25'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loginLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{loginLoading ? 'Signing in...' : 'Sign In'}</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="text-gray-400 mb-4">Or continue with</div>
                <button
                  onClick={handleBiometricLogin}
                  className="mx-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-all duration-300 hover:scale-105 group border border-gray-600/50"
                >
                  <Fingerprint className="w-6 h-6 text-green-400 group-hover:text-green-300" />
                  <span className="text-gray-300 font-medium">Biometric Login</span>
                </button>
              </div>

              {/* Continue to Dashboard if valid token exists */}
              {hasValidToken && (
                <div className="mt-6 text-center border-t border-gray-700/50 pt-6">
                  <p className="text-gray-400 text-sm mb-4">Already logged in?</p>
                  <button
                    onClick={() => {
                      setCurrentStep('dashboard');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400 font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 border border-green-500/30 mb-4"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Continue to Dashboard</span>
                  </button>
                </div>
              )}

              <div className={`mt-6 text-center ${hasValidToken ? '' : 'border-t border-gray-700/50 pt-6'}`}>
                <p className="text-gray-400 text-sm mb-4">Don't have an account?</p>
                <button
                  onClick={handleGoToRegister}
                  className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors duration-300 font-medium group"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Register Screen
  if (currentStep === 'register') {
    return <Register onRegisterSuccess={handleRegisterSuccess} onGoToLogin={handleGoToLogin} />;
  }

  // Dashboard Screen (existing transaction page with modifications)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Connection Status Popup */}
      {showConnectionPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              {isOnline ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-orange-400" />
              )}
              <h3 className="text-lg font-semibold text-white">
                {isOnline ? 'Back Online' : 'Offline Mode'}
              </h3>
            </div>
            <p className="text-gray-300 mb-6">{connectionMessage}</p>
            <button
              onClick={() => setShowConnectionPopup(false)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-green-500/8 to-green-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-green-400/5 to-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/3 to-green-500/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI-Powered E-Passbook</h1>
                <p className="text-gray-300">Intelligent transaction management</p>
              </div>
            </div>
            
            {/* Sign Out and Close Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  // Close - redirect to login page without clearing token
                  // User remains logged in and can return to dashboard
                  setCurrentStep('login');
                  setError(null);
                  setCredentials({ email: '', password: '' });
                }}
                className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 border border-gray-600/50"
                title="Close"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Close</span>
              </button>
              
              <button
                onClick={() => {
                  // Sign Out - clear token and redirect to login
                  apiService.logout();
                  setCurrentStep('login');
                  setTransactions([]);
                  setStats(null);
                  setCredentials({ email: '', password: '' });
                  setError(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg shadow-red-500/25"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Net Balance</p>
                  <p className={`text-2xl font-bold ${stats && stats.net_amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{stats ? Math.abs(stats.net_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    +₹{stats ? stats.total_income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">
                    {stats ? stats.total_transactions : transactions.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/90 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 placeholder-gray-400 text-white"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="p-3 bg-gray-800/90 border border-gray-700/50 rounded-xl hover:bg-gray-700/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <Filter className="w-5 h-5 text-gray-400" />
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20">
                    <div className="p-2">
                      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <span>Filter by Category</span>
                        {selectedCategory && (
                          <button
                            onClick={clearFilter}
                            className="text-green-400 hover:text-green-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => selectCategory(category)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            selectedCategory === category
                              ? 'bg-green-500/20 text-green-400'
                              : 'text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedCategory && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Filtered by:</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center space-x-2">
                  <span>{selectedCategory}</span>
                  <button onClick={clearFilter} className="hover:text-green-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            </div>
            
            <div className="divide-y divide-gray-700/50">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading transactions...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">{error}</p>
                  <button
                    onClick={loadDashboardData}
                    className="mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : displayedTransactions.length > 0 ? (
                <>
                  {displayedTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 hover:bg-gray-700/30 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${
                            transaction.type === 'income' 
                              ? 'bg-green-500/20' 
                              : 'bg-red-500/20'
                          }`}>
                            {transaction.type === 'income' ? '💰' : '🛒'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white group-hover:text-gray-100 transition-colors truncate">
                              {transaction.title || transaction.category}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1 flex-wrap">
                              <span className="text-xs font-mono text-gray-500">{transaction.id}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{transaction.time}</span>
                              </div>
                              <span>•</span>
                              <span>{transaction.category}</span>
                              {transaction.description && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1 max-w-xs">
                                    <FileText className="w-3 h-3" />
                                    <span className="truncate">{transaction.description}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className={`font-bold text-lg ${
                            transaction.type === 'income' 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Lazy loading sentinel and loading indicator */}
                  {hasMoreTransactions && (
                    <div 
                      ref={observerTarget} 
                      className="py-8 min-h-[100px] flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                        <span className="text-sm text-gray-400">
                          {isLoadingMore ? 'Loading more transactions...' : 'Scroll for more transactions...'}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No transactions found</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { User, Lock, Fingerprint, Brain, Wifi, WifiOff, Clock, CreditCard, DollarSign, ShoppingCart, GraduationCap, Home, Car, Shield, Building2, Hash, UserCheck, Search, Filter, X, CheckCircle } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  time: string;
  type: 'income' | 'expense';
  icon: React.ReactNode;
}

const transactions: Transaction[] = [
  {
    id: 'TXN001',
    amount: 5000,
    category: 'Salary',
    time: '2 hours ago',
    type: 'income',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    id: 'TXN002',
    amount: 250,
    category: 'Grocery',
    time: '5 hours ago',
    type: 'expense',
    icon: <ShoppingCart className="w-5 h-5" />
  },
  {
    id: 'TXN003',
    amount: 800,
    category: 'Fees',
    time: '1 day ago',
    type: 'expense',
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    id: 'TXN004',
    amount: 150,
    category: 'Utilities',
    time: '2 days ago',
    type: 'expense',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'TXN005',
    amount: 320,
    category: 'Others',
    time: '3 days ago',
    type: 'expense',
    icon: <Car className="w-5 h-5" />
  },
  {
    id: 'TXN006',
    amount: 1200,
    category: 'Freelance',
    time: '4 days ago',
    type: 'income',
    icon: <CreditCard className="w-5 h-5" />
  }
];

const categories = ['Grocery', 'Salary', 'Fees', 'Utilities', 'Freelance', 'Others'];

function App() {
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'link' | 'dashboard'>('splash');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [accountDetails, setAccountDetails] = useState({ 
    accountNumber: '', 
    ifscCode: '', 
    name: '' 
  });
  
  // Transaction filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Online/Offline states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Auto-transition from splash to login after 3 seconds
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setCurrentStep('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

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

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo
    if (credentials.email && credentials.password) {
      setCurrentStep('link');
    }
  };

  const handleBiometricLogin = () => {
    // Simulate biometric authentication
    setCurrentStep('link');
  };

  const handleLinkAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Store account details in state (no backend call)
    if (accountDetails.accountNumber && accountDetails.ifscCode && accountDetails.name) {
      setCurrentStep('dashboard');
    }
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
                      onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400 text-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg shadow-green-500/25"
                >
                  Sign In
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Link Account Screen
  if (currentStep === 'link') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-green-400/8 to-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400/5 to-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Link Account Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Link Your Account</h1>
                <p className="text-gray-300">Connect your bank account securely</p>
              </div>

              <form onSubmit={handleLinkAccount} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={accountDetails.accountNumber}
                      onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400 text-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={accountDetails.ifscCode}
                      onChange={(e) => setAccountDetails({...accountDetails, ifscCode: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400 text-white"
                    />
                  </div>

                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      value={accountDetails.name}
                      onChange={(e) => setAccountDetails({...accountDetails, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg shadow-green-500/25"
                >
                  Link Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Your account details are encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Balance</p>
                  <p className="text-2xl font-bold text-white">₹12,450</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-green-400">+₹6,200</p>
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
                  <p className="text-2xl font-bold text-white">156</p>
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-gray-700/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === 'income' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-gray-100 transition-colors">
                            {transaction.category}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{transaction.time}</span>
                            <span>•</span>
                            <span>{transaction.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === 'income' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
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

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentStep('login')}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl shadow-red-500/25"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
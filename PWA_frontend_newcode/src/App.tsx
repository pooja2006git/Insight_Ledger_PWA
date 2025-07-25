import React, { useState, useEffect } from 'react';
import { User, Lock, Fingerprint, Brain, Wifi, WifiOff, Clock, CreditCard, DollarSign, ShoppingCart, GraduationCap, Home, Car, Shield, Building2, Hash, UserCheck } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { openDB } from 'idb';
import ToggleOfflineButton from './ToggleOfflineButton';

// AES key (should match backend, do not change)
const AES_KEY = 'YOUR_AES_KEY_HERE'; // <-- Replace with your actual key if needed

interface Transaction {
  id: string;
  amount: number;
  category: string;
  time: string;
  type: 'income' | 'expense';
  icon: React.ReactNode;
}

// Helper: IndexedDB setup
const getDB = async () => {
  return openDB('transactions-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }
    },
  });
};

// Helper: Save transactions to IndexedDB
const saveTransactionsToDB = async (transactions: any[]) => {
  const db = await getDB();
  const tx = db.transaction('transactions', 'readwrite');
  const store = tx.objectStore('transactions');
  await store.clear();
  for (const txn of transactions) {
    await store.put(txn);
  }
  await tx.done;
};

// Helper: Load transactions from IndexedDB
const loadTransactionsFromDB = async () => {
  const db = await getDB();
  const tx = db.transaction('transactions', 'readonly');
  const store = tx.objectStore('transactions');
  return await store.getAll();
};

function App() {
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'link' | 'dashboard'>('splash');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [accountDetails, setAccountDetails] = useState({ 
    accountNumber: '', 
    ifscCode: '', 
    name: '' 
  });
  const [token, setToken] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Monitor online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Splash auto-transition
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setCurrentStep('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Fetch transactions after linking account
  useEffect(() => {
    if (currentStep === 'dashboard') {
      fetchAndCacheTransactions();
    }
    // eslint-disable-next-line
  }, [currentStep, token]);

  // Login handler
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const res = await fetch('/api/auth/login/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(credentials),
  //     });
  //     if (!res.ok) throw new Error('Invalid credentials');
  //     const data = await res.json();
  //     setToken(data.token);
  //     setCurrentStep('link');
  //   } catch (err: any) {
  //     setError(err.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (credentials.password.trim() === "") {
      setError("Password cannot be empty.");
      return;
    }
  
    setLoading(true);
  
    // Simulate dummy login
    setTimeout(() => {
      setToken('dummy-token');
      setCurrentStep('link');
      setLoading(false);
    }, 1000);
  };
  
  

  // Biometric login (simulate success)
  const handleBiometricLogin = () => {
    setCurrentStep('link');
  };

  // Link account handler
  // const handleLinkAccount = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (accountDetails.accountNumber && accountDetails.ifscCode && accountDetails.name) {
  //     setCurrentStep('dashboard');
  //   }
  // };
  const handleLinkAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    const accountNumberRegex = /^\d+$/;
    const ifscRegex = /^[A-Z0-9]+$/;
    const nameRegex = /^[A-Za-z ]+$/;
  
    if (!accountNumberRegex.test(accountDetails.accountNumber)) {
      setError("Account number must contain only digits.");
      return;
    }
  
    if (!ifscRegex.test(accountDetails.ifscCode)) {
      setError("IFSC Code must contain only uppercase letters and numbers.");
      return;
    }
  
    if (!nameRegex.test(accountDetails.name)) {
      setError("Account holder name should only contain letters and spaces.");
      return;
    }
  
    setCurrentStep('dashboard');
  };
  
  
  
  const fetchAndCacheTransactions = async () => {
    setLoading(true);
    setError(null);
  
    // Always show dummy data when offline or token is missing
    if (isOffline || !token) {
      const dummyTransactions: Transaction[] = [
        {
          id: 'TXN001',
          amount: 1200,
          category: 'Salary',
          time: '2024-09-01 09:30',
          type: 'income',
          icon: getIconForCategory('Salary'),
        },
        {
          id: 'TXN002',
          amount: 300,
          category: 'Grocery',
          time: '2024-09-02 14:20',
          type: 'expense',
          icon: getIconForCategory('Grocery'),
        },
        {
          id: 'TXN003',
          amount: 5000,
          category: 'Freelance',
          time: '2024-09-03 11:10',
          type: 'income',
          icon: getIconForCategory('Freelance'),
        },
        {
          id: 'TXN004',
          amount: 1200,
          category: 'School Fees',
          time: '2024-09-04 08:45',
          type: 'expense',
          icon: getIconForCategory('School Fees'),
        },
        {
          id: 'TXN005',
          amount: 450,
          category: 'Utilities',
          time: '2024-09-05 17:00',
          type: 'expense',
          icon: getIconForCategory('Utilities'),
        },
        {
          id: 'TXN006',
          amount: 800,
          category: 'Transportation',
          time: '2024-09-06 19:30',
          type: 'expense',
          icon: getIconForCategory('Transportation'),
        },
      ];
  
      setTransactions(dummyTransactions);
      console.log("Dummy Transactions Set:", dummyTransactions);
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch('/api/transactions/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch transactions');
  
      const data = await res.json();
  
      const decrypted: Transaction[] = data.map((txn: any) => {
        const decryptedData = JSON.parse(
          CryptoJS.AES.decrypt(txn.encrypted, AES_KEY).toString(CryptoJS.enc.Utf8)
        );
        return {
          ...decryptedData,
          icon: getIconForCategory(decryptedData.category),
        };
      });
  
      setTransactions(decrypted);
      await saveTransactionsToDB(decrypted);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      const cached = await loadTransactionsFromDB();
      setTransactions(cached as Transaction[]);
    } finally {
      setLoading(false);
    }
  };
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Salary': return <DollarSign className="w-5 h-5" />;
      case 'Grocery': return <ShoppingCart className="w-5 h-5" />;
      case 'School Fees': return <GraduationCap className="w-5 h-5" />;
      case 'Utilities': return <Home className="w-5 h-5" />;
      case 'Transportation': return <Car className="w-5 h-5" />;
      case 'Freelance': return <CreditCard className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };
  // Splash Screen
  if (currentStep === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-violet-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Splash Content */}
        <div className="relative z-10 text-center animate-fade-in-zoom">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/25 animate-bounce">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 animate-slide-up">
            Insight Ledger
          </h1>
          <p className="text-2xl text-slate-300 animate-slide-up delay-300">
            A Smarter E-Passbook
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-violet-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* 3D Earth Animation */}
        <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-64 h-64">
            {/* Earth Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-violet-400/30 rounded-full blur-xl animate-pulse"></div>
            
            {/* Earth Body */}
            <div className="relative w-full h-full bg-gradient-to-br from-slate-700 via-blue-800 to-violet-800 rounded-full shadow-2xl animate-spin-slow overflow-hidden">
              {/* Continent Highlights */}
              <div className="absolute top-8 left-12 w-16 h-8 bg-gradient-to-r from-blue-400/40 to-violet-400/40 rounded-full blur-sm"></div>
              <div className="absolute top-20 right-8 w-12 h-12 bg-gradient-to-l from-violet-400/30 to-blue-400/30 rounded-full blur-sm"></div>
              <div className="absolute bottom-16 left-8 w-20 h-6 bg-gradient-to-r from-blue-400/35 to-violet-400/35 rounded-full blur-sm"></div>
              <div className="absolute bottom-8 right-16 w-8 h-8 bg-gradient-to-l from-violet-400/40 to-blue-400/40 rounded-full blur-sm"></div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent"></div>
                <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-violet-400 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-violet-400 to-transparent"></div>
              </div>
            </div>

            {/* Orbiting Security Shield */}
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md w-12 h-12"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Orbiting Elements */}
            <div className="absolute inset-0 animate-spin-slow-reverse">
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              </div>
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-500 shadow-lg shadow-violet-400/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Security Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300 shadow-lg shadow-blue-400/50"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-violet-400 rounded-full animate-bounce delay-700 shadow-lg shadow-violet-400/50"></div>
          <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-1000 shadow-lg shadow-indigo-400/50"></div>
        </div>

        {/* Login Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                {/* Secure Lock Animation */}
<div className="relative flex justify-center mb-6">
  <div className="relative">
    <div className="absolute inset-0 rounded-full bg-green-400/20 blur-md animate-ping"></div>
    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-green-400 animate-bounce-slow">
      <Lock className="w-6 h-6 text-white" />
    </div>
    <p className="text-green-300 text-sm text-center mt-2 animate-pulse">Secure</p>
  </div>
</div>

                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-300">Sign in to your secure account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400 text-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg shadow-blue-500/25"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {error && <div className="text-red-400 mt-4 text-center">{error}</div>}

              <div className="mt-8 text-center">
                <div className="text-slate-400 mb-4">Or continue with</div>
                <button
                  onClick={handleBiometricLogin}
                  className="mx-auto flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700/80 hover:bg-slate-600/80 rounded-xl transition-all duration-300 hover:scale-105 group border border-slate-600/50"
                >
                  <Fingerprint className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-slate-300 font-medium">Biometric Login</span>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-violet-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Link Account Form */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                {error && <div className="text-red-400 mt-4 text-center">{error}</div>}

                <h1 className="text-3xl font-bold text-white mb-2">Link Your Account</h1>
                <p className="text-slate-300">Connect your bank account securely</p>
              </div>

              <form onSubmit={handleLinkAccount} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={accountDetails.accountNumber}
                      onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400 text-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={accountDetails.ifscCode}
                      onChange={(e) => setAccountDetails({...accountDetails, ifscCode: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400 text-white"
                    />
                  </div>

                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      value={accountDetails.name}
                      onChange={(e) => setAccountDetails({...accountDetails, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg placeholder-slate-400 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg shadow-blue-500/25"
                >
                  Link Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Your account details are encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden">
      <ToggleOfflineButton isOffline={isOffline} setIsOffline={setIsOffline} />
      {/* <ToggleOfflineButton /> */}
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/15 to-violet-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Insight Ledger</h1>
                <p className="text-slate-300">A Smarter E-Passbook</p>
              </div>
            </div>
            
            <div className={`flex items-center space-x-2 ${isOffline ? 'bg-green-500/20' : 'bg-blue-500/20'} backdrop-blur-sm px-4 py-2 rounded-xl border ${isOffline ? 'border-green-500/30' : 'border-blue-500/30'}`}>
              <div className={`w-2 h-2 ${isOffline ? 'bg-green-400' : 'bg-blue-400'} rounded-full animate-pulse shadow-lg ${isOffline ? 'shadow-green-400/50' : 'shadow-blue-400/50'}`}></div>
              {isOffline ? <WifiOff className="w-4 h-4 text-green-400" /> : <Wifi className="w-4 h-4 text-blue-400" />}
              <span className={`${isOffline ? 'text-green-300' : 'text-blue-300'} font-medium`}>{isOffline ? 'Offline Mode: Active' : 'Online'}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Balance</p>
                  <p className="text-2xl font-bold text-white">₹12,450</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-green-400">+₹6,200</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-slate-700/50">
            {[
  {
    id: 'TXN001',
    amount: 1200,
    category: 'Salary',
    time: '2024-09-01 09:30',
    type: 'income',
    icon: getIconForCategory('Salary'),
  },
  {
    id: 'TXN002',
    amount: 300,
    category: 'Grocery',
    time: '2024-09-02 14:20',
    type: 'expense',
    icon: getIconForCategory('Grocery'),
  },
  {
    id: 'TXN003',
    amount: 5000,
    category: 'Freelance',
    time: '2024-09-03 11:10',
    type: 'income',
    icon: getIconForCategory('Freelance'),
  },
  {
    id: 'TXN004',
    amount: 1200,
    category: 'School Fees',
    time: '2024-09-04 08:45',
    type: 'expense',
    icon: getIconForCategory('School Fees'),
  },
  {
    id: 'TXN005',
    amount: 450,
    category: 'Utilities',
    time: '2024-09-05 17:00',
    type: 'expense',
    icon: getIconForCategory('Utilities'),
  },
].map((transaction) => (
  <div key={transaction.id} className="p-6 hover:bg-slate-700/30 transition-all duration-300 group">
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
          <p className="font-semibold text-white group-hover:text-slate-100 transition-colors">
            {transaction.category}
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
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
))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setCurrentStep('login');
                setToken(null);
                setTransactions([]);
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl shadow-red-500/25"
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
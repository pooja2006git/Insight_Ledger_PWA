/**
 * API Service for Backend Integration
 * Handles all HTTP requests to the Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface BackendTransaction {
  id: number;
  title: string;
  amount: number;
  transaction_type: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FrontendTransaction {
  id: string;
  amount: number;
  category: string;
  time: string;
  type: 'income' | 'expense';
  title: string;
  description: string;
  date: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_income: number;
  total_expenses: number;
  net_amount: number;
  transaction_types: Record<string, number>;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Get authentication headers
   */
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);//if token generated it is stored in the local storage
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Verify if the current token is valid
   */
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseURL}/accounts/verify-token/`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      if (response.ok) {
        return true;
      } else {
        // Token is invalid, clear it
        this.setToken(null);
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.setToken(null);
      return false;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle 401 Unauthorized - token is invalid
      if (response.status === 401) {
        this.setToken(null);
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Register a new user
   */
  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}/accounts/register/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, email, password }),
    });

    const data = await this.handleResponse<RegisterResponse>(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/accounts/login/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  /**
   * Logout (clear token)//token is being removed thus registering the user again will not work
   */
  logout() {
    this.setToken(null);
    localStorage.removeItem('user_data');
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    const response = await fetch(`${this.baseURL}/user/profile/`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Get all transactions
   */
  async getTransactions(): Promise<FrontendTransaction[]> {
    const response = await fetch(`${this.baseURL}/transactions/`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    const backendTransactions = await this.handleResponse<BackendTransaction[]>(response);
    return backendTransactions.map(this.mapBackendToFrontend);
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transaction: Partial<BackendTransaction>): Promise<FrontendTransaction> {
    const response = await fetch(`${this.baseURL}/transactions/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(transaction),
    });

    const backendTransaction = await this.handleResponse<BackendTransaction>(response);
    return this.mapBackendToFrontend(backendTransaction);
  }

  /**
   * Update a transaction
   */
  async updateTransaction(id: number, transaction: Partial<BackendTransaction>): Promise<FrontendTransaction> {
    const response = await fetch(`${this.baseURL}/transactions/${id}/`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(transaction),
    });

    const backendTransaction = await this.handleResponse<BackendTransaction>(response);
    return this.mapBackendToFrontend(backendTransaction);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/transactions/${id}/`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete transaction: ${response.statusText}`);
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<TransactionStats> {
    const response = await fetch(`${this.baseURL}/transactions/stats/`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<TransactionStats>(response);
  }

  /**
   * Generate sample transactions
   */
  async generateSampleTransactions(): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/transactions/generate-sample/`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Map backend transaction format to frontend format
   */
  private mapBackendToFrontend(backend: BackendTransaction): FrontendTransaction {
    const type: 'income' | 'expense' = backend.amount >= 0 ? 'income' : 'expense';
    // const time = this.formatRelativeTime(backend.date);
    const time = backend.date ? this.formatRelativeTime(backend.date) : "N/A";


    // Map transaction_type to category (capitalize first letter)
    const category = backend.transaction_type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: backend.id.toString(),
      amount: Math.abs(backend.amount),
      category,
      time,
      type,
      title: backend.title,
      description: backend.description,
      date: backend.date,
    };
  }

  /**
   * Format date as relative time (e.g., "2 hours ago")
   */
  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;


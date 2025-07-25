# PWA Backend - Django REST Framework

A Django backend with Django REST Framework to support your PWA frontend with user authentication, encrypted transaction data, and offline capabilities.

## Features

- ✅ User authentication with Django's default User model
- ✅ Token-based authentication
- ✅ AES-256 encrypted transaction data
- ✅ RESTful API endpoints
- ✅ SQLite database
- ✅ CORS support for frontend integration
- ✅ Sample transaction generation
- ✅ Transaction statistics

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Navigate to the backend directory
cd pwa_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run the Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register/
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### Login User
```
POST /api/auth/login/
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securepassword123"
}
```

### Transactions

#### Get All Transactions (Authenticated)
```
GET /api/transactions/
Authorization: Token your_token_here
```

#### Create Transaction (Authenticated)
```
POST /api/transactions/
Authorization: Token your_token_here
Content-Type: application/json

{
    "title": "Grocery Shopping",
    "amount": -75.50,
    "transaction_type": "grocery",
    "description": "Weekly groceries",
    "date": "2024-01-15"
}
```

#### Get Transaction Details (Authenticated)
```
GET /api/transactions/{id}/
Authorization: Token your_token_here
```

#### Update Transaction (Authenticated)
```
PUT /api/transactions/{id}/
Authorization: Token your_token_here
Content-Type: application/json

{
    "title": "Updated Grocery Shopping",
    "amount": -80.00,
    "transaction_type": "grocery",
    "description": "Updated description",
    "date": "2024-01-15"
}
```

#### Delete Transaction (Authenticated)
```
DELETE /api/transactions/{id}/
Authorization: Token your_token_here
```

### User Profile

#### Get User Profile (Authenticated)
```
GET /api/user/profile/
Authorization: Token your_token_here
```

### Data Generation

#### Generate Sample Transactions (Authenticated)
```
POST /api/transactions/generate-sample/
Authorization: Token your_token_here
```

#### Get Transaction Statistics (Authenticated)
```
GET /api/transactions/stats/
Authorization: Token your_token_here
```

## Frontend Integration Example

Here's how to integrate the backend with your PWA frontend:

### 1. Authentication Functions

```javascript
// auth.js
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('auth_token');
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                return data;
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('auth_token', data.token);
                return data;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }

    isAuthenticated() {
        return !!this.token;
    }
}
```

### 2. Transaction Service with IndexedDB

```javascript
// transactionService.js
class TransactionService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('auth_token');
        this.initIndexedDB();
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('PWAFinanceDB', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create transactions store
                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
                    transactionStore.createIndex('date', 'date', { unique: false });
                    transactionStore.createIndex('type', 'transaction_type', { unique: false });
                }
            };
        });
    }

    async fetchTransactions() {
        try {
            const response = await fetch(`${this.baseURL}/transactions/`, {
                headers: {
                    'Authorization': `Token ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const transactions = await response.json();
                await this.storeTransactions(transactions);
                return transactions;
            } else {
                throw new Error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Return cached data if available
            return await this.getCachedTransactions();
        }
    }

    async storeTransactions(transactions) {
        const transaction = this.db.transaction(['transactions'], 'readwrite');
        const store = transaction.objectStore('transactions');

        // Clear existing data
        await store.clear();

        // Store new data
        for (const transaction of transactions) {
            await store.add(transaction);
        }
    }

    async getCachedTransactions() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async createTransaction(transactionData) {
        try {
            const response = await fetch(`${this.baseURL}/transactions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                const newTransaction = await response.json();
                await this.addCachedTransaction(newTransaction);
                return newTransaction;
            } else {
                throw new Error('Failed to create transaction');
            }
        } catch (error) {
            console.error('Create transaction error:', error);
            throw error;
        }
    }

    async addCachedTransaction(transaction) {
        const transactionDB = this.db.transaction(['transactions'], 'readwrite');
        const store = transactionDB.objectStore('transactions');
        await store.add(transaction);
    }
}
```

### 3. Usage Example

```javascript
// main.js
const authService = new AuthService();
const transactionService = new TransactionService();

// Register a new user
async function registerUser() {
    try {
        const userData = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'securepassword123',
            password_confirm: 'securepassword123',
            first_name: 'John',
            last_name: 'Doe'
        };

        const result = await authService.register(userData);
        console.log('User registered:', result);
        
        // Load transactions after registration
        await loadTransactions();
    } catch (error) {
        console.error('Registration failed:', error);
    }
}

// Login user
async function loginUser() {
    try {
        const credentials = {
            username: 'john_doe',
            password: 'securepassword123'
        };

        const result = await authService.login(credentials);
        console.log('User logged in:', result);
        
        // Load transactions after login
        await loadTransactions();
    } catch (error) {
        console.error('Login failed:', error);
    }
}

// Load and display transactions
async function loadTransactions() {
    try {
        const transactions = await transactionService.fetchTransactions();
        displayTransactions(transactions);
    } catch (error) {
        console.error('Failed to load transactions:', error);
    }
}

// Display transactions in UI
function displayTransactions(transactions) {
    const container = document.getElementById('transactions-container');
    container.innerHTML = '';

    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <h3>${transaction.title}</h3>
            <p class="amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                $${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p class="type">${transaction.transaction_type}</p>
            <p class="date">${transaction.date}</p>
            <p class="description">${transaction.description}</p>
        `;
        container.appendChild(transactionElement);
    });
}

// Initialize app
async function initApp() {
    if (authService.isAuthenticated()) {
        await loadTransactions();
    } else {
        // Show login/register form
        showAuthForm();
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);
```

## Security Features

- **AES-256 Encryption**: All sensitive transaction data is encrypted at rest
- **Token Authentication**: Secure API access with Django REST Framework tokens
- **CORS Protection**: Configured to allow only trusted origins
- **Password Hashing**: Django's built-in password hashing

## Environment Variables

Create a `.env` file in the `pwa_backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ENCRYPTION_KEY=your-32-byte-encryption-key-here
```

## Production Deployment

For production deployment:

1. Set `DEBUG=False`
2. Use a strong `SECRET_KEY`
3. Use a strong `ENCRYPTION_KEY`
4. Configure proper `ALLOWED_HOSTS`
5. Use a production database (PostgreSQL recommended)
6. Set up proper CORS origins

## API Response Examples

### Successful Registration
```json
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "token": "your-auth-token-here",
    "message": "User registered successfully with sample transactions"
}
```

### Transaction List
```json
[
    {
        "id": 1,
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe"
        },
        "title": "Monthly Salary",
        "amount": "5000.00",
        "transaction_type": "salary",
        "description": "Monthly salary payment",
        "date": "2024-01-10",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
]
```

### Transaction Statistics
```json
{
    "total_transactions": 6,
    "total_income": 6200.00,
    "total_expenses": 318.24,
    "net_amount": 5881.76,
    "transaction_types": {
        "salary": 2,
        "grocery": 1,
        "fees": 1,
        "transport": 1,
        "entertainment": 1
    }
}
``` 
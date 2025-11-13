# Testing Guide - Backend-Frontend Integration

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd pwa_backend
python manage.py runserver
```
Backend runs on: `http://localhost:8000`

### 2. Start Frontend Server
```bash
cd PWA_frontend_newcode
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 🧪 Testing Scenarios

### Scenario 1: User Registration
**Backend API Test:**
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "your-token-here"
}
```

### Scenario 2: User Login
**Backend API Test:**
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "your-token-here"
}
```

**Frontend Test:**
1. Open `http://localhost:5173`
2. Enter email: `test@example.com`
3. Enter password: `TestPass123`
4. Click "Sign In"
5. Should proceed to "Link Account" screen
6. Check browser console for any errors
7. Check localStorage for `auth_token`

### Scenario 3: Get Transactions
**Backend API Test:**
```bash
curl -X GET http://localhost:8000/api/transactions/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Transaction Title",
    "amount": -75.50,
    "transaction_type": "grocery",
    "description": "Description",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Frontend Test:**
1. Login successfully
2. Complete "Link Account" step
3. Dashboard should load
4. Check if transactions are displayed
5. Check if stats cards show correct data
6. Check browser console for any errors

### Scenario 4: Generate Sample Transactions
**Backend API Test:**
```bash
curl -X POST http://localhost:8000/api/transactions/generate-sample/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "message": "Generated 10 sample transactions"
}
```

**Frontend Test:**
1. Login and go to dashboard
2. If no transactions, use API to generate sample data
3. Refresh dashboard
4. Transactions should appear

### Scenario 5: Get Transaction Statistics
**Backend API Test:**
```bash
curl -X GET http://localhost:8000/api/transactions/stats/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "total_transactions": 10,
  "total_income": 5000.00,
  "total_expenses": 1500.00,
  "net_amount": 3500.00,
  "transaction_types": {
    "salary": 1,
    "grocery": 3,
    "fees": 2
  }
}
```

**Frontend Test:**
1. Login and go to dashboard
2. Check stats cards:
   - Net Balance should match `net_amount`
   - Total Income should match `total_income`
   - Transactions count should match `total_transactions`

### Scenario 6: Create Transaction
**Backend API Test:**
```bash
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Transaction",
    "amount": -100.00,
    "transaction_type": "grocery",
    "description": "Test transaction",
    "date": "2024-01-20"
  }'
```

### Scenario 7: Error Handling
**Test Invalid Login:**
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid email or password"
}
```

**Frontend Test:**
1. Enter wrong email/password
2. Click "Sign In"
3. Error message should appear
4. Check browser console for error details

### Scenario 8: Token Authentication
**Test Without Token:**
```bash
curl -X GET http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Test With Invalid Token:**
```bash
curl -X GET http://localhost:8000/api/transactions/ \
  -H "Authorization: Token invalid-token" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "detail": "Invalid token."
}
```

## 🔍 Debugging Tips

### Check Backend Logs
```bash
# Backend server console will show all requests
python manage.py runserver
```

### Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for API errors
4. Check Network tab for API requests

### Check Token Storage
1. Open browser DevTools (F12)
2. Go to Application tab
3. Check Local Storage
4. Look for `auth_token` key

### Check CORS Issues
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for CORS errors in console
4. Check if requests are being blocked

### Common Issues

#### Issue: "Network Error" or "Failed to fetch"
- **Cause**: Backend server not running or CORS issue
- **Solution**: 
  1. Check if backend is running on `http://localhost:8000`
  2. Check CORS settings in `settings.py`
  3. Check browser console for CORS errors

#### Issue: "401 Unauthorized"
- **Cause**: Invalid or missing token
- **Solution**:
  1. Check if token is stored in localStorage
  2. Check if token is being sent in Authorization header
  3. Try logging in again to get a new token

#### Issue: "Invalid email or password"
- **Cause**: Wrong credentials or user doesn't exist
- **Solution**:
  1. Register a new user first
  2. Check if email and password are correct
  3. Check backend logs for authentication errors

#### Issue: No transactions showing
- **Cause**: No transactions in database or API error
- **Solution**:
  1. Generate sample transactions via API
  2. Check browser console for errors
  3. Check Network tab for API response
  4. Verify token is valid

## ✅ Verification Checklist

### Backend
- [ ] Server starts without errors
- [ ] All migrations applied
- [ ] CORS configured correctly
- [ ] Token authentication working
- [ ] All endpoints accessible

### Frontend
- [ ] Server starts without errors
- [ ] No console errors on load
- [ ] Login form displays correctly
- [ ] API service imports correctly
- [ ] Token storage works

### Integration
- [ ] Login calls backend API
- [ ] Token received and stored
- [ ] Transactions load from backend
- [ ] Stats show real data
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Logout clears token

## 📝 Test Results Template

```
Date: _______________
Tester: _______________

Backend Status: [ ] Running [ ] Not Running
Frontend Status: [ ] Running [ ] Not Running

Registration: [ ] Pass [ ] Fail
Login: [ ] Pass [ ] Fail
Transactions Load: [ ] Pass [ ] Fail
Stats Display: [ ] Pass [ ] Fail
Error Handling: [ ] Pass [ ] Fail
Token Storage: [ ] Pass [ ] Fail
Logout: [ ] Pass [ ] Fail

Issues Found:
1. 
2. 
3. 

Notes:


```

## 🎯 Success Criteria

Integration is successful when:
1. ✅ User can register via API
2. ✅ User can login via frontend
3. ✅ Token is stored and sent with requests
4. ✅ Transactions load on dashboard
5. ✅ Stats show correct data
6. ✅ Error messages display properly
7. ✅ Logout clears token and redirects to login


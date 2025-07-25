# Quick Start Guide - PWA Backend

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Step 1: Navigate to Backend Directory
```bash
cd pwa_backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Start the Server
```bash
python manage.py runserver
```

🎉 **Your backend is now running at http://localhost:8000**

## 📋 What's Available

### API Endpoints
- **Admin Panel**: http://localhost:8000/admin/
- **API Root**: http://localhost:8000/api/
- **Authentication**: http://localhost:8000/api/auth/
- **Transactions**: http://localhost:8000/api/transactions/

### Test the API

1. **Register a user**:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

3. **Get transactions** (replace YOUR_TOKEN with the token from login):
```bash
curl -X GET http://localhost:8000/api/transactions/ \
  -H "Authorization: Token YOUR_TOKEN"
```

## 🔧 Frontend Integration

1. Open `frontend_integration_example.html` in your browser
2. Register a new user or login
3. Generate sample data to see transactions
4. Test offline functionality by disconnecting internet

## 📁 Project Structure

```
pwa_backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── README.md               # Detailed documentation
├── QUICK_START.md          # This file
├── setup.py                # Automated setup script
├── frontend_integration_example.html  # Complete frontend example
├── pwa_backend/            # Main Django project
│   ├── settings.py         # Django settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
└── transactions/           # Transactions app
    ├── models.py          # Database models
    ├── views.py           # API views
    ├── serializers.py     # Data serialization
    ├── urls.py           # App URL patterns
    └── utils.py          # Encryption utilities
```

## 🔐 Security Features

- **AES-256 Encryption**: Transaction data is encrypted at rest
- **Token Authentication**: Secure API access
- **CORS Protection**: Configured for your frontend domains
- **Password Hashing**: Django's built-in security

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   python manage.py runserver 8001
   ```

2. **Database errors**:
   ```bash
   python manage.py migrate --run-syncdb
   ```

3. **Import errors**:
   ```bash
   pip install -r requirements.txt --force-reinstall
   ```

4. **CORS errors**: Check that your frontend domain is in `CORS_ALLOWED_ORIGINS` in settings.py

### Environment Variables

Create a `.env` file in the `pwa_backend` directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ENCRYPTION_KEY=your-32-byte-encryption-key-here
```

## 📚 Next Steps

1. **Read the full documentation**: Check `README.md` for detailed API documentation
2. **Integrate with your frontend**: Use the example code in `frontend_integration_example.html`
3. **Customize the API**: Modify models, views, and serializers as needed
4. **Deploy to production**: Update settings for production environment

## 🆘 Need Help?

- Check the full `README.md` for detailed documentation
- Review the example frontend integration code
- Test the API endpoints using curl or Postman
- Check Django logs for error messages

## 🎯 API Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Register new user |
| `/api/auth/login/` | POST | Login user |
| `/api/transactions/` | GET | Get user transactions |
| `/api/transactions/` | POST | Create transaction |
| `/api/transactions/{id}/` | GET/PUT/DELETE | Manage specific transaction |
| `/api/transactions/stats/` | GET | Get transaction statistics |
| `/api/transactions/generate-sample/` | POST | Generate sample data |

All endpoints except register/login require authentication via `Authorization: Token YOUR_TOKEN` header. 
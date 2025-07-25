import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.conf import settings




def get_encryption_key():
    """Get or generate encryption key"""
    key = settings.ENCRYPTION_KEY
    if len(key) < 32:
        # Pad the key to 32 bytes
        key = key.ljust(32, '0')
    elif len(key) > 32:
        # Truncate the key to 32 bytes
        key = key[:32]
    
    # Convert to bytes and generate Fernet key
    key_bytes = key.encode()
    salt = b'pwa_backend_salt'  # Fixed salt for consistency
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    fernet_key = base64.urlsafe_b64encode(kdf.derive(key_bytes))
    return fernet_key


def encrypt_data(data):
    """Encrypt data using AES-256"""
    if not data:
        return data
    
    try:
        fernet = Fernet(get_encryption_key())
        encrypted_data = fernet.encrypt(data.encode())
        return encrypted_data.decode()
    except Exception as e:
        print(f"Encryption error: {e}")
        return data


def decrypt_data(encrypted_data):
    """Decrypt data using AES-256"""
    if not encrypted_data:
        return encrypted_data
    
    try:
        fernet = Fernet(get_encryption_key())
        decrypted_data = fernet.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
    except Exception as e:
        print(f"Decryption error: {e}")
        return encrypted_data


def generate_sample_transactions(user):
    from .models import Transaction
    """Generate sample transactions for a user"""
    from datetime import date, timedelta
    import random
    
    sample_transactions = [
        {
            'title': 'Monthly Salary',
            'amount': 5000.00,
            'transaction_type': 'salary',
            'description': 'Monthly salary payment',
            'date': date.today() - timedelta(days=5),
        },
        {
            'title': 'Grocery Shopping',
            'amount': -150.75,
            'transaction_type': 'grocery',
            'description': 'Weekly grocery shopping at Walmart',
            'date': date.today() - timedelta(days=3),
        },
        {
            'title': 'Internet Bill',
            'amount': -89.99,
            'transaction_type': 'fees',
            'description': 'Monthly internet service bill',
            'date': date.today() - timedelta(days=10),
        },
        {
            'title': 'Gas Station',
            'amount': -45.50,
            'transaction_type': 'transport',
            'description': 'Fuel for car',
            'date': date.today() - timedelta(days=2),
        },
        {
            'title': 'Movie Tickets',
            'amount': -32.00,
            'transaction_type': 'entertainment',
            'description': 'Weekend movie with friends',
            'date': date.today() - timedelta(days=1),
        },
        {
            'title': 'Freelance Project',
            'amount': 1200.00,
            'transaction_type': 'salary',
            'description': 'Payment for web development project',
            'date': date.today() - timedelta(days=7),
        },
    ]
    
    transactions = []
    for transaction_data in sample_transactions:
        transaction = Transaction(
            user=user,
            **transaction_data
        )
        transactions.append(transaction)
    
    return transactions 
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from .utils import encrypt_data, decrypt_data

from django.db import models


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('salary', 'Salary'),
        ('grocery', 'Grocery'),
        ('fees', 'Fees'),
        ('entertainment', 'Entertainment'),
        ('transport', 'Transport'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Encrypted fields
    _encrypted_title = models.TextField(blank=True, null=True)
    _encrypted_description = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def save(self, *args, **kwargs):
        # Encrypt sensitive data before saving
        if self.title:
            self._encrypted_title = encrypt_data(self.title)
        if self.description:
            self._encrypted_description = encrypt_data(self.description)
        super().save(*args, **kwargs)
    
    @property
    def decrypted_title(self):
        """Return decrypted title"""
        if self._encrypted_title:
            return decrypt_data(self._encrypted_title)
        return self.title
    
    @property
    def decrypted_description(self):
        """Return decrypted description"""
        if self._encrypted_description:
            return decrypt_data(self._encrypted_description)
        return self.description
    
    def __str__(self):
        return f"{self.user.username} - {self.title} - ${self.amount}" 



class BankAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=15)
    password = models.CharField(max_length=50, blank=True)  # Not storing bank password for security

    def __str__(self):
        return f"{self.name} - {self.account_number}"

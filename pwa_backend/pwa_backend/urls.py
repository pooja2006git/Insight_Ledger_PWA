"""
URL configuration for pwa_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from transactions.views import register_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', obtain_auth_token, name='api_token_auth'),
    path('api/auth/register/', register_user, name='register_user'),
    path('api/', include('transactions.urls')),
    path('api/accounts/', include('accounts.urls')),
] 
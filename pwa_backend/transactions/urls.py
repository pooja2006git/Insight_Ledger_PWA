from django.urls import path
from . import views

urlpatterns = [
    # Transaction endpoints
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.TransactionDetailView.as_view(), name='transaction-detail'),
    
    # User endpoints
    path('user/profile/', views.user_profile, name='user-profile'),
    
    # Data generation
    path('transactions/generate-sample/', views.generate_sample_data, name='generate-sample-data'),
    path('transactions/stats/', views.transaction_stats, name='transaction-stats'),
] 
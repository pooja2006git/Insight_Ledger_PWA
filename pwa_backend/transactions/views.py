from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Transaction
from .serializers import TransactionSerializer, RegisterUserSerializer, UserSerializer
from .utils import generate_sample_transactions


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user with bank account details"""
    serializer = RegisterUserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        # Generate JWT token for the newly registered user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Generate sample transactions for the new user
        sample_transactions = generate_sample_transactions(user)
        Transaction.objects.bulk_create(sample_transactions)
        
        # Return response in the exact format requested
        return Response({
            'user': {
                'name': user.first_name or user.username,
                'email': user.email
            },
            'token': access_token,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    
    # Handle validation errors
    errors = serializer.errors
    
    # Check for password mismatch error in non_field_errors
    if 'non_field_errors' in errors:
        error_messages = errors['non_field_errors']
        if isinstance(error_messages, list):
            for error in error_messages:
                if 'Passwords do not match' in str(error) or 'password' in str(error).lower():
                    return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        elif 'Passwords do not match' in str(error_messages):
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Return other validation errors
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionListCreateView(generics.ListCreateAPIView):
    """List and create transactions for the authenticated user"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a transaction"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_sample_data(request):
    """Generate sample transactions for the current user"""
    user = request.user
    
    # Check if user already has transactions
    if Transaction.objects.filter(user=user).exists():
        return Response({
            'message': 'User already has transactions. Sample data not generated.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate and save sample transactions
    sample_transactions = generate_sample_transactions(user)
    Transaction.objects.bulk_create(sample_transactions)
    
    return Response({
        'message': f'Generated {len(sample_transactions)} sample transactions'
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_stats(request):
    """Get transaction statistics for the user"""
    user = request.user
    transactions = Transaction.objects.filter(user=user)
    
    total_income = sum(t.amount for t in transactions if t.amount > 0)
    total_expenses = sum(abs(t.amount) for t in transactions if t.amount < 0)
    net_amount = total_income - total_expenses
    
    stats = {
        'total_transactions': transactions.count(),
        'total_income': float(total_income),
        'total_expenses': float(total_expenses),
        'net_amount': float(net_amount),
        'transaction_types': {}
    }
    
    # Count by transaction type
    for transaction_type, _ in Transaction.TRANSACTION_TYPES:
        count = transactions.filter(transaction_type=transaction_type).count()
        if count > 0:
            stats['transaction_types'][transaction_type] = count
    
    return Response(stats) 
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Transaction
from .serializers import TransactionSerializer, RegisterUserSerializer, UserSerializer
from .utils import generate_sample_transactions


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Generate sample transactions for the new user
        sample_transactions = generate_sample_transactions(user)
        Transaction.objects.bulk_create(sample_transactions)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully with sample transactions'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
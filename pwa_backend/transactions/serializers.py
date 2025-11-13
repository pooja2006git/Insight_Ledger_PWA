from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    decrypted_title = serializers.CharField(read_only=True)
    decrypted_description = serializers.CharField(read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'title', 'amount', 'transaction_type', 
            'description', 'date', 'created_at', 'updated_at',
            'decrypted_title', 'decrypted_description'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Override to use decrypted data in API responses"""
        data = super().to_representation(instance)
        data['title'] = instance.decrypted_title
        data['description'] = instance.decrypted_description
        return data


class RegisterUserSerializer(serializers.Serializer):
    """Serializer for user registration with bank account details"""
    name = serializers.CharField(required=True, max_length=100, help_text="Full name of the user")
    email = serializers.EmailField(required=True, help_text="Email address (must be unique)")
    password = serializers.CharField(required=True, write_only=True, min_length=8, help_text="Password (minimum 8 characters)")
    confirm_password = serializers.CharField(required=True, write_only=True, help_text="Password confirmation")
    account_number = serializers.CharField(required=True, max_length=20, help_text="Bank account number")
    ifsc_code = serializers.CharField(required=True, max_length=15, help_text="IFSC code")
    
    def validate_email(self, value):
        """Validate that email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_password(self, value):
        """Validate password meets minimum length requirement"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
    def validate(self, data):
        """Validate that passwords match"""
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        if password and confirm_password:
            if password != confirm_password:
                raise serializers.ValidationError("Passwords do not match")
        
        return data
    
    def create(self, validated_data):
        """Create user and bank account"""
        name = validated_data.pop('name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        confirm_password = validated_data.pop('confirm_password')  # Already validated
        account_number = validated_data.pop('account_number')
        ifsc_code = validated_data.pop('ifsc_code')
        
        # Generate username from email (take part before @)
        username_base = email.split('@')[0]
        username = username_base
        counter = 1
        
        # Ensure username is unique
        while User.objects.filter(username=username).exists():
            username = f"{username_base}_{counter}"
            counter += 1
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name
        )
        
        # Create bank account linked to user
        from .models import BankAccount
        BankAccount.objects.create(
            user=user,
            name=name,
            email=email,
            account_number=account_number,
            ifsc_code=ifsc_code,
            password=''  # Bank account password not stored for security
        )
        
        return user

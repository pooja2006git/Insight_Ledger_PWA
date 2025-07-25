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


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    # def create(self, validated_data):
    #     validated_data.pop('password_confirm')
    #     user = User.objects.create_user(**validated_data)
    #     return user 
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        username = validated_data.pop('username')
        
        user = User.objects.create_user(username=username, password=password)
        
        # Optional fields (only if provided)
        user.email = validated_data.get('email', '')
        user.first_name = validated_data.get('first_name', '')
        user.last_name = validated_data.get('last_name', '')
        
        user.save()
        return user

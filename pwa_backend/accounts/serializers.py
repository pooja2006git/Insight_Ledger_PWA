from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.validators import EmailValidator

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[EmailValidator()])
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        """Validate email format"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        """Validate password meets minimum length requirement"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

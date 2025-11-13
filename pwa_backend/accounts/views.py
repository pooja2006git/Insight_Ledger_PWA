from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate JWT token for the newly registered user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                "message": "User registered successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                },
                "token": access_token
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

            user_auth = authenticate(username=user.username, password=password)
            if user_auth is not None:
                # Generate JWT token for the logged-in user
                refresh = RefreshToken.for_user(user_auth)
                access_token = str(refresh.access_token)
                
                return Response({
                    "message": "Login successful",
                    "user": {
                        "id": user_auth.id,
                        "username": user_auth.username,
                        "email": user_auth.email
                    },
                    "token": access_token
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyTokenView(APIView):
    """Verify if a JWT token is valid"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            "valid": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email
            }
        }, status=status.HTTP_200_OK)

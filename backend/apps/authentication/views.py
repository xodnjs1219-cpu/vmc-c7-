"""
Views for authentication.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .serializers import LoginSerializer, LoginResponseSerializer
from .services import AuthService


class LoginView(APIView):
    """
    POST /api/auth/login/

    User login API - generates JWT tokens
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """Login with username and password."""
        # 1. Validate input
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. Call service layer
        service = AuthService()
        result = service.login(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
        )

        # 3. Return response
        response_serializer = LoginResponseSerializer(result)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

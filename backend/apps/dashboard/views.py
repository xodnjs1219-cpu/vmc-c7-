"""
Views for dashboard.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class KPIView(APIView):
    """KPI data view."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get KPI data."""
        return Response({'message': 'KPI endpoint'}, status=status.HTTP_200_OK)


class PublicationsView(APIView):
    """Publications data view."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get publications data."""
        return Response({'message': 'Publications endpoint'}, status=status.HTTP_200_OK)


class ResearchView(APIView):
    """Research data view."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get research data."""
        return Response({'message': 'Research endpoint'}, status=status.HTTP_200_OK)


class StudentsView(APIView):
    """Students data view."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get students data."""
        return Response({'message': 'Students endpoint'}, status=status.HTTP_200_OK)

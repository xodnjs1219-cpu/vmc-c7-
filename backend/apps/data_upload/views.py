"""
Views for data upload.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class DataUploadListView(APIView):
    """View for listing upload logs."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get upload logs."""
        return Response({'message': 'Upload logs endpoint'}, status=status.HTTP_200_OK)

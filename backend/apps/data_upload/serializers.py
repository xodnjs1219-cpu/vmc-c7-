"""
Serializers for data upload.
"""
from rest_framework import serializers


class DataUploadLogSerializer(serializers.Serializer):
    """Data upload log serializer."""

    id = serializers.IntegerField()
    filename = serializers.CharField(max_length=255)
    file_size = serializers.IntegerField(required=False, allow_null=True)
    status = serializers.CharField(max_length=20)
    error_message = serializers.CharField(required=False, allow_null=True)
    total_records = serializers.IntegerField(required=False, allow_null=True)
    processed_records = serializers.IntegerField(required=False, allow_null=True)
    uploaded_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

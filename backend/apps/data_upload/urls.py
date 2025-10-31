"""
URL routing for data upload.
"""
from django.urls import path
from .views import DataUploadListView

app_name = 'data_upload'

urlpatterns = [
    path('logs/', DataUploadListView.as_view(), name='logs'),
]

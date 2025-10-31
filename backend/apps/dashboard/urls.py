"""
URL routing for dashboard.
"""
from django.urls import path
from .views import KPIView, PublicationsView, ResearchView, StudentsView

app_name = 'dashboard'

urlpatterns = [
    path('kpi/', KPIView.as_view(), name='kpi'),
    path('publications/', PublicationsView.as_view(), name='publications'),
    path('research/', ResearchView.as_view(), name='research'),
    path('students/', StudentsView.as_view(), name='students'),
]

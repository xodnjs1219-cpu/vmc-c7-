from .base import *

# Development settings
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'localhost:8000']

# CORS for development
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
]

# Database - using Supabase PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'vmc'),
        'USER': os.environ.get('DB_USER', 'vmcuser'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'vmcpass'),
    # 도커에서 환경변수 미설정 시 db, 로컬은 반드시 환경변수로 localhost 지정
    'HOST': os.environ.get('DB_HOST', 'db'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Email Backend for Development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# REST Framework for Development
REST_FRAMEWORK.update({
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
})

# Logging for Development
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['root']['level'] = 'DEBUG'

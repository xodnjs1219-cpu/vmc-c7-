"""
User model for authentication.
"""
from django.db import models
from django.contrib.auth.hashers import make_password


class User(models.Model):
    """Custom User model."""

    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('user', 'Regular User'),
    ]

    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True, db_index=True)
    password_hash = models.CharField(max_length=255)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        managed = False

    def __str__(self):
        return f"{self.username} ({self.full_name})"

    def set_password(self, raw_password: str) -> None:
        """Hash and set password."""
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Check if raw password matches hashed password."""
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password_hash)

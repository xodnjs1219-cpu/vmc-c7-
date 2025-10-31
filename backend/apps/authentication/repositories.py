"""
Repository layer for authentication.
"""
from typing import Optional
from .models import User


class UserRepository:
    """Repository for User model."""

    @staticmethod
    def get_by_username(username: str) -> Optional[User]:
        """Get user by username."""
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        """Get user by id."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @staticmethod
    def create(username: str, password: str, full_name: str = '', role: str = 'user') -> User:
        """Create a new user."""
        user = User(username=username, full_name=full_name, role=role)
        user.set_password(password)
        user.save()
        return user

    @staticmethod
    def update(user: User, **kwargs) -> User:
        """Update user."""
        for key, value in kwargs.items():
            if key == 'password':
                user.set_password(value)
            else:
                setattr(user, key, value)
        user.save()
        return user

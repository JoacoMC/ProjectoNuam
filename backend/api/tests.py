from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile

class UserRoleTestCase(TestCase):
    def test_default_role_is_cliente(self):
        """Verifica que un usuario creado sin especificar rol sea 'cliente'."""
        user = User.objects.create_user(username='testuser1', password='password123')
        self.assertEqual(user.profile.role, 'cliente')

    def test_admin_role_creation(self):
        """Verifica que se pueda crear un usuario con rol 'admin'."""
        user = User.objects.create_user(username='adminuser', password='password123')
        Profile.objects.filter(user=user).update(role='admin')
        user.refresh_from_db()
        self.assertEqual(user.profile.role, 'admin')

    def test_corredor_role_creation(self):
        """Verifica que se pueda crear un usuario con rol 'corredor_tributario'."""
        user = User.objects.create_user(username='corredor', password='password123')
        Profile.objects.filter(user=user).update(role='corredor_tributario')
        user.refresh_from_db()
        self.assertEqual(user.profile.role, 'corredor_tributario')
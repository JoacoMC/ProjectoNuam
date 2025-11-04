# api/permissions.py

from rest_framework import permissions
from django.contrib.auth.models import User
from .models import Cliente, CorredorTributario, Administrador


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return Administrador.objects.filter(user=request.user).exists()


class IsCorredorTributarioUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return CorredorTributario.objects.filter(user=request.user).exists()


class IsClienteUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return Cliente.objects.filter(user=request.user).exists()


class IsAdminOrCorredor(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        is_admin = Administrador.objects.filter(user=request.user).exists()
        is_corredor = CorredorTributario.objects.filter(user=request.user).exists()
        
        return is_admin or is_corredor
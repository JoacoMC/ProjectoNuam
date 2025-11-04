from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Cliente, CorredorTributario, Administrador, 
    Sistema, DocumentoTributario, Alerta, Reporte, CalificacionTributaria
)

ROLE_CHOICES = (
    ('cliente', 'Cliente'),
    ('admin', 'Administrador'),
    ('corredor_tributario', 'Corredor Tributario'),
)


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=ROLE_CHOICES, 
        write_only=True, 
        required=False, 
        default='cliente'
    )

    class Meta:
        model = User
        fields = ["id", "username", "password", "role"]
        extra_kwargs = {
            "password": {"write_only": True},
            "role": {"write_only": True}
        }

    def create(self, validated_data):
        role_data = validated_data.pop('role', 'cliente') 
        user = User.objects.create_user(**validated_data)
        
        # Lógica de creación del objeto de rol
        if role_data == 'cliente':
            Cliente.objects.create(user=user)
        elif role_data == 'admin':
            Administrador.objects.create(user=user)
        elif role_data == 'corredor_tributario':
            CorredorTributario.objects.create(user=user)
        
        return user


class SistemaSerializer(serializers.ModelSerializer):
    usuarios = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Sistema
        fields = ["id", "usuarios", "logs"] 


class DocumentoTributarioSerializer(serializers.ModelSerializer):
    sistema = serializers.PrimaryKeyRelatedField(queryset=Sistema.objects.all(), required=False)
    
    class Meta:
        model = DocumentoTributario
        fields = [
            "id", "sistema", "fecha", "tipo", 
            "usuario_subida", "archivo", "nombre_archivo"
        ]
        read_only_fields = [
            "sistema", "fecha", "tipo", 
            "usuario_subida", "nombre_archivo"
        ]


class AlertaSerializer(serializers.ModelSerializer):
    sistema = serializers.PrimaryKeyRelatedField(queryset=Sistema.objects.all())

    class Meta:
        model = Alerta
        fields = ["id", "sistema", "fecha", "comentario", "usuario_destino", "leido"]


class ReporteSerializer(serializers.ModelSerializer):
    sistema = serializers.PrimaryKeyRelatedField(queryset=Sistema.objects.all())

    class Meta:
        model = Reporte
        fields = ["id", "sistema", "fecha", "tipo", "comentario"]


class UserRoleSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "role"]

    def get_role(self, obj):
        if Administrador.objects.filter(user=obj).exists():
            return 'admin'
        elif CorredorTributario.objects.filter(user=obj).exists():
            return 'corredor_tributario'
        elif Cliente.objects.filter(user=obj).exists():
            return 'cliente'
        return None
    
class ClientListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Cliente
        fields = ["user_id", "username"]

class CalificacionTributariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionTributaria
        fields = [
            'id', 'sistema', 'creado_por', 'mercado', 'descripcion', 'fecha',
            'secuencia_evento', 'valor_historico', 'año', 'instrumento', 
            'factor', 'fecha_creacion',
            'factores'
        ]
        read_only_fields = ['sistema', 'creado_por']

class CalificacionListSerializer(serializers.ModelSerializer):
    """
    Serializador simple para la lista de selección (dropdown).
    """
    class Meta:
        model = CalificacionTributaria
        fields = ['id', 'descripcion', 'fecha', 'mercado']
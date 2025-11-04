from django.shortcuts import render
from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import (
    UserSerializer, SistemaSerializer, UserRoleSerializer,
    DocumentoTributarioSerializer, AlertaSerializer, ReporteSerializer,
    ClientListSerializer, CalificacionTributaria, CalificacionTributariaSerializer,
    CalificacionListSerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Sistema, DocumentoTributario, Alerta, Reporte
from .models import Administrador, CorredorTributario, Cliente
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from .permissions import (
    IsAdminUser, 
    IsCorredorTributarioUser, 
    IsClienteUser, 
    IsAdminOrCorredor
)

class CreateUserView(generics.CreateAPIView):
    """
    Vista para registrar un nuevo usuario. 
    Permite a cualquiera (AllowAny) crear un usuario.
    El serializador (UserSerializer) maneja la creación del rol.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class SistemaListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear un Sistema.
    Solo Admins o Corredores pueden crear o ver la lista de todos los sistemas.
    """
    queryset = Sistema.objects.all()
    serializer_class = SistemaSerializer
    permission_classes = [IsAdminOrCorredor]


class SistemaDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para ver, actualizar o eliminar un Sistema.
    Solo Admins o Corredores.
    """
    queryset = Sistema.objects.all()
    serializer_class = SistemaSerializer
    permission_classes = [IsAdminOrCorredor]


class DocumentoTributarioListCreate(generics.ListCreateAPIView):
    """
    Vista modificada para subida de archivos por rol.
    - Cliente: Sube un solo archivo.
    - Admin/Corredor: Sube múltiples archivos para un cliente.
    """
    serializer_class = DocumentoTributarioSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if IsAdminOrCorredor().has_permission(self.request, self):
            return DocumentoTributario.objects.all().order_by('-fecha')
        if IsClienteUser().has_permission(self.request, self):
            return DocumentoTributario.objects.filter(usuario_subida=user).order_by('-fecha')
        return DocumentoTributario.objects.none()

    def perform_create(self, serializer):
        """
        Lógica para UN SOLO archivo (usada por el Cliente).
        """
        user = self.request.user
        sistema_usuario = Sistema.objects.filter(usuarios=user).first()
        
        if not sistema_usuario:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("El usuario no está asociado a ningún sistema.")
            
        serializer.save(
            usuario_subida=user,
            sistema=sistema_usuario
        )

    def create(self, request, *args, **kwargs):
        """
        Anula el método 'create' para manejar la subida múltiple.
        """
        user_logueado = self.request.user
        role_logueado = None
        
        if IsAdminOrCorredor().has_permission(self.request, self):
            role_logueado = 'admin_or_corredor'
        elif IsClienteUser().has_permission(self.request, self):
            role_logueado = 'cliente'

        if role_logueado == 'cliente':
            return super().create(request, *args, **kwargs)

        if role_logueado == 'admin_or_corredor':
            client_id = request.data.get('client_id')
            if not client_id:
                return Response({"error": "Un Corredor o Administrador debe seleccionar un 'client_id'"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                target_user = User.objects.get(pk=client_id)
            except User.DoesNotExist:
                return Response({"error": "El 'client_id' seleccionado no es válido"}, status=status.HTTP_404_NOT_FOUND)

            sistema_usuario = Sistema.objects.filter(usuarios=target_user).first()
            if not sistema_usuario:
                return Response({"error": f"El usuario '{target_user.username}' no está asociado a ningún sistema."}, status=status.HTTP_400_BAD_REQUEST)

            archivos = request.FILES.getlist('archivo')
            if not archivos:
                return Response({"error": "No se seleccionaron archivos."}, status=status.HTTP_400_BAD_REQUEST)

            documentos_creados = []
            
            for archivo in archivos:
                doc = DocumentoTributario.objects.create(
                    usuario_subida=target_user,
                    sistema=sistema_usuario,
                    archivo=archivo
                )
                documentos_creados.append(doc)

            serializer = self.get_serializer(documentos_creados, many=True)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        return Response({"error": "Rol de usuario no determinado"}, status=status.HTTP_403_FORBIDDEN)

class DocumentoTributarioDeleteView(generics.DestroyAPIView):
    """
    Permite a un usuario (Cliente) eliminar sus propios archivos.
    Endpoint: DELETE /api/documentos/<int:pk>/
    """
    serializer_class = DocumentoTributarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DocumentoTributario.objects.filter(usuario_subida=self.request.user)

class AlertaListCreate(generics.ListCreateAPIView):
    """
    Vista para listar y crear Alertas.
    - Admins/Corredores: Pueden crear y ver todas.
    - Clientes: Solo pueden ver las alertas asociadas a sus sistemas.
    """
    serializer_class = AlertaSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrCorredor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if IsAdminOrCorredor().has_permission(self.request, self):
            return Alerta.objects.all()
        if IsClienteUser().has_permission(self.request, self):
            return Alerta.objects.filter(sistema__usuarios=user)
        return Alerta.objects.none()

class ClienteAlertaListView(generics.ListAPIView):
    serializer_class = AlertaSerializer
    permission_classes = [IsClienteUser]

    def get_queryset(self):
        return Alerta.objects.filter(usuario_destino=self.request.user).order_by('-fecha')[:10]
    
class ReporteListCreate(generics.ListCreateAPIView):
    serializer_class = ReporteSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrCorredor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if IsAdminOrCorredor().has_permission(self.request, self):
            return Reporte.objects.all()
        if IsClienteUser().has_permission(self.request, self):
            return Reporte.objects.filter(sistema__usuarios=user)
        return Reporte.objects.none()

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = None
        
        if Administrador.objects.filter(user=user).exists():
            role = 'admin'
        elif CorredorTributario.objects.filter(user=user).exists():
            role = 'corredor_tributario'
        elif Cliente.objects.filter(user=user).exists():
            role = 'cliente'
        else:
            role = 'cliente' 

        return Response({
            'username': user.username,
            'role': role
        })
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdminUser]


class UpdateUserRoleView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request):
        user_id = request.data.get('user_id')
        new_role = request.data.get('new_role')

        if not user_id or not new_role:
            return Response(
                {"error": "user_id y new_role son requeridos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with transaction.atomic():
                Administrador.objects.filter(user=user).delete()
                CorredorTributario.objects.filter(user=user).delete()
                Cliente.objects.filter(user=user).delete()

                if new_role == 'admin':
                    Administrador.objects.create(user=user)
                elif new_role == 'corredor_tributario':
                    CorredorTributario.objects.create(user=user)
                elif new_role == 'cliente':
                    Cliente.objects.create(user=user)
                else:
                    return Response(
                        {"error": "Rol no válido"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            return Response(
                {"success": f"Rol de {user.username} actualizado a {new_role}"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"Error en la transacción: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ClientListView(generics.ListAPIView):
    queryset = Cliente.objects.all().select_related('user')
    serializer_class = ClientListSerializer
    permission_classes = [IsAdminOrCorredor]

class CalificacionListView(generics.ListAPIView):
    queryset = CalificacionTributaria.objects.all().order_by('-fecha')
    serializer_class = CalificacionListSerializer
    permission_classes = [IsAdminOrCorredor]

class CalificacionDetailView(generics.RetrieveAPIView):
    queryset = CalificacionTributaria.objects.all()
    serializer_class = CalificacionTributariaSerializer
    permission_classes = [IsAdminOrCorredor]

class CalificacionCreateView(generics.CreateAPIView):
    serializer_class = CalificacionTributariaSerializer
    permission_classes = [IsAdminOrCorredor]

    def perform_create(self, serializer):
        corredor = self.request.user
        
        client_id = self.request.data.get('client_id')
        
        if not client_id:
            raise ValidationError("Se requiere un 'client_id' para asignar la calificación.")

        try:
            target_user = User.objects.get(pk=client_id)
        except User.DoesNotExist:
            raise ValidationError("El 'client_id' seleccionado no es válido.")
        
        sistema_cliente = Sistema.objects.filter(usuarios=target_user).first()
        if not sistema_cliente:
            raise ValidationError(f"El usuario '{target_user.username}' no está asociado a ningún sistema.")
        
        serializer.save(
            creado_por=corredor,
            sistema=sistema_cliente
        )
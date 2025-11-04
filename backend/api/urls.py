from django.urls import path
from . import views

urlpatterns = [
    # --- Endpoints para Sistema ---
    # POST y GET (Listar)
    path("sistemas/", views.SistemaListCreate.as_view(), name="sistema-list-create"),
    # GET (Detalle), PUT, PATCH, DELETE
    path("sistemas/<int:pk>/", views.SistemaDetail.as_view(), name="sistema-detail"),

    # --- Endpoints para Documentos Tributarios ---
    # POST y GET (Listar)
    path("documentos/", views.DocumentoTributarioListCreate.as_view(), name="documento-list-create"),
    path("documentos/<int:pk>/", views.DocumentoTributarioDeleteView.as_view(), name="documento-delete"),
    # (No se definieron vistas de detalle/actualización para este, pero se podrían agregar)

    # --- Endpoints para Alertas ---
    # POST y GET (Listar)
    path("alertas/", views.AlertaListCreate.as_view(), name="alerta-list-create"),
    path("cliente/alertas/", views.ClienteAlertaListView.as_view(), name="cliente-list-alertas"),
    # --- Endpoints para Reportes ---
    # POST y GET (Listar)
    path("reportes/", views.ReporteListCreate.as_view(), name="reporte-list-create"),

    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("admin/users/", views.UserListView.as_view(), name="admin-user-list"),
    path("admin/user/update-role/", views.UpdateUserRoleView.as_view(), name="admin-update-role"),
    path("admin/clientes/", views.ClientListView.as_view(), name="admin-client-list"),
    path("corredor/calificaciones/create/", views.CalificacionCreateView.as_view(), name="calificacion-create"),
    path("corredor/calificaciones/", views.CalificacionListView.as_view(), name="calificacion-list"),
    path("corredor/calificaciones/<int:pk>/", views.CalificacionDetailView.as_view(), name="calificacion-detail"),
]
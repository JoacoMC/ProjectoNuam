from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
class Cliente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Cliente: {self.user.username}"

class CorredorTributario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Corredor: {self.user.username}"

class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Admin: {self.user.username}"


class Sistema(models.Model):
    usuarios = models.ManyToManyField(User, related_name='sistemas')
    logs = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Sistema ID: {self.id}"

class DocumentoTributario(models.Model):
    sistema = models.ForeignKey(Sistema, on_delete=models.CASCADE, related_name='documentos')
    fecha = models.DateField(default=timezone.now)
    tipo = models.CharField(max_length=45, blank=True, default="Documento Cliente")
    usuario_subida = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="documentos_subidos")
    
    archivo = models.FileField(
        upload_to='documentos_tributarios/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'xls', 'xlsx'])
        ],
        null=True,
        blank=True
    )
    nombre_archivo = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        if self.archivo and not self.nombre_archivo:
            self.nombre_archivo = self.archivo.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Doc. {self.tipo} - Sistema {self.sistema_id}"

class Alerta(models.Model):
    sistema = models.ForeignKey(Sistema, on_delete=models.CASCADE, related_name='alertas')
    fecha = models.DateTimeField(default=timezone.now)
    comentario = models.CharField(max_length=255)
    usuario_destino = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alertas", null=True, blank=True)
    leido = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-fecha']

class Reporte(models.Model):
    sistema = models.ForeignKey(Sistema, on_delete=models.CASCADE, related_name='reportes')
    fecha = models.DateField()
    tipo = models.CharField(max_length=45)
    comentario = models.CharField(max_length=255)

    def __str__(self):
        return f"Reporte {self.tipo} - Sistema {self.sistema.id}"

@receiver(post_save, sender=DocumentoTributario)
def crear_alerta_subida_tributaria(sender, instance, created, **kwargs):
    """
    Crea una alerta cuando se GUARDA un nuevo DocumentoTributario con archivo.
    """
    if created and instance.archivo and instance.usuario_subida:
        Alerta.objects.create(
            sistema=instance.sistema,
            fecha=instance.fecha,
            comentario=f"Archivo subido: {instance.archivo.name}",
            usuario_destino=instance.usuario_subida
        )

@receiver(post_delete, sender=DocumentoTributario)
def crear_alerta_eliminado_tributaria(sender, instance, **kwargs):
    """
    Crea una alerta cuando se ELIMINA un DocumentoTributario con archivo.
    """
    if instance.archivo and instance.usuario_subida:
        Alerta.objects.create(
            sistema=instance.sistema,
            fecha=instance.fecha,
            comentario=f"Archivo eliminado: {instance.archivo.name}",
            usuario_destino=instance.usuario_subida
        )

class CalificacionTributaria(models.Model):
    sistema = models.ForeignKey(Sistema, on_delete=models.CASCADE, related_name="calificaciones")
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="calificaciones_creadas")
    mercado = models.CharField(max_length=20)
    descripcion = models.CharField(max_length=255, blank=True)
    fecha = models.DateField()
    secuencia_evento = models.BigIntegerField()
    valor_historico = models.DecimalField(max_digits=18, decimal_places=8, default=0.0)
    año = models.IntegerField(null=True, blank=True)
    instrumento = models.CharField(max_length=50, blank=True)
    factor = models.DecimalField(max_digits=18, decimal_places=8, default=0.0, null=True, blank=True)
    factores = models.JSONField(default=dict, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"Calificación {self.id} - {self.mercado} ({self.fecha})"
from django.db import models

class Repuestos(models.Model):
    codigo = models.CharField(primary_key=True, max_length=30)
    descripcion = models.TextField()
    marca = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10 ,decimal_places=2)
    stock = models.IntegerField()
    tipo = models.CharField(null=True, max_length=100)
    porcentaje_recargo = models.IntegerField()
    
    def __str__(self):
        return f'Repuesto con código {self.codigo} y precio {self.precio_venta}'
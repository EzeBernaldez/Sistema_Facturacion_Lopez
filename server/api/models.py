from django.db import models

class Repuestos(models.Model):
    codigo = models.CharField(primary_key=True, max_length=30, db_index=True)
    descripcion = models.TextField()
    marca = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10 ,decimal_places=2)
    stock = models.IntegerField()
    tipo = models.CharField(null=True, max_length=100)
    porcentaje_recargo = models.IntegerField()
    
    def __str__(self):
        return f'Repuesto con código {self.codigo} y precio {self.precio_venta}'

class Vehiculos(models.Model):
    codigo_vehiculos = models.CharField(primary_key=True, max_length=30, db_index=True)
    modelo = models.CharField(max_length=30)
    ano_fabricacion = models.DateField()
    marca = models.CharField(max_length=30)
    motor = models.CharField(max_length=10, null=True)
    tipo_vehiculo = models.CharField(max_length=20, db_index=True)
    tipo_semirremolque = models.CharField(max_length=30, null=True)

class Proveedores(models.Model):
    codigo_proveedores = models.CharField(primary_key=True,db_index=True,max_length=30)
    correo = models.EmailField(max_length=254, help_text='Ingrese una dirección de email válida')
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)

class Telefonos_Proveedores(models.Model):
    proveedor = models.ForeignKey(Proveedores, on_delete=models.CASCADE)
    numero = models.CharField(max_length=20)
    
    class Meta:
        unique_together = [['proveedor', 'numero']]
    
    def __str__(self):
        return f'{self.numero}'

class Clientes(models.Model):
    condiciones_iva = [
        ('Monotributo', 'Monotributo'),
        ('Inscripto', 'Inscripto'),
        ('NoInscripto', 'NoInscripto'),
        ('Exento', 'Exento')
    ]
    
    nombre=models.CharField(max_length=100, default="Sin nombre")
    codigo_clientes = models.CharField(max_length=30, db_index=True, primary_key=True)
    correo = models.EmailField(max_length=254, help_text='Ingrese una dirección de email válida')
    condicion_iva = models.CharField(max_length=11, choices=condiciones_iva)
    razon_social = models.CharField(max_length=50)
    cuit = models.CharField(max_length=50, unique=True)
    direccion = models.CharField(max_length=200,default="Sin direccion")

class Telefonos_Clientes(models.Model):
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE)
    numero = models.CharField(max_length=20)
    
    class Meta:
        unique_together = [['cliente', 'numero']]

class Empleados(models.Model):
    dni_empleado = models.CharField(max_length=11, primary_key=True)
    nombre = models.CharField(max_length=20)
    apellido = models.CharField(max_length=20)

class Telefonos_Empleados(models.Model):
    empleado = models.ForeignKey(Empleados, on_delete=models.CASCADE)
    numero = models.CharField(max_length=20)
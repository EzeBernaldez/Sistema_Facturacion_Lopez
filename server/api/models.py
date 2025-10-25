from django.db import models

class Repuestos(models.Model):
    codigo = models.CharField(primary_key=True, max_length=30, db_index=True)
    descripcion = models.TextField()
    marca = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10 ,decimal_places=2)
    stock = models.IntegerField()
    tipo = models.CharField(max_length=100, null=True)
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

class Remito_Proveedores(models.Model):
    pagado_choices = [
        ('si','si'),
        ('no', 'no'),
    ]
    
    nro_remito = models.CharField(primary_key=True, max_length=12, db_index=True)
    fecha = models.DateField()
    monto_total = models.DecimalField(max_digits=20, decimal_places=2)
    pagado = models.CharField(max_length=3, choices=pagado_choices)
    proveedor_proviene_de = models.ForeignKey(Proveedores, on_delete=models.CASCADE)
    

class Contiene(models.Model):
    codigo_contiene = models.ForeignKey(Repuestos,on_delete=models.CASCADE)
    nro_remito_contiene = models.ForeignKey(Remito_Proveedores, on_delete=models.CASCADE)
    precio_stock = models.DecimalField(max_digits=10,decimal_places=2)
    cantidad = models.IntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:    
        unique_together = [['codigo_contiene', 'nro_remito_contiene']]
        indexes = [
            models.Index(fields=['codigo_contiene','nro_remito_contiene'])
        ]

class Pagos(models.Model):
    
    metodo_pago_choices = [
        ('efectivo', 'efectivo'),
        ('cheque', 'cheque'),
        ('transferencia', 'transferencia'),
        ('credito','credito'),
        ('debito', 'debito'),
    ]
    
    nro_pago = models.CharField(primary_key=True, db_index=True, max_length=20)
    fecha = models.DateField()
    monto_parcial = models.DecimalField(max_digits=20, decimal_places=2)
    metodo_pago = models.CharField(max_length=15, choices=metodo_pago_choices)
    remito_se_efectuan = models.ForeignKey(Remito_Proveedores, on_delete=models.CASCADE)

class Suministra(models.Model):
    repuesto_suministra = models.ForeignKey(Repuestos, on_delete=models.CASCADE)
    proveedor_suministra = models.ForeignKey(Proveedores, on_delete=models.CASCADE)
    codigo_origen = models.CharField(primary_key=True, max_length=20, db_index=True)
    cantidad = models.IntegerField()
    
    class Meta:
        unique_together = [['repuesto_suministra', 'proveedor_suministra']]
        indexes = [
            models.Index(fields=['repuesto_suministra', 'proveedor_suministra']),
        ]

class Facturas(models.Model):
    metodo_pago_choices = [
        ('efectivo', 'efectivo'),
        ('cheque', 'cheque'),
        ('transferencia', 'transferencia'),
        ('credito','credito'),
        ('debito', 'debito'),
    ]
    
    nro_factura = models.CharField(max_length=15, primary_key=True, db_index=True)
    total = models.DecimalField(max_digits=20, decimal_places=2)
    fecha = models.DateField()
    metodo_pago = models.CharField(max_length=15, choices=metodo_pago_choices)
    empleado_hace = models.ForeignKey(Empleados, on_delete=models.CASCADE)
    cliente_participa = models.ForeignKey(Clientes, on_delete=models.CASCADE)

class SeFacturanEn(models.Model):
    nro_factura = models.ForeignKey(Facturas, on_delete=models.CASCADE)
    codigo_repuesto = models.ForeignKey(Repuestos, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio = models.DecimalField(max_digits=15, decimal_places=2)
    subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    
    class Meta:
        unique_together = [['nro_factura', 'codigo_repuesto']]
        indexes = [
            models.Index(fields=['nro_factura', 'codigo_repuesto'])
        ]

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Repuestos, Proveedores, Telefonos_Proveedores, Vehiculos, Clientes, Telefonos_Clientes, Empleados, Telefonos_Empleados, Remito_Proveedores, Contiene, Pagos, Suministra, SeFacturanEn, Facturas
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Usuario no disponible')
            else:
                raise serializers.ValidationError('Credenciales inválidas')
        else:
            raise serializers.ValidationError('Debe proporcionar el usuario y contraseña')

        return data

class SuministraRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suministra
        fields = '__all__'


class SuministraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suministra
        fields = ['proveedor_suministra', 'codigo_origen', 'cantidad']


class RepuestosSerializer(serializers.ModelSerializer):
    
    codigo = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Repuestos.objects.all(),
                message='El código de repuesto ya existe. Utilice otro código o modifique el repuesto existente'
            )
        ]
    )
    
    suministra = SuministraSerializer(many=True, write_only=True, required=False)
    
    suministra_read = SuministraSerializer(many=True, read_only=True, source='suministra_set')
    
    class Meta:
        model = Repuestos
        fields = ['codigo', 'descripcion', 'marca', 'precio_venta', 'stock', 'tipo', 'porcentaje_recargo', 'suministra', 'suministra_read']
    
    @transaction.atomic
    def create(self, validated_data):
        suministran = validated_data.pop('suministra', [])
        
        repuesto = Repuestos.objects.create(**validated_data)
        
        for suministra in suministran:
            Suministra.objects.create(repuesto_suministra=repuesto, **suministra)
        
        return repuesto
    
    @transaction.atomic
    def update(self, instance, validated_data):
        suministran = validated_data.pop('suministra', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if suministran is not None:
            Suministra.objects.filter(repuesto_suministra=instance).delete()
            
            for suministra in suministran:
                Suministra.objects.create(repuesto_suministra=instance, **suministra) 
            
        return instance

class VehiculosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculos
        fields = '__all__'

class TelefonosProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefonos_Proveedores
        fields = ['numero']

class ProveedoresSerializer(serializers.ModelSerializer):
    telefonos = TelefonosProveedoresSerializer(many=True, read_only=True, source='telefonos_proveedores_set')
    
    telefonos_proveedores = TelefonosProveedoresSerializer(many=True,write_only=True,required=False)
    
    class Meta:
        model = Proveedores
        fields = ['codigo_proveedores', 'correo', 'nombre', 'direccion', 'telefonos', 'telefonos_proveedores']
    
    def create(self, validated_data):
        telefonos_proveedores = validated_data.pop('telefonos_proveedores', [])
        
        proveedor = Proveedores.objects.create(**validated_data)
        
        for telefono in telefonos_proveedores:
            Telefonos_Proveedores.objects.create(proveedor=proveedor, **telefono)
        
        return proveedor
    
    def update(self, instance, validated_data):
        telefonos_proveedores = validated_data.pop('telefonos_proveedores', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if telefonos_proveedores is not None:
            Telefonos_Proveedores.objects.filter(proveedor=instance).delete()
            
            for telefono in telefonos_proveedores:
                Telefonos_Proveedores.objects.create(proveedor=instance, **telefono) 
            
        return instance

class TelefonosClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefonos_Clientes
        fields = ['numero']

class ClientesSerializer(serializers.ModelSerializer):
    
    codigo = serializers.CharField(
        source='codigo_clientes',
        validators=[
            UniqueValidator(
                queryset=Clientes.objects.all(),
                message='El código de cliente ya existe. Utilice otro código o modifique el cliente existente'
            )
        ]
    )
    
    cuit = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Clientes.objects.all(),
                message='El cuit del cliente ya existe. Utilice otro cuit o modifique el cliente existente'
            )
        ]
    )
    
    telefonos = TelefonosClientesSerializer(many=True, read_only=True, source='telefonos_clientes_set')
    
    telefonos_clientes = TelefonosClientesSerializer(many=True,write_only=True,required=False)
    
    class Meta:
        model = Clientes
        fields = ['codigo', 'correo', 'nombre','condicion_iva', 'razon_social', 'telefonos', 'telefonos_clientes','cuit','direccion']
    
    def create(self, validated_data):
        telefonos_clientes = validated_data.pop('telefonos_clientes', [])
        
        cliente = Clientes.objects.create(**validated_data)
        
        for telefono in telefonos_clientes:
            Telefonos_Clientes.objects.create(cliente=cliente, **telefono)
        
        return cliente
    
    def update(self, instance, validated_data):
        telefonos_clientes = validated_data.pop('telefonos_clientes', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if telefonos_clientes is not None:
            Telefonos_Clientes.objects.filter(cliente=instance).delete()
            
            for telefono in telefonos_clientes:
                Telefonos_Clientes.objects.create(cliente=instance, **telefono) 
            
        return instance

class TelefonosEmpleadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefonos_Empleados
        fields = ['numero']

class EmpleadosSerializer(serializers.ModelSerializer):
    telefonos = TelefonosEmpleadosSerializer(many=True, read_only=True, source='telefonos_empleados_set')
    
    telefonos_empleados = TelefonosEmpleadosSerializer(many=True,write_only=True,required=False)
    
    class Meta:
        model = Empleados
        fields = ['dni_empleado', 'nombre', 'apellido', 'telefonos', 'telefonos_empleados']
    
    def create(self, validated_data):
        telefonos_empleados = validated_data.pop('telefonos_empleados', [])
        
        empleado = Empleados.objects.create(**validated_data)
        
        for telefono in telefonos_empleados:
            Telefonos_Empleados.objects.create(empleado=empleado, **telefono)
        
        return empleado
    
    def update(self, instance, validated_data):
        telefonos_empleados = validated_data.pop('telefonos_empleados', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if telefonos_empleados is not None:
            Telefonos_Empleados.objects.filter(empleado=instance).delete()
            
            for telefono in telefonos_empleados:
                Telefonos_Empleados.objects.create(empleado=instance, **telefono) 
            
        return instance

class ContieneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contiene
        fields = ['codigo_contiene', 'precio_stock', 'cantidad', 'subtotal']

class RemitoProveedoresSerializer(serializers.ModelSerializer):
    
    contiene_write = ContieneSerializer(many=True, write_only=True, required=False)
    
    contiene_read = ContieneSerializer(many=True, read_only=True, source='contiene_set')
    
    proveedor_proviene_de = serializers.PrimaryKeyRelatedField(
        queryset=Proveedores.objects.all(),
        write_only=True,
        required=False,
    )
    
    proveedor_proviene_de_read = ProveedoresSerializer(source='proveedor_proviene_de', read_only=True)
    
    class Meta:
        model = Remito_Proveedores
        fields = ['nro_remito', 'fecha', 'monto_total', 'pagado', 'proveedor_proviene_de_read', 'proveedor_proviene_de' ,'contiene_read', 'contiene_write']
    

    def validate(self, data):
        
        proveedor = data.get('proveedor_proviene_de')
        contiene_list = data.get('contiene_write', [])
        
        if not Proveedores.objects.filter(pk=proveedor.pk).exists():
            raise serializers.ValidationError({
                'proveedor_proviene_de': 'El proveedor especificado no existe'
            })
        
        for contiene_data in contiene_list:
            repuesto = contiene_data.get('codigo_contiene')
            
            if not Repuestos.objects.filter(pk=repuesto.pk).exists():
                raise serializers.ValidationError({
                    'contiene_write': f'El repuesto {repuesto} no existe'
                })
            
            if not Suministra.objects.filter(proveedor_suministra=proveedor,repuesto_suministra=repuesto).exists():
                raise serializers.ValidationError({
                    'contiene_write': f'El repuesto {repuesto} no está asociado al proveedor {proveedor}'
                })
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        contiene_list = validated_data.pop('contiene_write', [])
        
        remito = Remito_Proveedores.objects.create(**validated_data)
        
        for contiene_data in contiene_list:
            Contiene.objects.create(nro_remito_contiene=remito, **contiene_data)
        
        return remito
    
    @transaction.atomic
    def update(self, instance, validated_data):
        contiene_list = validated_data.pop('contiene_write', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if contiene_list is not None:
            Contiene.objects.filter(nro_remito_contiene=instance).delete()
            
            for contiene_data in contiene_list:
                Contiene.objects.create(nro_remito_contiene=instance, **contiene_data)
            
        return instance

class SeFacturanEnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeFacturanEn
        fields = ['codigo_repuesto', 'cantidad', 'precio', 'subtotal']


class FacturasSerializer(serializers.ModelSerializer):
    
    codigo = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Facturas.objects.all(),
                message='El número de factura ya existe. Utilice otro número o modifique la factura existente'
            )
        ]
    )
    
    empleado_hace = serializers.PrimaryKeyRelatedField(
        queryset=Empleados.objects.all(),
        write_only=True,
        required=False,
    )
    
    empleado_hace_read = EmpleadosSerializer(source='empleado_hace', read_only=True)
    
    cliente_participa = serializers.PrimaryKeyRelatedField(
        queryset=Clientes.objects.all(),
        write_only=True,
        required=False,
    )
    
    cliente_participa_read = ClientesSerializer(source='cliente_participa', read_only=True)
    
    se_facturan_en = SeFacturanEnSerializer(many=True, write_only=True, required=False)
    
    se_facturan_en_read = SeFacturanEnSerializer(many=True, read_only=True, source='sefacturanen_set') #Duda, capaz necesito hacer un serializer que contenga todos los atributos
    
    class Meta:
        model = Repuestos
        fields = ['nro_factura', 'total', 'fecha', 'metodo_pago', 'empleado_hace', 'empleado_hace_read', 'cliente_participa', 'cliente_participa_read', 'se_facturan_en', 'se_facturan_en_read']
    
    def validate(self, data):
        
        empleado_hace = data.get('empleado_hace')
        cliente_participa = data.get('cliente_participa')
        repuestos_se_facturan = data.get('se_facturan_en', [])
        
        if not Empleados.objects.filter(dni_empleado=empleado_hace).exists():
            raise serializers.ValidationError({
                'empleado_hace': f'El empleado {empleado_hace} no existe.'
            })
        
        if not Clientes.objects.filter(codigo_clientes=cliente_participa).exists():
            raise serializers.ValidationError({
                'cliente_participa': f'El cliente {cliente_participa} no existe.'
            })
        
        for repuesto in repuestos_se_facturan:
            if not Repuestos.objects.filter(codigo=repuesto.codigo_repuesto).exists():
                raise serializers.ValidationError({
                    'se_facturan_en': f'El repuesto {repuesto} no existe.'
                })
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        repuestos_se_facturan = validated_data.pop('se_facturan_en', [])
        
        factura = Facturas.objects.create(**validated_data)
        
        for repuesto in repuestos_se_facturan:
            SeFacturanEn.objects.create(nro_factura=factura, **repuesto)
        
        return factura
    
    @transaction.atomic
    def update(self, instance, validated_data):
        repuestos_se_facturan = validated_data.pop('se_facturan_en', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if repuestos_se_facturan is not None:
            SeFacturanEn.objects.filter(nro_factura=instance).delete()
            
            for repuesto in repuestos_se_facturan:
                SeFacturanEn.objects.create(nro_factura=instance, **repuesto) 
            
        return instance
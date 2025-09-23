from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Repuestos, Proveedores, Telefonos_Proveedores, Vehiculos, Clientes, Telefonos_Clientes, Empleados, Telefonos_Empleados 
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

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

class RepuestosSerializer(serializers.ModelSerializer):
    
    codigo = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Repuestos.objects.all(),
                message='El código de repuesto ya existe. Utilice otro código o modifique el repuesto existente'
            )
        ]
    )
    
    class Meta:
        model = Repuestos
        fields = '__all__'
    

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
        
        if telefonos_clientes is not None:
            Telefonos_Clientes.objects.filter(cliente=instance).delete()
            
            for telefono in telefonos_clientes:
                Telefonos_Clientes.objects.create(cliente=instance, **telefono) 
            
        return instance

class TelefonosEmpleadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefonos_Empleados
        fields = '__all__'

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
        
        if telefonos_empleados is not None:
            Telefonos_Empleados.objects.filter(empleado=instance).delete()
            
            for telefono in telefonos_empleados:
                Telefonos_Empleados.objects.create(empleado=instance, **telefono) 
            
        return instance
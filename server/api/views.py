from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from .serializers import UserSerializer, LoginSerializer, RepuestosSerializer, ProveedoresSerializer, ClientesSerializer, EmpleadosSerializer, RemitoProveedoresSerializer, SuministraRetrieveSerializer, VehiculosSerializer
from .models import Repuestos, Proveedores, Clientes, Empleados, Remito_Proveedores, Suministra, Vehiculos
from .serializers import UserSerializer, LoginSerializer, RepuestosSerializer, ProveedoresSerializer, ClientesSerializer, EmpleadosSerializer, RemitoProveedoresSerializer, SuministraRetrieveSerializer, FacturasSerializer, SeFacturanEnSerializer, PerteneceSerializer
from .models import Repuestos, Proveedores, Clientes, Empleados, Remito_Proveedores, Suministra, Facturas, SeFacturanEn, Pertenece
from django.shortcuts import get_object_or_404
from django.db.models import Q


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'El usuario ya existe'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Sesión cerrada'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



# ----------------------------------------Repuestos

class CreateRepuestos(ListCreateAPIView):
    serializer_class = RepuestosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Repuestos.objects.all()

class RetrieveDestroyRepuestos(RetrieveDestroyAPIView):
    serializer_class = RepuestosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Repuestos.objects.all()
    lookup_field = 'codigo'

class RetrieveUpdateRepuestos(RetrieveUpdateDestroyAPIView):
    serializer_class = RepuestosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_object(self):
        codigo = self.kwargs['codigo']
        try:
            return Repuestos.objects.get(codigo=codigo)
        except Repuestos.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Repuesto no encontrado")

class CreateProveedores(ListCreateAPIView):
    serializer_class = ProveedoresSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Proveedores.objects.all()

class RetrieveUpdateDestroyProveedores(RetrieveUpdateDestroyAPIView):
    serializer_class = ProveedoresSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Proveedores.objects.all()
    lookup_field = 'codigo_proveedores'
        

# ----------------------------------------Vehiculos
class CreateVehiculos(ListCreateAPIView):
    serializer_class = VehiculosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Vehiculos.objects.all()

class RetrieveDestroyVehiculos(RetrieveDestroyAPIView):
    serializer_class = VehiculosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Vehiculos.objects.all()
    lookup_field = 'codigo_vehiculos'

class RetrieveUpdateDestroyVehiculos(RetrieveUpdateDestroyAPIView):
    serializer_class = VehiculosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Vehiculos.objects.all()
    lookup_field = 'codigo_vehiculos'

# ----------------------------------------Clientes
class CreateClientes(ListCreateAPIView):
    serializer_class = ClientesSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Clientes.objects.all()

class RetrieveUpdateDestroyClientes(RetrieveUpdateDestroyAPIView):
    serializer_class = ClientesSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Clientes.objects.all()
    lookup_field = 'codigo_clientes'

# -----------------------------------------Empleados
class CreateEmpleados(ListCreateAPIView):
    serializer_class = EmpleadosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Empleados.objects.all()

class RetrieveUpdateDestroyEmpleados(RetrieveUpdateDestroyAPIView):
    serializer_class = EmpleadosSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Empleados.objects.all()
    lookup_field = 'dni_empleado'


# -----------------------------------------RemitoProveedores

class CreateRemitoProveedores(ListCreateAPIView):
    serializer_class = RemitoProveedoresSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Remito_Proveedores.objects.all()

class RetrieveUpdateDestroyRemitoProveedores(RetrieveUpdateDestroyAPIView):
    serializer_class = RemitoProveedoresSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Remito_Proveedores.objects.all()
    lookup_field = 'nro_remito'


# -----------------------------------------Suministra

class RetrieveSuministra(RetrieveAPIView):
    serializer_class = SuministraRetrieveSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Suministra.objects.all()
    def get_object(self):
        codigo_repuesto = self.kwargs['codigo_repuesto']
        codigo_proveedor = self.kwargs['codigo_proveedor']
        
        # Buscar por los códigos de las FK
        return get_object_or_404(
            Suministra,
            repuesto_suministra__codigo=codigo_repuesto,
            proveedor_suministra__codigo_proveedores=codigo_proveedor
        )


# -----------------------------------------Facturas

class CreateFacturas(ListCreateAPIView):
    serializer_class = FacturasSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Facturas.objects.all()

class RetrieveUpdateDestroyFacturas(RetrieveUpdateDestroyAPIView):
    serializer_class = Facturas
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Facturas.objects.all()
    lookup_field = 'nro_factura'


# -----------------------------------------Pertenece

class CreatePertenece(ListCreateAPIView):
    serializer_class = PerteneceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Pertenece.objects.all()
    
    def post(self, request):
        serializer = PerteneceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensaje': 'Relaciones creadas correctamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_vehiculos_repuesto(request, codigo_repuesto):
    try:
        repuesto = Repuestos.objects.get(codigo=codigo_repuesto)
    except Repuestos.DoesNotExist:
        return Response({'error': 'Repuesto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    vehiculos = Vehiculos.objects.filter(pertenece__R_Codigo_pertenece=repuesto).distinct()

    serializer = VehiculosSerializer(vehiculos, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_vehiculos_no_pertenece(request, codigo_repuesto):
    try:
        repuesto = Repuestos.objects.get(codigo=codigo_repuesto)
    except Repuestos.DoesNotExist:
        return Response({'error': 'Repuesto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    vehiculos = Vehiculos.objects.exclude(pertenece__R_Codigo_pertenece=repuesto).distinct()

    serializer = VehiculosSerializer(vehiculos, many=True)
    return Response(serializer.data)

class RetrieveUpdateDestroyPertenece(RetrieveUpdateDestroyAPIView):
    serializer_class = Pertenece
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Pertenece.objects.all()
    
    def get_object(self):
        vehiculo_id = self.kwargs.get('V_Codigo_pertenece')
        repuesto_id = self.kwargs.get('R_Codigo_pertenece')
        return Pertenece.objects.get(
            V_Codigo_pertenece__codigo_vehiculos=vehiculo_id,
            R_Codigo_pertenece__codigo=repuesto_id
)


# -----------------------------------------Autocompletados


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def autoCompleteProveedores(request):
    search_term = request.GET.get('search', '').strip()
    
    if len(search_term) < 2:
        return Response([])
    
    proveedores = Proveedores.objects.filter(
        Q(nombre__icontains=search_term) | 
        Q(codigo_proveedores__icontains=search_term)
    )[:10]
    
    serializer = ProveedoresSerializer(proveedores, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def autoCompleteRepuestos(request):
    search_term = request.GET.get('search', '').strip()
    proveedor_id = request.GET.get('proveedor', '').strip()
    
    if len(search_term) < 2:
        return Response([])
    
    if not proveedor_id:
        return Response({"error": "Proveedor requerido"}, status=400)
    
    try:
        
        suministras = Suministra.objects.filter(
            proveedor_suministra=proveedor_id, 
        ).filter(
            Q(repuesto_suministra__codigo__icontains=search_term) |
            Q(repuesto_suministra__descripcion__icontains=search_term) |
            Q(repuesto_suministra__marca__icontains=search_term) |
            Q(codigo_origen__icontains=search_term)
        ).select_related('repuesto_suministra')[:10]  
        
        
        repuestos = [suministra.repuesto_suministra for suministra in suministras]
        
        
        serializer = RepuestosSerializer(repuestos, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        return Response([])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def autoCompleteClientes(request):
    search_term = request.GET.get('search', '').strip()
    
    if len(search_term) < 2:
        return Response([])
    
    clientes = Clientes.objects.filter(
        Q(nombre__icontains=search_term) | 
        Q(codigo_clientes__icontains=search_term) |
        Q(cuit__icontains=search_term)
    )[:10]
    
    serializer = ClientesSerializer(clientes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def autoCompleteEmpleados(request):
    search_term = request.GET.get('search', '').strip()
    
    if len(search_term) < 2:
        return Response([])
    
    empleados = Empleados.objects.filter(
        Q(nombre__icontains=search_term) | 
        Q(dni_empleado__icontains=search_term) |
        Q(apellido__icontains=search_term)
    )[:10]
    
    serializer = EmpleadosSerializer(empleados, many=True)
    return Response(serializer.data)
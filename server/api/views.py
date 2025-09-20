from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UserSerializer, LoginSerializer, RepuestosSerializer, ProveedoresSerializer, ClientesSerializer
from .models import Repuestos, Proveedores, Clientes

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
        

# ----------------------------------------Clientes
class CreateClientes(ListCreateAPIView):
    serializer_class = ClientesSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Clientes.objects.all()

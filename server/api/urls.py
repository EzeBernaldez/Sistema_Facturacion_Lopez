from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', views.user_profile, name='user_profile'),
    path('repuestos', views.CreateRepuestos.as_view()),
    path('clientes', views.CreateClientes.as_view()),
    path('clientes/cliente/<str:codigo_clientes>', views.RetrieveUpdateDestroyClientes.as_view()),
    path('repuestos/<str:codigo>', views.RetrieveDestroyRepuestos.as_view()),
    path('repuestos/actualizar/<str:codigo>', views.RetrieveUpdateRepuestos.as_view()),
    path('proveedores', views.CreateProveedores.as_view()),
    path('proveedores/proveedor/<str:codigo_proveedores>', views.RetrieveUpdateDestroyProveedores.as_view()),
    path('empleados', views.CreateEmpleados.as_view()),
    path('empleados/empleado/<str:dni_empleado>', views.RetrieveUpdateDestroyEmpleados.as_view()),
]
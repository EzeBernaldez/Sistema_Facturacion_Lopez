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
    path('remito_proveedores', views.CreateRemitoProveedores.as_view()),
    path('remito_proveedores/remito_proveedor/<str:nro_remito>', views.RetrieveUpdateDestroyRemitoProveedores.as_view()),
    path('suministra/<str:codigo_repuesto>/<str:codigo_proveedor>', views.RetrieveSuministra.as_view()),
    path('facturas', views.CreateFacturas.as_view()),
    path('facturas/factura/<str:nro_factura>', views.RetrieveUpdateDestroyFacturas.as_view()),
    path('proveedores/autocomplete/', views.autoCompleteProveedores, name='autocompleteProveedores'),
    path('repuestos/autocomplete/', views.autoCompleteRepuestos, name='autocompleteRepuestos'),
    path('clientes/autocomplete/', views.autoCompleteClientes, name='autocompleteClientes'),
    path('empleados/autocomplete/', views.autoCompleteEmpleados, name='autocompleteEmpleados'),
    path('vehiculos', views.CreateVehiculos.as_view()),
    path('vehiculos/<str:codigo_vehiculos>', views.RetrieveDestroyVehiculos.as_view()),
    path('vehiculos/vehiculo/<str:codigo_vehiculos>', views.RetrieveUpdateDestroyVehiculos.as_view()),
    path('repuestos/<str:codigo_repuesto>/vehiculo/', views.get_vehiculos_repuesto), 
    path('repuestos/<str:codigo_repuesto>/vehiculo/nuevo', views.get_vehiculos_no_pertenece),
    path('pertenece/<str:V_Codigo_pertenece>/<str:R_Codigo_pertenece>/', views.RetrieveUpdateDestroyPertenece.as_view(), name='pertenece-detail'),    
    path('pertenece/', views.CreatePertenece.as_view()),  
     
]
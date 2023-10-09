from django.urls import path
from .views import *


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('',home,name='home'),
    path('forDoctor/',forDoctor,name='forDoctor'),
    path('forDesk/',forDesk,name='forDesk'),
    path('forDoctor2/<int:id>/',forDoctor2,name='forDoctor2'),
    path('patientLogin/',patientLogin,name='patientLogin'),
    path('managerLogin/',managerLogin,name='managerLogin'),
    path('doctorLogin/',doctorLogin,name='doctorLogin'),
    path('allDocs/',allDoc,name='allDoc'),
    path('forPatient/',forPatient,name="forPatient"),
    path('addPatient/',addPatient,name='addPatient'),
    path('addAllotment/',addAllotment,name="addAllotment"),

]
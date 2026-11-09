from django.urls import path
from . import views

app_name = 'legal_core'

urlpatterns = [
    path('', views.index_view, name='home'),
    path('api/submit-matter/', views.api_submit_matter, name='api_submit_matter'),
    path('api/partner-register/', views.api_partner_register, name='api_partner_register'),
]


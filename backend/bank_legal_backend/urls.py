"""
URL configuration for bank_legal_backend project.
Serves full frontend (HTML, CSS, JS, Assets) + REST API endpoints + Django Admin.
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve

ROOT_DIR = settings.BASE_DIR.parent

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^css/(?P<path>.*)$', serve, {'document_root': ROOT_DIR / 'css'}),
    re_path(r'^js/(?P<path>.*)$', serve, {'document_root': ROOT_DIR / 'js'}),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': ROOT_DIR / 'assets'}),
    path('', include('legal_core.urls')),
]

admin.site.site_header = "Bank Legal & Professional Services Platform"
admin.site.site_title = "Bank Legal Admin Portal"
admin.site.index_title = "Legal Advisory & Dispute Case Management"

from django.contrib import admin
from .models import PartnerApplication, MatterInquiry


@admin.register(PartnerApplication)
class PartnerApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'reference_id',
        'full_name',
        'phone',
        'banks_served',
        'last_designation',
        'status',
        'created_at'
    )
    list_filter = ('status', 'banks_served', 'created_at')
    search_fields = ('reference_id', 'full_name', 'phone', 'id_verification', 'banks_served', 'last_designation')
    readonly_fields = ('reference_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Identification & Contact', {
            'fields': ('reference_id', 'full_name', 'phone', 'id_verification')
        }),
        ('Banking Background', {
            'fields': ('banks_served', 'last_designation', 'years_service_retirement', 'expertise')
        }),
        ('Summary & Review', {
            'fields': ('professional_summary', 'status', 'created_at', 'updated_at')
        }),
    )


@admin.register(MatterInquiry)
class MatterInquiryAdmin(admin.ModelAdmin):
    list_display = (
        'reference_id',
        'full_name',
        'phone',
        'category',
        'callback_slot',
        'status',
        'created_at'
    )
    list_filter = ('category', 'callback_slot', 'status', 'created_at')
    search_fields = ('reference_id', 'full_name', 'phone', 'problem_description')
    readonly_fields = ('reference_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Client Intake Information', {
            'fields': ('reference_id', 'full_name', 'phone', 'category', 'callback_slot')
        }),
        ('Matter Description', {
            'fields': ('problem_description',)
        }),
        ('Triage & Advisory Actions', {
            'fields': ('status', 'internal_notes', 'created_at', 'updated_at')
        }),
    )

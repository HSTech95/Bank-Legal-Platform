import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import render
from .models import PartnerApplication, MatterInquiry
from .forms import PartnerApplicationForm, MatterInquiryForm


def index_view(request):
    """
    Renders the platform frontend when hosted through Django.
    """
    return render(request, 'index.html')


@csrf_exempt
@require_POST
def api_submit_matter(request):
    """
    REST API endpoint to register confidential matter intake for telephonic triage.
    Accepts JSON payload: { name, phone, category, callbackSlot, description }
    """
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        data = request.POST.dict()

    form = MatterInquiryForm({
        'full_name': data.get('name') or data.get('full_name'),
        'phone': data.get('phone'),
        'category': data.get('category'),
        'callback_slot': data.get('callbackSlot') or data.get('callback_slot'),
        'problem_description': data.get('description') or data.get('problem_description'),
    })

    if form.is_valid():
        inquiry = form.save()
        return JsonResponse({
            'status': 'success',
            'reference_id': inquiry.reference_id,
            'message': 'Consultation request registered for confidential telephonic triage.',
            'category': inquiry.get_category_display(),
            'callback_slot': inquiry.get_callback_slot_display(),
        }, status=201)
    else:
        return JsonResponse({
            'status': 'error',
            'errors': form.errors.get_json_data()
        }, status=400)


@csrf_exempt
@require_POST
def api_partner_register(request):
    """
    REST API endpoint to register retired/former bankers as partners.
    Accepts JSON payload: { name, phone, idVerification, bankServed, lastDesignation, yearsService, expertise, summary }
    """
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        data = request.POST.dict()

    form = PartnerApplicationForm({
        'full_name': data.get('name') or data.get('full_name'),
        'phone': data.get('phone'),
        'id_verification': data.get('idVerification') or data.get('id_verification'),
        'banks_served': data.get('bankServed') or data.get('banks_served'),
        'last_designation': data.get('lastDesignation') or data.get('last_designation'),
        'years_service_retirement': data.get('yearsService') or data.get('years_service_retirement'),
        'expertise': data.get('expertise', []),
        'professional_summary': data.get('summary') or data.get('professional_summary'),
    })

    if form.is_valid():
        partner = form.save()
        return JsonResponse({
            'status': 'success',
            'reference_id': partner.reference_id,
            'message': 'Partner application recorded for credentials verification.',
            'empanelment_status': partner.get_status_display()
        }, status=201)
    else:
        return JsonResponse({
            'status': 'error',
            'errors': form.errors.get_json_data()
        }, status=400)

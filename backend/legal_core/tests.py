import json
from django.test import TestCase, Client
from django.urls import reverse
from .models import PartnerApplication, MatterInquiry


class LegalPlatformApiTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_matter_inquiry_creation_and_api(self):
        payload = {
            'name': 'Rajesh Kumar Verma',
            'phone': '9876543210',
            'category': 'employee',
            'callbackSlot': 'morning',
            'description': 'Received an unexplained showcause notice regarding audit queries dating back two financial years.'
        }
        response = self.client.post(
            reverse('legal_core:api_submit_matter'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertTrue(data['reference_id'].startswith('MATTER-2026-'))

        # Verify database record
        inquiry = MatterInquiry.objects.get(phone='9876543210')
        self.assertEqual(inquiry.full_name, 'Rajesh Kumar Verma')
        self.assertEqual(inquiry.category, 'employee')

    def test_partner_application_creation_and_api(self):
        payload = {
            'name': 'Suresh Chandra Sharma',
            'phone': '9811223344',
            'idVerification': 'ABCDE1234F',
            'bankServed': 'Bank of Baroda',
            'lastDesignation': 'General Manager (Credit & Vigilance)',
            'yearsService': '34 Years (Retd. Jan 2024)',
            'expertise': ['Disciplinary Proceedings', 'Audit & Vigilance Oversight'],
            'summary': '34 years of comprehensive experience across regional operations and corporate office vigilance.'
        }
        response = self.client.post(
            reverse('legal_core:api_partner_register'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertTrue(data['reference_id'].startswith('PARTNER-2026-'))

        # Verify database record
        partner = PartnerApplication.objects.get(phone='9811223344')
        self.assertEqual(partner.last_designation, 'General Manager (Credit & Vigilance)')

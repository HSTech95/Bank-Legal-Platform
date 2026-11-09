import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bank_legal_backend.settings')
django.setup()

from django.contrib.auth.models import User
from legal_core.models import PartnerApplication, MatterInquiry

# Create superuser if it doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@banklegal.org', 'BankLegal2026!')
    print("[+] Created Superuser: username='admin', password='BankLegal2026!'")
else:
    print("[*] Superuser 'admin' already exists.")

# Seed initial demonstration sample records
if not PartnerApplication.objects.filter(phone='9811223344').exists():
    p1 = PartnerApplication.objects.create(
        full_name='Ramesh Chandra Sharma',
        phone='9811223344',
        id_verification='ABCDE1234F',
        banks_served='Bank of Baroda, Punjab National Bank',
        last_designation='Deputy General Manager (DGM - Operations & HR)',
        years_service_retirement='34 Years (Retd. Jan 2024)',
        expertise=['Disciplinary Proceedings', 'Audit & Vigilance Oversight', 'Pension & Terminal Benefits'],
        professional_summary='Served 34 years heading Regional Offices and Corporate Disciplinary Appeals. Handled over 120 departmental inquiry defenses and vigilances.',
        status='VERIFIED'
    )
    print(f"[+] Seeded Demo Partner Application: {p1.reference_id}")

if not MatterInquiry.objects.filter(phone='9876543210').exists():
    m1 = MatterInquiry.objects.create(
        full_name='Anil Kumar Saxena',
        phone='9876543210',
        category='employee',
        callback_slot='morning',
        problem_description='Served with an inquiry showcause notice regarding credit appraisal decisions from 2022. Seeking senior administrative defense formulate and hearing counsel.',
        status='TRIAGED',
        internal_notes='Pre-brief completed. Scheduled for consultation with Vijay Kumar Arora on 10:30 AM.'
    )
    print(f"[+] Seeded Demo Matter Inquiry: {m1.reference_id}")

if not MatterInquiry.objects.filter(phone='9899887766').exists():
    m2 = MatterInquiry.objects.create(
        full_name='Sunita Devi Aggarwal',
        phone='9899887766',
        category='customer',
        callback_slot='afternoon',
        problem_description='Bank initiated symbolic possession notice under Section 13(4) of SARFAESI Act despite ongoing restructuring proposal. Require urgent tribunal advisory.',
        status='NEW',
        internal_notes='Awaiting afternoon telephonic callback slot.'
    )
    print(f"[+] Seeded Demo Customer Matter: {m2.reference_id}")

print("[OK] Database initialization complete.")

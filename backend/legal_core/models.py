import uuid
from django.db import models


def generate_reference_id(prefix="BLP"):
    return f"{prefix}-2026-{uuid.uuid4().hex[:6].upper()}"


class PartnerApplication(models.Model):
    """
    Stores empanelment applications for retired/ex-bankers with verified domain expertise.
    """
    STATUS_CHOICES = [
        ('PENDING_VERIFICATION', 'Pending Verification'),
        ('VERIFIED', 'Verified / Under Review'),
        ('EMPANELLED', 'Empanelled Partner'),
        ('REJECTED', 'Not Eligible / Rejected'),
    ]

    reference_id = models.CharField(max_length=32, unique=True, editable=False)
    full_name = models.CharField("Full Name", max_length=150)
    phone = models.CharField("Contact Number", max_length=15)
    id_verification = models.CharField("ID Verification Number (Aadhaar / PAN)", max_length=50)
    banks_served = models.CharField("Bank(s) Served", max_length=255)
    last_designation = models.CharField("Last Designation Held", max_length=120)
    years_service_retirement = models.CharField("Total Years of Service & Retirement Date", max_length=120)
    expertise = models.JSONField("Primary Areas of Expertise", default=list)
    professional_summary = models.TextField("Brief Professional Summary & Key Domains")
    status = models.CharField("Application Status", max_length=30, choices=STATUS_CHOICES, default='PENDING_VERIFICATION')
    created_at = models.DateTimeField("Submitted At", auto_now_add=True)
    updated_at = models.DateTimeField("Last Updated", auto_now=True)

    class Meta:
        verbose_name = "Partner Application"
        verbose_name_plural = "Partner Applications"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_id:
            self.reference_id = generate_reference_id(prefix="PARTNER")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_id} - {self.full_name} ({self.last_designation}, {self.banks_served})"


class MatterInquiry(models.Model):
    """
    Stores confidential intake requests for telephonic triage from bank employees & bank customers.
    """
    CATEGORY_CHOICES = [
        ('employee', 'Bank Employee Matter (Disciplinary / Inquiry / Terminal Benefits)'),
        ('customer', 'Bank Customer Matter (SARFAESI / Recovery / Ombudsman / Grievance)'),
    ]

    SLOT_CHOICES = [
        ('morning', 'Morning (10:00 AM – 01:00 PM)'),
        ('afternoon', 'Afternoon (02:00 PM – 05:00 PM)'),
        ('evening', 'Evening (05:00 PM – 08:00 PM)'),
    ]

    STATUS_CHOICES = [
        ('NEW', 'New Intake (Pending Triage Callback)'),
        ('TRIAGED', 'Triage Callback Initiated'),
        ('IN_REVIEW', 'Under Senior Advisory Review'),
        ('CLOSED', 'Closed / Resolved'),
    ]

    reference_id = models.CharField(max_length=32, unique=True, editable=False)
    full_name = models.CharField("Full Name", max_length=150)
    phone = models.CharField("Contact Number (Primary for Telephonic Callback)", max_length=15)
    category = models.CharField("Category Selection", max_length=20, choices=CATEGORY_CHOICES)
    callback_slot = models.CharField("Preferred Callback Time Slot", max_length=20, choices=SLOT_CHOICES)
    problem_description = models.TextField("Brief Description of Problem / Complaint / Legal Issue")
    status = models.CharField("Intake Status", max_length=25, choices=STATUS_CHOICES, default='NEW')
    internal_notes = models.TextField("Advisory Counsel Internal Notes", blank=True)
    created_at = models.DateTimeField("Submitted At", auto_now_add=True)
    updated_at = models.DateTimeField("Last Updated", auto_now=True)

    class Meta:
        verbose_name = "Matter Intake Request"
        verbose_name_plural = "Matter Intake Requests"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_id:
            self.reference_id = generate_reference_id(prefix="MATTER")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_id} - {self.full_name} [{self.get_category_display()}]"

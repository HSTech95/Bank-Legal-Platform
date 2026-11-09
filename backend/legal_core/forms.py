import re
from django import forms
from .models import PartnerApplication, MatterInquiry


class PartnerApplicationForm(forms.ModelForm):
    """
    Form for validating partner registration from retired/ex-bankers.
    """
    class Meta:
        model = PartnerApplication
        fields = [
            'full_name',
            'phone',
            'id_verification',
            'banks_served',
            'last_designation',
            'years_service_retirement',
            'expertise',
            'professional_summary'
        ]

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip().replace(' ', '').replace('-', '').replace('+91', '')
        if not re.match(r'^[6-9]\d{9}$', phone):
            raise forms.ValidationError("Please provide a valid 10-digit Indian mobile number.")
        return phone

    def clean_expertise(self):
        expertise = self.cleaned_data.get('expertise')
        if not expertise or len(expertise) == 0:
            raise forms.ValidationError("Please select at least one primary area of expertise.")
        return expertise

    def clean_professional_summary(self):
        summary = self.cleaned_data.get('professional_summary', '').strip()
        if len(summary) < 20:
            raise forms.ValidationError("Please provide at least 20 characters in your professional summary.")
        return summary


class MatterInquiryForm(forms.ModelForm):
    """
    Form for validating confidential matter intake consultation requests.
    """
    class Meta:
        model = MatterInquiry
        fields = [
            'full_name',
            'phone',
            'category',
            'callback_slot',
            'problem_description'
        ]

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip().replace(' ', '').replace('-', '').replace('+91', '')
        if not re.match(r'^[6-9]\d{9}$', phone):
            raise forms.ValidationError("Please provide a valid 10-digit Indian mobile number for telephonic callback.")
        return phone

    def clean_problem_description(self):
        desc = self.cleaned_data.get('problem_description', '').strip()
        if len(desc) < 20:
            raise forms.ValidationError("Please provide an outline of at least 20 characters regarding your issue.")
        return desc


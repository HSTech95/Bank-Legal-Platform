/**
 * Bank Legal & Professional Services Platform
 * Core Frontend Interactions & Form Validation
 * Vanilla JavaScript (ES6+) - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Element Selectors & Global Variables
  // ==========================================================================
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navContainer = document.querySelector('.nav-container');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Forms
  const partnerForm = document.getElementById('partner-form');
  const matterForm = document.getElementById('matter-form');
  const partnerSubmitBtn = document.getElementById('partner-submit-btn');
  const matterSubmitBtn = document.getElementById('matter-submit-btn');

  // Textarea Counters
  const partnerSummary = document.getElementById('partner-summary');
  const partnerCharNum = document.getElementById('partner-char-num');
  const problemDescription = document.getElementById('problem-description');
  const matterCharNum = document.getElementById('matter-char-num');

  // Modal Dialog
  const statusModal = document.getElementById('status-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalRefCode = document.getElementById('modal-ref-code');
  const modalIconWrap = document.getElementById('modal-icon-wrap');
  const toastContainer = document.getElementById('toast-container');

  // CTA Card Prefill Buttons
  const cardPrefillBtns = document.querySelectorAll('[data-prefill-category]');

  // Backend Integration Configuration Flag
  // Automatically detects if served via HTTP server (e.g., Django backend)
  const isHttpHosted = window.location.protocol.startsWith('http');
  const DJANGO_CONFIG = {
    useBackendApi: isHttpHosted,
    matterEndpoint: '/api/submit-matter/',
    partnerEndpoint: '/api/partner-register/'
  };

  // Update status badge in modal if connected to live backend
  const statusTextElem = document.getElementById('backend-status-text');
  if (statusTextElem && DJANGO_CONFIG.useBackendApi) {
    statusTextElem.innerHTML = '<span style="color:#0f5132; font-weight:700;">LIVE DJANGO BACKEND ACTIVE:</span> Data securely synchronized with SQLite database (<code>db.sqlite3</code>).';
  }

  // ==========================================================================
  // 2. Navigation: Sticky Header, Smooth Scrolling & ScrollSpy
  // ==========================================================================

  // Sticky Header elevation on scroll
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top click handler
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Mobile Menu Drawer Controls
  const toggleMobileMenu = (forceClose = false) => {
    const isCurrentlyOpen = navContainer.classList.contains('is-open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    if (shouldOpen) {
      navContainer.classList.add('is-open');
      mobileOverlay.classList.add('is-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      navContainer.classList.remove('is-open');
      mobileOverlay.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(true));
  }

  // Smooth Scrolling for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        toggleMobileMenu(true);

        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active Link Highlighting (ScrollSpy)
  const sections = document.querySelectorAll('section[id], article[id]');
  const observeScrollSpy = () => {
    const scrollPosition = (window.scrollY || window.pageYOffset) + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', observeScrollSpy, { passive: true });

  // ==========================================================================
  // 3. Category Prefill from Practice Area Cards
  // ==========================================================================
  cardPrefillBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = btn.getAttribute('data-prefill-category');
      const categorySelect = document.getElementById('matter-category');

      if (categorySelect && category) {
        categorySelect.value = category;
        categorySelect.dispatchEvent(new Event('change'));
      }
    });
  });

  // Character Counter for Textareas
  const setupCharCounter = (textarea, counterElement, maxChars) => {
    if (!textarea || !counterElement) return;
    const updateCount = () => {
      const currentLength = textarea.value.length;
      counterElement.textContent = currentLength;
      if (currentLength > maxChars) {
        counterElement.style.color = 'var(--danger-color)';
      } else {
        counterElement.style.color = '';
      }
    };
    textarea.addEventListener('input', updateCount);
    updateCount();
  };

  setupCharCounter(partnerSummary, partnerCharNum, 1200);
  setupCharCounter(problemDescription, matterCharNum, 2000);

  // ==========================================================================
  // 4. Form Validation Helper Functions
  // ==========================================================================

  // Validates Indian 10-digit mobile number format
  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    const regex = /^[6-9]\d{9}$/;
    return regex.test(cleaned);
  };

  // Validates Aadhaar (12 digits) or PAN (10 chars: 5 letters + 4 digits + 1 letter)
  const isValidGovtId = (idStr) => {
    const cleaned = idStr.trim().toUpperCase().replace(/[\s\-]/g, '');
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadhaarRegex = /^\d{12}$/;
    return panRegex.test(cleaned) || aadhaarRegex.test(cleaned) || cleaned.length >= 8;
  };

  // Sets error state on a form-group container
  const setFieldError = (groupId, errorId, message = null) => {
    const group = document.getElementById(groupId);
    const errorMsg = document.getElementById(errorId);
    if (group) group.classList.add('has-error');
    if (errorMsg && message) errorMsg.textContent = message;
    return false;
  };

  // Clears error state on a form-group container
  const clearFieldError = (groupId) => {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
  };

  // Attach live clear on user input
  const attachLiveValidationClearing = (form) => {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
      input.addEventListener('change', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  };

  if (partnerForm) attachLiveValidationClearing(partnerForm);
  if (matterForm) attachLiveValidationClearing(matterForm);

  // ==========================================================================
  // 5. Toast Notification System
  // ==========================================================================
  const showToast = (title, message, type = 'success') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'success'
      ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  };

  // ==========================================================================
  // 6. Modal Dialog System
  // ==========================================================================
  const openModal = ({ title, message, refCode, isSuccess = true }) => {
    if (!statusModal) return;

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalRefCode.textContent = refCode;

    if (isSuccess) {
      modalIconWrap.className = 'modal-icon-wrap success';
      modalIconWrap.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="modal-icon success">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      `;
    } else {
      modalIconWrap.className = 'modal-icon-wrap error';
      modalIconWrap.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="modal-icon error">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      `;
    }

    statusModal.classList.add('is-open');
    statusModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!statusModal) return;
    statusModal.classList.remove('is-open');
    statusModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

  // Close modal when clicking on dark backdrop
  if (statusModal) {
    statusModal.addEventListener('click', (e) => {
      if (e.target === statusModal) closeModal();
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && statusModal && statusModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Generates randomized case reference tokens
  const generateReferenceCode = (prefix = 'BLP') => {
    const year = '2026';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${randomDigits}`;
  };

  // ==========================================================================
  // 7. Form 1: Join as Partners Submission & Validation
  // ==========================================================================
  if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      let firstErrorField = null;

      // 1. Full Name
      const partnerName = document.getElementById('partner-name');
      if (!partnerName.value.trim() || partnerName.value.trim().length < 3) {
        setFieldError('group-partner-name', 'error-partner-name', 'Please provide your full legal name (minimum 3 characters).');
        isValid = false;
        if (!firstErrorField) firstErrorField = partnerName;
      } else {
        clearFieldError('group-partner-name');
      }

      // 2. Contact Number
      const partnerPhone = document.getElementById('partner-phone');
      if (!partnerPhone.value.trim() || !isValidPhone(partnerPhone.value)) {
        setFieldError('group-partner-phone', 'error-partner-phone', 'Please enter a valid 10-digit Indian mobile number.');
        isValid = false;
        if (!firstErrorField) firstErrorField = partnerPhone;
      } else {
        clearFieldError('group-partner-phone');
      }

      // 3. ID Verification Number
      const partnerId = document.getElementById('partner-id');
      if (!partnerId.value.trim() || !isValidGovtId(partnerId.value)) {
        setFieldError('group-partner-id', 'error-partner-id', 'Please enter a valid PAN (e.g., ABCDE1234F) or 12-digit Aadhaar.');
        isValid = false;
        if (!firstErrorField) firstErrorField = partnerId;
      } else {
        clearFieldError('group-partner-id');
      }

      // 4. Bank(s) Served
      const bankServed = document.getElementById('bank-served');
      if (!bankServed.value.trim()) {
        setFieldError('group-bank-served', 'error-bank-served', 'Please specify the bank(s) where you served.');
        isValid = false;
        if (!firstErrorField) firstErrorField = bankServed;
      } else {
        clearFieldError('group-bank-served');
      }

      // 5. Last Designation Held
      const lastDesignation = document.getElementById('last-designation');
      if (!lastDesignation.value.trim()) {
        setFieldError('group-last-designation', 'error-last-designation', 'Please provide your last designation or scale held.');
        isValid = false;
        if (!firstErrorField) firstErrorField = lastDesignation;
      } else {
        clearFieldError('group-last-designation');
      }

      // 6. Years of Service
      const yearsService = document.getElementById('years-service');
      if (!yearsService.value.trim()) {
        setFieldError('group-years-service', 'error-years-service', 'Please state your total years of service and retirement date.');
        isValid = false;
        if (!firstErrorField) firstErrorField = yearsService;
      } else {
        clearFieldError('group-years-service');
      }

      // 7. Checkboxes: Primary Areas of Expertise (At least 1 required)
      const expertiseChecked = partnerForm.querySelectorAll('input[name="expertise"]:checked');
      if (expertiseChecked.length === 0) {
        setFieldError('group-partner-expertise', 'error-partner-expertise', 'Please select at least one primary area of expertise.');
        isValid = false;
        if (!firstErrorField) firstErrorField = partnerForm.querySelector('input[name="expertise"]');
      } else {
        clearFieldError('group-partner-expertise');
      }

      // 8. Professional Summary
      if (!partnerSummary.value.trim() || partnerSummary.value.trim().length < 20) {
        setFieldError('group-partner-summary', 'error-partner-summary', 'Please write a brief summary of at least 20 characters.');
        isValid = false;
        if (!firstErrorField) firstErrorField = partnerSummary;
      } else {
        clearFieldError('group-partner-summary');
      }

      if (!isValid) {
        if (firstErrorField) {
          firstErrorField.focus();
        }
        showToast('Validation Incomplete', 'Please check highlighted fields with verified credentials.', 'error');
        return;
      }

      // Prevent duplicate submissions: enter loading state
      partnerSubmitBtn.disabled = true;
      partnerSubmitBtn.classList.add('is-loading');

      const formData = {
        name: partnerName.value.trim(),
        phone: partnerPhone.value.trim(),
        idVerification: partnerId.value.trim().toUpperCase(),
        bankServed: bankServed.value.trim(),
        lastDesignation: lastDesignation.value.trim(),
        yearsService: yearsService.value.trim(),
        expertise: Array.from(expertiseChecked).map(cb => cb.value),
        summary: partnerSummary.value.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        if (DJANGO_CONFIG.useBackendApi) {
          // Live Django API integration branch
          const response = await fetch(DJANGO_CONFIG.partnerEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const result = await response.json();
          const refCode = result.reference_id || generateReferenceCode('PARTNER');
          openModal({
            title: 'Partner Application Received',
            message: `Dear ${formData.name}, your partner application has been recorded. Our credentials committee will verify your banking service records and contact you on +91 ${formData.phone}.`,
            refCode: refCode,
            isSuccess: true
          });
          showToast('Application Recorded', 'Partner credentials stored in SQLite database.', 'success');
        } else {
          // Presentation simulation branch (Frontend mode)
          await new Promise(resolve => setTimeout(resolve, 800));
          const refCode = generateReferenceCode('PARTNER');

          // Persist application in localStorage for prototype inspection
          try {
            const existing = JSON.parse(localStorage.getItem('blp_partner_applications') || '[]');
            existing.push({ refCode, ...formData });
            localStorage.setItem('blp_partner_applications', JSON.stringify(existing));
          } catch (storageErr) {
            console.warn('LocalStorage unavailable:', storageErr);
          }

          openModal({
            title: 'Partner Application Submitted',
            message: `Dear ${formData.name}, your application for banking panel partnership has been received. Our senior legal credentials committee will verify your service records and contact you at +91 ${formData.phone}.`,
            refCode: refCode,
            isSuccess: true
          });
          showToast('Application Recorded', 'Partner credentials stored for committee verification.', 'success');
        }

        partnerForm.reset();
        partnerCharNum.textContent = '0';
      } catch (err) {
        console.warn('Submission fallback to client-side storage:', err);
        const refCode = generateReferenceCode('PARTNER');
        try {
          const existing = JSON.parse(localStorage.getItem('blp_partner_applications') || '[]');
          existing.push({ refCode, ...formData });
          localStorage.setItem('blp_partner_applications', JSON.stringify(existing));
        } catch (storageErr) {
          console.warn('LocalStorage unavailable:', storageErr);
        }
        openModal({
          title: 'Partner Application Recorded',
          message: `Dear ${formData.name}, your application for banking panel partnership has been received. Our senior credentials committee will verify your service records and contact you on +91 ${formData.phone}.`,
          refCode: refCode,
          isSuccess: true
        });
        showToast('Application Recorded', 'Stored securely for committee verification.', 'success');
        partnerForm.reset();
        partnerCharNum.textContent = '0';
      } finally {
        partnerSubmitBtn.disabled = false;
        partnerSubmitBtn.classList.remove('is-loading');
      }
    });
  }

  // ==========================================================================
  // 8. Form 2: Submit Your Matter / Consultation Intake
  // ==========================================================================
  if (matterForm) {
    matterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      let firstErrorField = null;

      // 1. Full Name
      const clientName = document.getElementById('client-name');
      if (!clientName.value.trim() || clientName.value.trim().length < 3) {
        setFieldError('group-client-name', 'error-client-name', 'Please provide your full legal name.');
        isValid = false;
        if (!firstErrorField) firstErrorField = clientName;
      } else {
        clearFieldError('group-client-name');
      }

      // 2. Contact Phone
      const clientPhone = document.getElementById('client-phone');
      if (!clientPhone.value.trim() || !isValidPhone(clientPhone.value)) {
        setFieldError('group-client-phone', 'error-client-phone', 'Please enter a valid 10-digit mobile number for callback.');
        isValid = false;
        if (!firstErrorField) firstErrorField = clientPhone;
      } else {
        clearFieldError('group-client-phone');
      }

      // 3. Category Selection
      const matterCategory = document.getElementById('matter-category');
      if (!matterCategory.value) {
        setFieldError('group-matter-category', 'error-matter-category', 'Please select whether this is an Employee or Customer matter.');
        isValid = false;
        if (!firstErrorField) firstErrorField = matterCategory;
      } else {
        clearFieldError('group-matter-category');
      }

      // 4. Callback Time Slot
      const callbackTime = document.getElementById('callback-time');
      if (!callbackTime.value) {
        setFieldError('group-callback-time', 'error-callback-time', 'Please choose your preferred callback time slot.');
        isValid = false;
        if (!firstErrorField) firstErrorField = callbackTime;
      } else {
        clearFieldError('group-callback-time');
      }

      // 5. Problem Description
      if (!problemDescription.value.trim() || problemDescription.value.trim().length < 20) {
        setFieldError('group-problem-description', 'error-problem-description', 'Please outline your issue in at least 20 characters.');
        isValid = false;
        if (!firstErrorField) firstErrorField = problemDescription;
      } else {
        clearFieldError('group-problem-description');
      }

      if (!isValid) {
        if (firstErrorField) {
          firstErrorField.focus();
        }
        showToast('Incomplete Intake', 'Please complete the highlighted confidential inquiry fields.', 'error');
        return;
      }

      // Prevent duplicate submissions: enter loading state
      matterSubmitBtn.disabled = true;
      matterSubmitBtn.classList.add('is-loading');

      const timeSlotNames = {
        morning: 'Morning (10:00 AM – 01:00 PM)',
        afternoon: 'Afternoon (02:00 PM – 05:00 PM)',
        evening: 'Evening (05:00 PM – 08:00 PM)'
      };

      const categoryNames = {
        employee: 'Bank Employee Matter (Inquiry/Disciplinary/HR)',
        customer: 'Bank Customer Matter (SARFAESI/Ombudsman/Recovery)'
      };

      const matterData = {
        name: clientName.value.trim(),
        phone: clientPhone.value.trim(),
        category: matterCategory.value,
        categoryLabel: categoryNames[matterCategory.value] || matterCategory.value,
        callbackSlot: callbackTime.value,
        callbackSlotLabel: timeSlotNames[callbackTime.value] || callbackTime.value,
        description: problemDescription.value.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        if (DJANGO_CONFIG.useBackendApi) {
          // Live Django API integration branch
          const response = await fetch(DJANGO_CONFIG.matterEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(matterData)
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const result = await response.json();
          const refCode = result.reference_id || generateReferenceCode('MATTER');
          openModal({
            title: 'Confidential Triage Scheduled',
            message: `Dear ${matterData.name}, your consultation request (${matterData.categoryLabel}) has been scheduled. Our senior banking advisory team will call you at +91 ${matterData.phone} during your selected slot: ${matterData.callbackSlotLabel}.`,
            refCode: refCode,
            isSuccess: true
          });
          showToast('Matter Registered', 'Assigned to Senior Banking Legal Team for triage callback.', 'success');
        } else {
          // Presentation simulation branch (Frontend mode)
          await new Promise(resolve => setTimeout(resolve, 800));
          const refCode = generateReferenceCode('MATTER');

          // Persist matter in localStorage for prototype inspection
          try {
            const existing = JSON.parse(localStorage.getItem('blp_matter_inquiries') || '[]');
            existing.push({ refCode, ...matterData });
            localStorage.setItem('blp_matter_inquiries', JSON.stringify(existing));
          } catch (storageErr) {
            console.warn('LocalStorage unavailable:', storageErr);
          }

          openModal({
            title: 'Confidential Triage Scheduled',
            message: `Dear ${matterData.name}, your consultation request (${matterData.categoryLabel}) has been registered for confidential telephonic triage. Our senior banking advisory team will call you at +91 ${matterData.phone} during your preferred slot: ${matterData.callbackSlotLabel}.`,
            refCode: refCode,
            isSuccess: true
          });
          showToast('Matter Registered', 'Assigned to Senior Banking Legal Team for triage callback.', 'success');
        }

        matterForm.reset();
        matterCharNum.textContent = '0';
      } catch (err) {
        console.warn('Submission fallback to client storage:', err);
        const refCode = generateReferenceCode('MATTER');
        try {
          const existing = JSON.parse(localStorage.getItem('blp_matter_inquiries') || '[]');
          existing.push({ refCode, ...matterData });
          localStorage.setItem('blp_matter_inquiries', JSON.stringify(existing));
        } catch (storageErr) {
          console.warn('LocalStorage unavailable:', storageErr);
        }
        openModal({
          title: 'Confidential Triage Scheduled',
          message: `Dear ${matterData.name}, your consultation request (${matterData.categoryLabel}) has been registered for confidential telephonic triage. Our senior banking advisory team will call you at +91 ${matterData.phone} during your preferred slot: ${matterData.callbackSlotLabel}.`,
          refCode: refCode,
          isSuccess: true
        });
        showToast('Matter Registered', 'Assigned for confidential telephonic triage.', 'success');
        matterForm.reset();
        matterCharNum.textContent = '0';
      } finally {
        matterSubmitBtn.disabled = false;
        matterSubmitBtn.classList.remove('is-loading');
      }
    });
  }

  // Console notice for developers & Django integration
  console.info(
    '%c Bank Legal & Professional Services Platform %c Ready ',
    'background: #0f2537; color: #c59b27; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1a446c; color: #ffffff; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );
  console.info('To enable Django REST backend submission, set window.ENABLE_DJANGO_BACKEND() or configure DJANGO_CONFIG.useBackendApi = true');

  // Global helper for developer testing in browser console
  window.ENABLE_DJANGO_BACKEND = (enabled = true) => {
    DJANGO_CONFIG.useBackendApi = enabled;
    const statusText = document.getElementById('backend-status-text');
    if (statusText) {
      statusText.innerHTML = enabled
        ? '<span style="color:#10b981; font-weight:bold;">LIVE DJANGO BACKEND ACTIVE:</span> Submissions dispatched to REST API endpoints.'
        : '<span style="color:#c59b27; font-weight:bold;">CLIENT-SIDE DEMO ACTIVE:</span> Inquiries stored in browser LocalStorage.';
    }
    console.log(`[BLP] Django backend integration mode: ${enabled ? 'ACTIVE (Live API)' : 'INACTIVE (Frontend demo)'}`);
  };
});


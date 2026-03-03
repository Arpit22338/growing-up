// ========================================
// Growing Up — Registration Flow JS
// ========================================

let currentStep = 1;

// CSRF Token from meta tag
var _csrfMeta = document.querySelector('meta[name="csrf-token"]');
var _csrf = _csrfMeta ? _csrfMeta.content : '';

// Profile picture preview (localStorage only)
function previewProfile(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById('profilePreview');
      img.src = e.target.result;
      img.style.display = 'block';
      document.getElementById('profileIcon').style.display = 'none';
      // Store in localStorage only
      localStorage.setItem('gu_profile_pic', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Load profile pic from localStorage
(function loadProfile() {
  const saved = localStorage.getItem('gu_profile_pic');
  if (saved) {
    const img = document.getElementById('profilePreview');
    if (img) {
      img.src = saved;
      img.style.display = 'block';
      const icon = document.getElementById('profileIcon');
      if (icon) icon.style.display = 'none';
    }
  }
})();

// Step navigation
function goToStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');

  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('stepDot' + i);
    const line = document.getElementById('stepLine' + i);
    
    dot.classList.remove('active', 'completed');
    if (i < step) dot.classList.add('completed');
    else if (i === step) dot.classList.add('active');

    if (line) {
      line.classList.remove('active', 'completed');
      if (i < step) line.classList.add('completed');
      else if (i === step) line.classList.add('active');
    }
  }

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Referral code validation (live) ----
let referralTimeout;
const referralInput = document.getElementById('referralCodeInput');
const referralInfo = document.getElementById('referralInfo');

if (referralInput && !referralInput.readOnly) {
  referralInput.addEventListener('input', function() {
    clearTimeout(referralTimeout);
    const code = this.value.trim();
    
    if (code.length < 4) {
      referralInfo.className = 'referral-info';
      referralInfo.innerHTML = '';
      referralInput.classList.remove('success', 'error');
      return;
    }

    referralTimeout = setTimeout(async () => {
      try {
        const res = await fetch('/api/validate-referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': _csrf },
          body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (data.valid) {
          referralInfo.className = 'referral-info show valid';
          referralInfo.innerHTML = '<i class="bx bx-check-circle"></i> Referred by: <strong>' + data.name + '</strong> (WhatsApp: ' + data.whatsapp + ')';
          referralInput.classList.add('success');
          referralInput.classList.remove('error');
        } else {
          referralInfo.className = 'referral-info show invalid';
          referralInfo.innerHTML = '<i class="bx bx-error-circle"></i> Invalid referral code';
          referralInput.classList.add('error');
          referralInput.classList.remove('success');
        }
      } catch (err) {
        referralInfo.className = 'referral-info show invalid';
        referralInfo.innerHTML = '<i class="bx bx-error-circle"></i> Error validating code';
      }
    }, 500);
  });
}

// Auto-validate if referral code is pre-filled
if (referralInput && referralInput.value.trim().length >= 4) {
  (async () => {
    try {
      const res = await fetch('/api/validate-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': _csrf },
        body: JSON.stringify({ code: referralInput.value.trim() })
      });
      const data = await res.json();
      if (data.valid) {
        referralInfo.className = 'referral-info show valid';
        referralInfo.innerHTML = '<i class="bx bx-check-circle"></i> Referred by: <strong>' + data.name + '</strong> (WhatsApp: ' + data.whatsapp + ')';
        referralInput.classList.add('success');
      }
    } catch (e) {}
  })();
}

// ---- STEP 1: Submit account info ----
document.getElementById('step1Form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('step1Btn');
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());

  // Basic validation
  if (!data.firstName || !data.lastName || !data.whatsapp || !data.email || !data.gender || !data.referralCode) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  try {
    const res = await fetch('/api/register/step1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': _csrf },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (result.success) {
      goToStep(2);
    } else {
      showToast(result.error || 'Something went wrong', 'error');
    }
  } catch (err) {
    showToast('Connection error. Please try again.', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = 'Continue to Payment <i class="bx bx-right-arrow-alt"></i>';
});

// Course selection - now driven by card click via selectRegCourse() in register.ejs
// The hidden #courseSelect input is updated by selectRegCourse()

// Screenshot preview
const screenshotInput = document.getElementById('screenshotInput');
if (screenshotInput) {
  screenshotInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const prev = document.getElementById('screenshotPreview');
        prev.src = e.target.result;
        prev.style.display = 'block';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
}

// ---- STEP 2: Payment submission ----
document.getElementById('step2Form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('step2Btn');

  const courseKey = document.getElementById('courseSelect').value;
  if (!courseKey) {
    showToast('Please select a course', 'error');
    return;
  }

  const fileInput = document.querySelector('#step2Form input[name="screenshot"]');
  if (!fileInput.files.length) {
    showToast('Payment screenshot is required', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Uploading...';

  const fd = new FormData(e.target);
  fd.append('courseKey', courseKey);
  fd.append('_csrf', _csrf);

  try {
    const res = await fetch('/api/register/step2', {
      method: 'POST',
      body: fd
    });
    const result = await res.json();

    if (result.success) {
      goToStep(3);
    } else {
      showToast(result.error || 'Upload failed', 'error');
    }
  } catch (err) {
    showToast('Connection error. Please try again.', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = 'Continue to Set Password <i class="bx bx-right-arrow-alt"></i>';
});

// ---- STEP 3: Password ----
document.getElementById('step3Form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('step3Btn');
  const fd = new FormData(e.target);
  const password = fd.get('password');
  const confirm = fd.get('confirmPassword');

  if (password !== confirm) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account...';

  try {
    const res = await fetch('/api/register/step3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': _csrf },
      body: JSON.stringify({ password })
    });
    const result = await res.json();

    if (result.success) {
      goToStep(4);
    } else {
      showToast(result.error || 'Registration failed', 'error');
    }
  } catch (err) {
    showToast('Connection error. Please try again.', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="bx bx-check-circle"></i> Create Account';
});

// Radio button styling
document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
    if (this.checked) {
      this.closest('.radio-option').classList.add('selected');
    }
  });
});

// Seraphina Studio — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Booking form handling
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());
      
      // Basic validation
      const required = ['fullName', 'email', 'whatsapp', 'destination', 'serviceCategory', 'serviceType', 'preferredDate'];
      let valid = true;
      
      required.forEach(field => {
        const input = bookingForm.querySelector(`[name="${field}"]`);
        if (input && !input.value.trim()) {
          input.classList.add('border-red-400');
          valid = false;
        } else if (input) {
          input.classList.remove('border-red-400');
        }
      });
      
      if (!valid) {
        showFormMessage('Please complete all required fields.', 'error');
        return;
      }
      
      // Email validation
      const email = data.email;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      // Build WhatsApp message as primary delivery (no backend configured yet)
      const message = buildWhatsAppMessage(data);
      const waUrl = `https://wa.me/447481317469?text=${encodeURIComponent(message)}`;
      
      // Show success and open WhatsApp
      showFormMessage('Thank you for contacting Seraphina Studio. Your enquiry has been prepared. We will review your requested service, destination, and date and confirm availability and pricing before finalising your booking.', 'success');
      
      // Open WhatsApp after short delay
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);
      
      // Optionally reset form
      // bookingForm.reset();
    });
  }

  // Service category change – show relevant note
  const serviceSelect = document.getElementById('serviceCategory');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const note = document.getElementById('service-price-note');
      if (note) {
        const val = serviceSelect.value;
        const notes = {
          'Flying-Dress Photoshoot': 'Starting from €180–€290 depending on package.',
          'Flying-Dress Videography': 'Starting from €150–€250.',
          'Flying-Dress Photo + Video': 'Starting from €300–€350.',
          'Wedding Photography': 'Starting from €500.',
          'Wedding Videography': 'Starting from €500.',
          'Wedding Photo + Video': 'Starting from €900.',
          'Engagement or Proposal': 'Starting from €250.',
          'Birthday or Celebration': 'Starting from €100–€150.',
          'Family or Couple Photoshoot': 'Starting from €120–€180.',
          'Fashion or Modelling': 'Starting from €200.',
          'Corporate Photography or Videography': 'Packages from €100.',
          'Destination Experience': 'Pricing confirmed after destination review.',
          'Other': 'Please describe your requirements.'
        };
        note.textContent = notes[val] || '';
        note.classList.toggle('hidden', !notes[val]);
      }
    });
  }
});

function showFormMessage(text, type) {
  const el = document.getElementById('form-message');
  if (!el) return;
  el.textContent = text;
  el.className = `mt-4 p-4 rounded-sm text-sm ${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function buildWhatsAppMessage(data) {
  return `Hello Seraphina Studio, I would like to enquire about booking a photography or videography experience.

Full Name: ${data.fullName || ''}
Email: ${data.email || ''}
WhatsApp: ${data.whatsapp || ''}
Preferred Destination: ${data.destination || ''}
Service Category: ${data.serviceCategory || ''}
Photography / Videography / Both: ${data.serviceType || ''}
Preferred Date: ${data.preferredDate || ''}
Number of People: ${data.numberOfPeople || ''}
Preferred Dress Colour: ${data.dressColour || 'N/A'}
Preferred Package: ${data.preferredPackage || ''}
Additional Requirements: ${data.additionalRequirements || ''}

Please confirm availability, package inclusions, and the total price.`;
}

// Utility: prefill destination from URL hash or query
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

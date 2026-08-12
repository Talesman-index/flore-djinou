/**
 * FLORE DJINOU — PERSONAL BRANDING MULTI-PAGE INTERACTIVE & MOTION JS (STABLE & BUG-FREE)
 */

// Clean up any stale or rogue Service Worker registered on localhost (e.g. EasyManaging PWA cache)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((unregistered) => {
        if (unregistered) {
          console.warn('[Cleanup] Unregistered stale Service Worker:', registration);
          window.location.reload();
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavLink();
  initNavbarScroll();
  initCounters();
  initTabs();
  initFilters();
  initModal();
  initForm();
  initAutoScrollReveals();
  initScrollReveals();
});

/* 1. Active Navigation Link Handler */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open') ? 'ri-close-line' : 'ri-menu-line';
      }
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-line';
      });
    });
  }
}

/* 2. Number Counter Animation */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observerOptions = { threshold: 0.3 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        let count = 0;
        const timer = setInterval(() => {
          count += Math.ceil(targetVal / 30);
          if (count >= targetVal) {
            count = targetVal;
            clearInterval(timer);
          }
          target.innerHTML = `${prefix}${count}<span>${suffix}</span>`;
        }, 35);
        obs.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

/* 3. Biography Tabs Switcher */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/* 4. Programs Category Filter */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      programCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. Program Detail Modal Handler */
function initModal() {
  const modalOverlay = document.querySelector('.modal-overlay, .modal-backdrop, #program-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const modalTitle = document.getElementById('modal-program-title');

  const openBtns = document.querySelectorAll('.open-modal-btn, .open-program-modal');
  if (!openBtns.length) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const progTitle = btn.getAttribute('data-program') || 'Programme d\'Excellence';
      
      if (modalTitle) modalTitle.textContent = progTitle;
      if (modalOverlay) {
        modalOverlay.classList.add('open');
        modalOverlay.style.display = 'flex';
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.remove('open');
        modalOverlay.style.display = 'none';
      }
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
        modalOverlay.style.display = 'none';
      }
    });
  }
}

/* 6. Form Submission Simulation */
function initForm() {
  const contactForm = document.getElementById('contact-form') || document.getElementById('main-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';

    if (btn) {
      btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Traitement en cours...`;
      btn.disabled = true;
    }

    setTimeout(() => {
      if (formFeedback) {
        formFeedback.style.display = 'block';
      } else if (btn) {
        btn.innerHTML = `<i class="ri-check-line"></i> Message Envoyé avec succès !`;
        btn.style.background = 'linear-gradient(135deg, #2EA043 0%, #238636 100%)';
        btn.style.color = '#FFF';
      }

      contactForm.reset();

      setTimeout(() => {
        if (btn) {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }
        if (formFeedback) formFeedback.style.display = 'none';
      }, 4000);
    }, 1000);
  });
}

/* 7. Automatic Framer-Motion Classes Injection */
function initAutoScrollReveals() {
  // Headings & Statements
  document.querySelectorAll('.statement-title-large, .section-title, .about-card-large, .signature-profile-card').forEach(el => {
    if (!el.classList.contains('reveal-fade-up')) el.classList.add('reveal-fade-up');
  });

  // Action Cards & Objectives
  document.querySelectorAll('.action-card, .objective-card').forEach((el, index) => {
    if (!el.classList.contains('reveal-scale-up')) {
      el.classList.add('reveal-scale-up');
      el.classList.add(`stagger-${(index % 4) + 1}`);
    }
  });

  // Programs, Events & Voice Cards
  document.querySelectorAll('.program-card, .event-card, .voice-card, .partner-card').forEach((el, index) => {
    if (!el.classList.contains('reveal-fade-up')) {
      el.classList.add('reveal-fade-up');
      el.classList.add(`stagger-${(index % 4) + 1}`);
    }
  });
}

/* 8. IntersectionObserver Scroll Reveal Handler */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-scale-up, .reveal-slide-right');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Script loaded successfully');

    // DOM Elements
    const elements = {
      navMenu: document.getElementById('nav-menu'),
      hamburger: document.querySelector('.hamburger'),
      ctaButtons: document.querySelectorAll('.cta-btn, .floating-cta'),
      popup: document.getElementById('ctaPopup'),
      closePopup: document.querySelector('.close-popup'),
      shareBtn: document.querySelector('.share-btn'),
      megaDonorGrid: document.getElementById('megaDonorGrid'),
      donorList: document.getElementById('donorList'),
      searchInput: document.getElementById('searchInput'),
      filterButtons: document.querySelectorAll('.filter-btn'),
      brandSelect: document.getElementById('brandSelect'),
      pledgeText: document.getElementById('pledge-text'),
      shareX: document.getElementById('shareX'),
      shareFacebook: document.getElementById('shareFacebook'),
      copyPledge: document.querySelector('.copy-pledge'),
      volunteerForm: document.getElementById('volunteer-form'),
      newsletterForm: document.getElementById('newsletter-form'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText'),
    };

    // Data
    const GOAL = 1_000_000_000;
    let pledgeCounts = JSON.parse(localStorage.getItem('pledgeCounts')) || {};

    // Initialize
    fetch('data/donors.json')
      .then((res) => res.json())
      .then((data) => {
        window.megaDonors = data.megaDonors;
        window.donors = data.donors;
        init();
      })
      .catch((e) => {
        console.error('Failed to load donor data:', e);
        init(); // Proceed with fallback content
      });

    function init() {
      animateSections();
      setupNavigation();
      setupCtaPopup();
      updateProgress();
      renderMegaDonors();
      renderDonors();
      setupSearchAndFilter();
      setupPledge();
      setupForms();
      populateBrandSelect();
    }

    function animateSections() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll('.section-animate').forEach((section) => observer.observe(section));
    }

    function setupNavigation() {
      elements.hamburger.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show');
        elements.hamburger.setAttribute('aria-expanded', elements.navMenu.classList.contains('show'));
      });
    }

    function setupCtaPopup() {
      elements.ctaButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          elements.popup.style.display = 'flex';
          elements.popup.removeAttribute('hidden');
          elements.popup.focus();
        });
      });
      elements.closePopup.addEventListener('click', () => {
        elements.popup.style.display = 'none';
        elements.popup.setAttribute('hidden', '');
      });
      elements.shareBtn.addEventListener('click', () => {
        elements.popup.style.display = 'none';
        elements.popup.setAttribute('hidden', '');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 70, colors: ['#d32f2f', '#ffffff', '#212121'] });
        }
      });
    }

    function updateProgress() {
      const totalImpact = Object.values(pledgeCounts).reduce((sum, val) => sum + val, 0) * 1_000_000;
      const progressPercent = Math.min((totalImpact / GOAL) * 100, 100);
      elements.progressFill.style.setProperty('--progress-width', `${progressPercent}%`);
      elements.progressText.textContent = `$${totalImpact.toLocaleString()} of $${GOAL.toLocaleString()} Goal`;
    }

    function renderMegaDonors() {
      if (!window.megaDonors) return; // Use fallback HTML if data fails
      elements.megaDonorGrid.innerHTML = window.megaDonors
        .map(
          (donor) => `
        <article class="donor">
          <picture class="donor-picture">
            <source srcset="${donor.image}" type="image/webp">
            <img src="${donor.imageFallback}" alt="${donor.name}" loading="lazy" width="300" height="200">
          </picture>
          <h3>${donor.id}. ${donor.name}</h3>
          <p><strong>Contribution:</strong> ${donor.contribution}</p>
          <p><strong>Boycott:</strong> ${donor.boycott}</p>
          <p><strong>Alternative:</strong> <a href="${donor.alternativeUrl}" target="_blank">${donor.alternative}</a></p>
        </article>
      `
        )
        .join('');
    }

    function renderDonors(filter = 'all', search = '') {
      elements.donorList.innerHTML = '';
      if (!window.donors) {
        elements.donorList.innerHTML = '<p>Donor data unavailable. Please try again later.</p>';
        return;
      }
      const filteredDonors = window.donors.filter((donor) => {
        const matchesFilter = filter === 'all' || donor.category === filter;
        const matchesSearch =
          donor.name.toLowerCase().includes(search.toLowerCase()) ||
          donor.brands.some((brand) => brand.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
      });

      if (filteredDonors.length === 0) {
        elements.donorList.innerHTML = '<p>No donors found.</p>';
        return;
      }

      filteredDonors.forEach((donor) => {
        const donorCard = document.createElement('article');
        donorCard.classList.add('donor');
        donorCard.innerHTML = `
          <picture class="donor-picture">
            <source srcset="${donor.image}" type="image/webp">
            <img src="${donor.imageFallback}" alt="${donor.name}" loading="lazy" width="300" height="200">
          </picture>
          <h3>${donor.name}</h3>
          <p><strong>Category:</strong> ${donor.category.charAt(0).toUpperCase() + donor.category.slice(1)}</p>
          <p><strong>Brands:</strong> ${donor.brands.join(', ')}</p>
          <p><strong>Donation:</strong> ${donor.donation}</p>
          <p><strong>Alternatives:</strong> ${donor.alternatives.join(', ')}</p>
        `;
        elements.donorList.appendChild(donorCard);
      });
    }

    function setupSearchAndFilter() {
      let debounceTimeout;
      elements.searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
          renderDonors(activeFilter, elements.searchInput.value);
        }, 300);
      });

      elements.filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          elements.filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderDonors(btn.dataset.filter, elements.searchInput.value);
        });
      });
    }

    function populateBrandSelect() {
      if (!window.megaDonors || !window.donors) return;
      const allDonors = [...window.megaDonors, ...window.donors];
      elements.brandSelect.innerHTML =
        '<option value="">Select a Brand</option>' +
        allDonors
          .map((donor) => {
            const boycott = donor.boycott || donor.brands[0];
            const alternative = donor.alternative || donor.alternatives[0];
            return `<option value="${boycott}|${alternative}">${boycott}</option>`;
          })
          .join('');
    }

    function setupPledge() {
      elements.brandSelect.addEventListener('change', () => {
        const [brand, alternative] = elements.brandSelect.value.split('|');
        if (brand && alternative) {
          elements.pledgeText.textContent = `I pledge to boycott ${brand} and support ${alternative}! #BoycottTrumpDonors`;
          elements.shareX.href = `https://x.com/intent/tweet?text=${encodeURIComponent(elements.pledgeText.textContent)}`;
          elements.shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;

          pledgeCounts[brand] = (pledgeCounts[brand] || 0) + 1;
          localStorage.setItem('pledgeCounts', JSON.stringify(pledgeCounts));
          updateProgress();

          if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, colors: ['#d32f2f', '#ffffff', '#212121'] });
          }
        } else {
          elements.pledgeText.textContent = 'Select a brand to ignite your pledge.';
        }
      });

      elements.copyPledge.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.pledgeText.textContent).then(() => {
          alert('Pledge copied to clipboard!');
        });
      });
    }

    function setupForms() {
      elements.volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('volunteer-name').value;
        const email = document.getElementById('volunteer-email').value;
        if (name && email) {
          alert(`Thank you, ${name}! We'll reach out soon.`);
          elements.volunteerForm.reset();
        }
      });

      elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
          alert('Thank you for subscribing!');
          elements.newsletterForm.reset();
        }
      });
    }
  } catch (e) {
    console.error('Script error:', e);
    document.querySelectorAll('.section-animate').forEach((section) => {
      section.classList.add('visible');
    });
  }
});

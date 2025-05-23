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

    // Static Fallback Data
    const fallbackDonors = [
      {
        name: 'Koch Industries',
        category: 'energy',
        brands: ['Georgia-Pacific', 'Molex'],
        donation: '$5M+',
        alternatives: ['NextEra Energy'],
        image: 'images/koch.webp',
        imageFallback: 'images/koch.jpg',
      },
      {
        name: 'Blackstone Group',
        category: 'finance',
        brands: ['Hilton Hotels'],
        donation: '$3M+',
        alternatives: ['Marriott'],
        image: 'images/blackstone.webp',
        imageFallback: 'images/blackstone.jpg',
      },
    ];

    let pledgeCounts = JSON.parse(localStorage.getItem('pledgeCounts')) || {};
    const GOAL = 1_000_000_000;

    // Initialize
    init();

    function init() {
      animateSections();
      setupNavigation();
      setupCtaPopup();
      updateProgress();
      renderDonors(fallbackDonors); // Use fallback data
      setupSearchAndFilter();
      setupPledge();
      setupForms();
      loadDynamicData();
    }

    function animateSections() {
      document.querySelectorAll('.section-animate').forEach((section) => {
        section.classList.add('visible');
      });
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
        });
      });
      elements.closePopup.addEventListener('click', () => {
        elements.popup.style.display = 'none';
        elements.popup.setAttribute('hidden', '');
      });
      elements.shareBtn.addEventListener('click', () => {
        elements.popup.style.display = 'none';
        elements.popup.setAttribute('hidden', '');
      });
    }

    function updateProgress() {
      const totalImpact = Object.values(pledgeCounts).reduce((sum, val) => sum + val, 0) * 1_000_000;
      const progressPercent = Math.min((totalImpact / GOAL) * 100, 100);
      elements.progressFill.style.width = `${progressPercent}%`;
      elements.progressText.textContent = `$${totalImpact.toLocaleString()} of $${GOAL.toLocaleString()} Goal`;
    }

    function renderDonors(donors, filter = 'all', search = '') {
      elements.donorList.innerHTML = '';
      const filteredDonors = donors.filter((donor) => {
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
            <img src="${donor.imageFallback}" alt="${donor.name}" loading="lazy" width="280" height="180">
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
      elements.searchInput.addEventListener('input', () => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderDonors(fallbackDonors, activeFilter, elements.searchInput.value);
      });

      elements.filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          elements.filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderDonors(fallbackDonors, btn.dataset.filter, elements.searchInput.value);
        });
      });
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
        }
      });

      elements.copyPledge.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.pledgeText.textContent).then(() => {
          alert('Pledge copied!');
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

    function loadDynamicData() {
      fetch('data/donors.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load donors.json');
          return res.json();
        })
        .then((data) => {
          renderDonors(data.donors);
        })
        .catch((e) => {
          console.error('Error loading donor data:', e);
        });
    }
  } catch (e) {
    console.error('Script error:', e);
    document.querySelectorAll('.section-animate').forEach((section) => {
      section.classList.add('visible');
    });
  }
});

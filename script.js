// script.js
import { donors } from './data/donors.js';

document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const ctaButtons = document.querySelectorAll('.cta-btn, .floating-cta');
    const popup = document.getElementById('ctaPopup');
    const closePopup = document.querySelector('.close-popup');
    const shareBtn = document.querySelector('.share-btn');
    const donorList = document.getElementById('donorList');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandSelect = document.getElementById('brandSelect');
    const pledgeText = document.getElementById('pledge-text');
    const shareX = document.getElementById('shareX');
    const shareFacebook = document.getElementById('shareFacebook');
    const shareWhatsApp = document.getElementById('shareWhatsApp');
    const shareEmail = document.getElementById('shareEmail');
    const copyPledge = document.querySelector('.copy-pledge');
    const volunteerForm = document.getElementById('volunteer-form');
    const resetBtn = document.querySelector('.reset-btn');
    const boycottCount = document.getElementById('boycottCount');
    const pledgeCount = document.getElementById('pledgeCount');
    const globalImpact = document.getElementById('globalImpact');
    const boycottDays = document.getElementById('boycott-days');
    const brandsBoycotted = document.getElementById('brands-boycotted');
    const estimatedImpact = document.getElementById('estimated-impact');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    let voteData = JSON.parse(localStorage.getItem('voteData')) || {};

    // Navigation Toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('show'));
    });

    // CTA Popup
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            popup.style.display = 'flex';
            popup.removeAttribute('hidden');
            popup.querySelector('p').textContent = `You’ve joined ${parseInt(pledgeCount.textContent).toLocaleString()} activists! Share your pledge!`;
        });
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
        popup.setAttribute('hidden', '');
    });

    shareBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        popup.setAttribute('hidden', '');
        brandSelect.focus();
    });

    // Render Donors
    function renderDonors(filter = 'all', search = '') {
        donorList.innerHTML = '';
        const filteredDonors = donors.filter(donor => {
            const matchesFilter = filter === 'all' || donor.category === filter;
            const matchesSearch = donor.name.toLowerCase().includes(search.toLowerCase()) ||
                                 donor.brands.some(brand => brand.toLowerCase().includes(search.toLowerCase()));
            return matchesFilter && matchesSearch;
        });

        filteredDonors.forEach(donor => {
            const donorCard = document.createElement('article');
            donorCard.classList.add('donor');
            donorCard.setAttribute('role', 'listitem');
            donorCard.innerHTML = `
                <picture>
                    <source srcset="${donor.image}" type="image/webp">
                    <img src="${donor.image.replace('.webp', '.jpg')}" alt="${donor.name} related image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516321310764-4b387f0fd760';">
                </picture>
                <h3>${donor.name}</h3>
                <p><strong>Category:</strong> ${donor.category.charAt(0).toUpperCase() + donor.category.slice(1)}</p>
                <p><strong>Brands:</strong> ${donor.brands.join(', ')}</p>
                <p><strong>Donation:</strong> ${donor.donation}</p>
                <span class="warning">${donor.warning}</span>
                <p><strong>Alternatives:</strong> ${donor.alternatives.join(', ')}</p>
                <div class="donor-overlay" aria-hidden="true">
                    <p>Boycott ${donor.brands[0]} to disrupt their influence!</p>
                </div>
            `;
            donorList.appendChild(donorCard);
        });
    }

    renderDonors();

    // Search and Filter
    searchInput.addEventListener('input', () => {
        renderDonors(document.querySelector('.filter-btn.active').dataset.filter, searchInput.value);
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDonors(btn.dataset.filter, searchInput.value);
        });
    });

    // Pledge Generator with Confetti
    brandSelect.addEventListener('change', () => {
        const [brand, alternative] = brandSelect.value.split('|');
        if (brand && alternative) {
            pledgeText.textContent = `I pledge to boycott ${brand} and support ${alternative} to fight corporate greed! #BoycottTrumpDonors`;
            shareX.href = `https://x.com/intent/tweet?text=${encodeURIComponent(pledgeText.textContent)}`;
            shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(pledgeText.textContent)}`;
            shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(pledgeText.textContent + ' ' + window.location.href)}`;
            shareEmail.href = `mailto:?subject=My Boycott Pledge&body=${encodeURIComponent(pledgeText.textContent + '\nJoin me: ' + window.location.href)}`;

            // Confetti Animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e74c3c', '#e67e22', '#ffffff']
            });

            voteData[brand] = (voteData[brand] || 0) + 1;
            localStorage.setItem('voteData', JSON.stringify(voteData));
            updateChart();
            updatePledgeCount();
            updateBoycottCount();
            updateGlobalImpact();
            updateProgressBar();
        } else {
            pledgeText.textContent = 'Select a brand to generate your pledge.';
        }
    });

    copyPledge.addEventListener('click', () => {
        navigator.clipboard.writeText(pledgeText.textContent).then(() => {
            alert('Pledge copied to clipboard!');
        });
    });

    // Volunteer Form with Animation
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('volunteer-name').value;
        const email = document.getElementById('volunteer-email').value;
        const location = document.getElementById('volunteer-location').value;
        if (name && email && location) {
            volunteerForm.classList.add('submitted');
            setTimeout(() => {
                alert(`Thank you, ${name}! We'll contact you at ${email} for opportunities in ${location}.`);
                volunteerForm.reset();
                volunteerForm.classList.remove('submitted');
            }, 500);
        } else {
            document.querySelectorAll('.form-group input').forEach(input => {
                if (!input.value) {
                    input.nextElementSibling.removeAttribute('hidden');
                } else {
                    input.nextElementSibling.setAttribute('hidden', '');
                }
            });
        }
    });

    // Progress Tracker
    function updateProgress() {
        const startDate = localStorage.getItem('boycottStartDate');
        const boycottedBrands = JSON.parse(localStorage.getItem('boycottedBrands')) || [];
        if (startDate) {
            const days = Math.floor((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24));
            boycottDays.textContent = days;
            brandsBoycotted.textContent = boycottedBrands.length;
            estimatedImpact.textContent = `$${boycottedBrands.length * days * 10}`;
        }
    }

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('boycottStartDate');
        localStorage.removeItem('boycottedBrands');
        boycottDays.textContent = '0';
        brandsBoycotted.textContent = '0';
        estimatedImpact.textContent = '$0';
    });

    // Chart
    const ctx = document.getElementById('voteChart').getContext('2d');
    const voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(voteData),
            datasets: [{
                label: 'Boycott Votes',
                data: Object.values(voteData),
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Boycott Votes by Brand' }
            }
        }
    });

    function updateChart() {
        voteChart.data.labels = Object.keys(voteData);
        voteChart.data.datasets[0].data = Object.values(voteData);
        voteChart.update();
    }

    // Boycott Count
    function updateBoycottCount() {
        const totalBoycotts = Object.values(voteData).reduce((sum, val) => sum + val, 0);
        boycottCount.textContent = totalBoycotts.toLocaleString();
    }

    // Pledge Count
    function updatePledgeCount() {
        const totalPledges = Object.values(voteData).reduce((sum, val) => sum + val, 0);
        pledgeCount.textContent = totalPledges.toLocaleString();
    }

    // Global Impact
    function updateGlobalImpact() {
        const totalPledges = Object.values(voteData).reduce((sum, val) => sum + val, 0);
        globalImpact.textContent = `$${totalPledges * 1000}`;
    }

    // Progress Bar
    function updateProgressBar() {
        const totalPledges = Object.values(voteData).reduce((sum, val) => sum + val, 0);
        const goal = 1000000000; // $1B
        const impact = totalPledges * 1000;
        const percentage = Math.min((impact / goal) * 100, 100);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `$${impact.toLocaleString()} of $1B Goal`;
    }

    // Section Scroll Animations
    const sections = document.querySelectorAll('.section-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    updateProgress();
    updatePledgeCount();
    updateBoycottCount();
    updateGlobalImpact();
    updateProgressBar();
    setInterval(updateProgress, 24 * 60 * 60 * 1000); // Update daily
});

// script.js
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Script loaded successfully');
        const donors = [
            {
                name: "Koch Industries",
                category: "energy",
                brands: ["Georgia-Pacific", "Molex"],
                donation: "$5M+",
                warning: "Funds anti-climate lobbying",
                alternatives: ["NextEra Energy"],
                image: "images/koch.webp"
            },
            {
                name: "Blackstone Group",
                category: "finance",
                brands: ["Hilton Hotels"],
                donation: "$3M+",
                warning: "Backs tax cuts",
                alternatives: ["Marriott"],
                image: "images/blackstone.webp"
            },
            {
                name: "Wynn Resorts",
                category: "casino",
                brands: ["Wynn Las Vegas"],
                donation: "$2M+",
                warning: "Supports gambling deregulation",
                alternatives: ["MGM Resorts"],
                image: "images/wynn.webp"
            },
            {
                name: "Chevron",
                category: "energy",
                brands: ["Texaco"],
                donation: "$1.5M+",
                warning: "Pushes fossil fuel expansion",
                alternatives: ["Shell Renewables"],
                image: "images/chevron.webp"
            },
            {
                name: "Walmart",
                category: "retail",
                brands: ["Sam’s Club"],
                donation: "$1M+",
                warning: "Funds anti-labor policies",
                alternatives: ["Target"],
                image: "images/walmart.webp"
            },
            {
                name: "Continental Resources",
                category: "energy",
                brands: ["Continental Oil"],
                donation: "$1M+",
                warning: "Backs fracking expansion",
                alternatives: ["Ørsted"],
                image: "images/continental.webp"
            }
        ];

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
        let voteData = JSON.parse(localStorage.getItem('voteData')) || {};

        // Force content visibility
        document.querySelectorAll('.section-animate').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });

        // Navigation
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('show'));
        });

        // CTA Popup
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                popup.style.display = 'flex';
                popup.removeAttribute('hidden');
            });
        });

        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
            popup.setAttribute('hidden', '');
        });

        shareBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            popup.setAttribute('hidden', '');
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

            if (filteredDonors.length === 0) {
                donorList.innerHTML = '<p>No donors found.</p>';
            }

            filteredDonors.forEach(donor => {
                const donorCard = document.createElement('article');
                donorCard.classList.add('donor');
                donorCard.innerHTML = `
                    <picture>
                        <source srcset="${donor.image}" type="image/webp">
                        <img src="${donor.image.replace('.webp', '.jpg')}" alt="${donor.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516321310764-4b387f0fd760';">
                    </picture>
                    <h3>${donor.name}</h3>
                    <p><strong>Category:</strong> ${donor.category.charAt(0).toUpperCase() + donor.category.slice(1)}</p>
                    <p><strong>Brands:</strong> ${donor.brands.join(', ')}</p>
                    <p><strong>Donation:</strong> ${donor.donation}</p>
                    <p><strong>Alternatives:</strong> ${donor.alternatives.join(', ')}</p>
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

        // Pledge
        brandSelect.addEventListener('change', () => {
            const [brand, alternative] = brandSelect.value.split('|');
            if (brand && alternative) {
                pledgeText.textContent = `I pledge to boycott ${brand} and support ${alternative}! #BoycottTrumpDonors`;
                shareX.href = `https://x.com/intent/tweet?text=${encodeURIComponent(pledgeText.textContent)}`;
                shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(pledgeText.textContent + ' ' + window.location.href)}`;
                shareEmail.href = `mailto:?subject=My Pledge&body=${encodeURIComponent(pledgeText.textContent)}`;

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        colors: ['#d4a017', '#bdc3c7', '#2c3e50']
                    });
                }

                voteData[brand] = (voteData[brand] || 0) + 1;
                localStorage.setItem('voteData', JSON.stringify(voteData));
            }
        });

        copyPledge.addEventListener('click', () => {
            navigator.clipboard.writeText(pledgeText.textContent).then(() => {
                alert('Pledge copied!');
            });
        });

        // Volunteer Form
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('volunteer-name').value;
            const email = document.getElementById('volunteer-email').value;
            if (name && email) {
                alert(`Thank you, ${name}!`);
                volunteerForm.reset();
            }
        });

    } catch (e) {
        console.error('Script error:', e);
        document.querySelectorAll('.section-animate').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }
});

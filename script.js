document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Script loaded successfully');
        const donors = [
            {
                name: "Koch Industries",
                category: "energy",
                brands: ["Georgia-Pacific", "Molex"],
                donation: "$5M+",
                alternatives: ["NextEra Energy"],
                image: "images/koch.webp"
            },
            {
                name: "Blackstone Group",
                category: "finance",
                brands: ["Hilton Hotels"],
                donation: "$3M+",
                alternatives: ["Marriott"],
                image: "images/blackstone.webp"
            },
            {
                name: "Chevron",
                category: "energy",
                brands: ["Texaco"],
                donation: "$1.5M+",
                alternatives: ["Shell Renewables"],
                image: "images/chevron.webp"
            },
            {
                name: "Continental Resources",
                category: "energy",
                brands: ["Continental Oil"],
                donation: "$1M+",
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
        const copyPledge = document.querySelector('.copy-pledge');
        const volunteerForm = document.getElementById('volunteer-form');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
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

        // Progress Bar
        let totalImpact = Object.values(voteData).reduce((sum, val) => sum + val, 0) * 1000000;
        const goal = 1000000000;
        const progressPercent = Math.min((totalImpact / goal) * 100, 100);
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `$${totalImpact.toLocaleString()} of $1B Goal`;

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
                        <img src="${donor.image.replace('.webp', '.jpg')}" alt="${donor.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516321310764-4b387f0fd760?auto=format&fit=crop&w=300'; this.onerror='this.src=\"https://via.placeholder.com/300x200\";'">
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

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        colors: ['#d32f2f', '#ffffff', '#212121']
                    });
                }

                voteData[brand] = (voteData[brand] || 0) + 1;
                localStorage.setItem('voteData', JSON.stringify(voteData));

                totalImpact = Object.values(voteData).reduce((sum, val) => sum + val, 0) * 1000000;
                const progressPercent = Math.min((totalImpact / goal) * 100, 100);
                progressFill.style.width = `${progressPercent}%`;
                progressText.textContent = `$${totalImpact.toLocaleString()} of $1B Goal`;
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

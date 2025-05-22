// script.js
import donors from './data/donors.js';

// State management
const state = {
    votes: JSON.parse(localStorage.getItem('boycottVotes')) || {},
    boycottedBrands: JSON.parse(localStorage.getItem('boycottedBrands')) || [],
    boycottDays: parseInt(localStorage.getItem('boycottDays')) || 0,
    leaderboard: JSON.parse(localStorage.getItem('leaderboard')) || [],
};

// Debounce function for search
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Render donors
function renderDonors(filter = 'all', searchTerm = '') {
    const donorList = document.getElementById('donorList');
    donorList.innerHTML = '';

    donors
        .filter(donor => filter === 'all' || donor.category === filter)
        .filter(donor => donor.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach(donor => {
            const donorCard = document.createElement('article');
            donorCard.className = 'donor';
            donorCard.dataset.brand = donor.brand;
            donorCard.dataset.category = donor.category;
            donorCard.setAttribute('role', 'listitem');
            donorCard.innerHTML = `
                <picture>
                    <source srcset="${donor.image.webp}" type="image/webp">
                    <img src="${donor.image.jpg}" alt="${donor.alt}" loading="lazy" onerror="this.src='images/fallback.jpg';">
                </picture>
                <span class="warning" aria-label="Mega Donor Warning">MEGA DONOR</span>
                <h3>${donor.brand}</h3>
                <p>${donor.description}</p>
                <h4>Why Boycott?</h4>
                <p>${donor.whyBoycott}</p>
                <h4>Switch to These Alternatives:</h4>
                <ul>
                    ${donor.alternatives.map(alt => `
                        <li data-category="${alt.category}">
                            <a href="${alt.url}" target="_blank" aria-label="Switch to ${alt.name}">${alt.name}</a>
                        </li>
                    `).join('')}
                </ul>
                <button class="boycott-btn" data-brand="${donor.brand}" aria-label="Vote to boycott ${donor.brand}">
                    <i class="fas fa-thumbs-down"></i> Boycott Now!
                </button>
                <p>Votes: <span id="vote-${donor.brand}">${state.votes[donor.brand] || 0}</span></p>
            `;
            donorList.appendChild(donorCard);
        });
}

// Update leaderboard
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = state.leaderboard.length
        ? state.leaderboard
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 5)
              .map(user => `<p>${user.name}: ${user.votes} votes</p>`)
              .join('')
        : '<p>No leaderboard data yet. Be the first to lead!</p>';
}

// Update UI
function updateUI() {
    const totalVotes = Object.values(state.votes).reduce((sum, count) => sum + count, 0);
    document.getElementById('pledgeCount').textContent = totalVotes;
    document.getElementById('brands-boycotted').textContent = state.boycottedBrands.length;
    document.getElementById('estimated-impact').textContent = `$${state.boycottedBrands.length * 100}`;
    document.getElementById('boycott-days').textContent = state.boycottDays;
    Object.keys(state.votes).forEach(brand => {
        const voteElement = document.getElementById(`vote-${brand}`);
        if (voteElement) voteElement.textContent = state.votes[brand];
    });
    updateChart();
    updateLeaderboard();
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('voteChart').getContext('2d');
    if (window.voteChart) window.voteChart.destroy();
    window.voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(state.votes),
            datasets: [{
                label: 'Boycott Votes',
                data: Object.values(state.votes),
                backgroundColor: '#d32f2f',
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

// Vote for boycott
function voteForBoycott(brand) {
    state.votes[brand] = (state.votes[brand] || 0) + 1;
    if (!state.boycottedBrands.includes(brand)) {
        state.boycottedBrands.push(brand);
    }
    localStorage.setItem('boycottVotes', JSON.stringify(state.votes));
    localStorage.setItem('boycottedBrands', JSON.stringify(state.boycottedBrands));
    updateUI();
    showPopup(brand);
}

// Show popup
function showPopup(brand) {
    const popup = document.getElementById('ctaPopup');
    popup.querySelector('p').textContent = `You’ve taken a stand against ${brand}! Share your pledge to rally others:`;
    popup.style.display = 'flex';
}

// Close popup
function closePopup() {
    document.getElementById('ctaPopup').style.display = 'none';
}

// Search function
const debouncedSearch = debounce(() => {
    const searchTerm = document.getElementById('searchInput').value;
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderDonors(activeFilter, searchTerm);
}, 300);

// Filter function
function filterAlternatives(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    renderDonors(category, document.getElementById('searchInput').value);
}

// Form validation
function validateForm() {
    const name = document.getElementById('volunteer-name');
    const email = document.getElementById('volunteer-email');
    const location = document.getElementById('volunteer-location');
    let isValid = true;

    if (!name.value.trim()) {
        document.getElementById('name-error').hidden = false;
        isValid = false;
    } else {
        document.getElementById('name-error').hidden = true;
    }

    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').hidden = false;
        isValid = false;
    } else {
        document.getElementById('email-error').hidden = true;
    }

    if (!location.value.trim()) {
        document.getElementById('location-error').hidden = false;
        isValid = false;
    } else {
        document.getElementById('location-error').hidden = true;
    }

    return isValid;
}

// Share pledge
function updatePledge() {
    const select = document.getElementById('brandSelect');
    const [brand, alternative] = select.value.split('|');
    const pledgeText = brand
        ? `I’m boycotting ${brand} and switching to ${alternative} to fight corporate greed! Join me with #BoycottTrumpDonors!`
        : 'Select a brand to generate your pledge.';
    document.getElementById('pledge-text').textContent = pledgeText;
    document.getElementById('shareX').href = `https://x.com/intent/tweet?text=${encodeURIComponent(pledgeText)}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(pledgeText)}`;
}

// Copy pledge
function copyPledge() {
    const pledgeText = document.getElementById('pledge-text').textContent;
    navigator.clipboard.writeText(pledgeText).then(() => {
        alert('Pledge copied! Spread the word!');
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderDonors();
    updateUI();

    document.querySelector('.hamburger').addEventListener('click', () => {
        const menu = document.getElementById('nav-menu');
        const isExpanded = menu.classList.toggle('show');
        document.querySelector('.hamburger').setAttribute('aria-expanded', isExpanded);
    });

    document.getElementById('donorList').addEventListener('click', e => {
        const btn = e.target.closest('.boycott-btn');
        if (btn) voteForBoycott(btn.dataset.brand);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterAlternatives(btn.dataset.filter));
    });

    document.getElementById('searchInput').addEventListener('input', debouncedSearch);

    document.getElementById('volunteer-form').addEventListener('submit', e => {
        e.preventDefault();
        if (validateForm()) {
            const name = document.getElementById('volunteer-name').value;
            state.leaderboard.push({ name, votes: state.boycottedBrands.length });
            localStorage.setItem('leaderboard', JSON.stringify(state.leaderboard));
            alert('You’re in! Let’s fight together!');
            e.target.reset();
            updateUI();
        }
    });

    document.querySelector('.close-popup').addEventListener('click', closePopup);

    document.querySelector('.share-btn').addEventListener('click', () => {
        const brand = document.querySelector('.popup-content p').textContent.match(/against (\w+)/)[1];
        const pledgeText = `I’m boycotting ${brand} to fight corporate greed! Join me with #BoycottTrumpDonors!`;
        document.getElementById('shareX').href = `https://x.com/intent/tweet?text=${encodeURIComponent(pledgeText)}`;
        document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(pledgeText)}`;
    });

    document.querySelectorAll('.cta-btn, .floating-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('donors').scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelector('.reset-btn').addEventListener('click', () => {
        state.votes = {};
        state.boycottedBrands = [];
        state.boycottDays = 0;
        state.leaderboard = [];
        localStorage.clear();
        renderDonors();
        updateUI();
    });

    document.getElementById('brandSelect').addEventListener('change', updatePledge);
    document.querySelector('.copy-pledge').addEventListener('click', copyPledge);

    // Update boycott days daily
    setInterval(() => {
        state.boycottDays += 1;
        localStorage.setItem('boycottDays', state.boycottDays);
        document.getElementById('boycott-days').textContent = state.boycottDays;
    }, 24 * 60 * 60 * 1000);
});

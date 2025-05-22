// script.js
import donors from './data/donors.js';

// 状态管理
const state = {
    votes: JSON.parse(localStorage.getItem('boycottVotes')) || {},
    boycottedBrands: JSON.parse(localStorage.getItem('boycottedBrands')) || [],
    boycottDays: parseInt(localStorage.getItem('boycottDays')) || 0,
};

// 防抖函数
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// 渲染捐助者列表
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
                    <i class="fas fa-thumbs-down"></i> Vote to Boycott
                </button>
                <p>Votes: <span id="vote-${donor.brand}">${state.votes[donor.brand] || 0}</span></p>
            `;
            donorList.appendChild(donorCard);
        });
}

// 更新 UI
function updateUI() {
    const totalVotes = Object.values(state.votes).reduce((sum, count) => sum + count, 0);
    document.getElementById('pledgeCount').textContent = totalVotes;
    document.getElementById('brands-boycotted').textContent = state.boycottedBrands.length;
    document.getElementById('estimated-impact').textContent = `$${state.boycottedBrands.length * 100}`;
    Object.keys(state.votes).forEach(brand => {
        const voteElement = document.getElementById(`vote-${brand}`);
        if (voteElement) voteElement.textContent = state.votes[brand];
    });
    updateChart();
}

// 图表更新
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
                backgroundColor: '#e74c3c',
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

// 投票功能
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

// 弹出窗口
function showPopup(brand) {
    const popup = document.getElementById('ctaPopup');
    popup.querySelector('p').textContent = `You've voted to boycott ${brand}! Share your pledge to inspire others:`;
    popup.style.display = 'flex';
}

// 关闭弹出窗口
function closePopup() {
    document.getElementById('ctaPopup').style.display = 'none';
}

// 搜索功能
const debouncedSearch = debounce(() => {
    const searchTerm = document.getElementById('searchInput').value;
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderDonors(activeFilter, searchTerm);
}, 300);

// 过滤功能
function filterAlternatives(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    renderDonors(category, document.getElementById('searchInput').value);
}

// 表单验证
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

// 事件监听
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
            alert('Thank you for volunteering!');
            e.target.reset();
        }
    });

    document.querySelector('.close-popup').addEventListener('click', closePopup);

    document.querySelector('.cta-btn, .floating-cta').addEventListener('click', () => {
        document.getElementById('donors').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelector('.reset-btn').addEventListener('click', () => {
        state.votes = {};
        state.boycottedBrands = [];
        state.boycottDays = 0;
        localStorage.clear();
        renderDonors();
        updateUI();
    });

    // 每日更新抵制天数
    setInterval(() => {
        state.boycottDays += 1;
        localStorage.setItem('boycottDays', state.boycottDays);
        document.getElementById('boycott-days').textContent = state.boycottDays;
    }, 24 * 60 * 60 * 1000);
});

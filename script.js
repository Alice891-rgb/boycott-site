// script.js
import { donors } from './data/donors.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Script loaded successfully'); // Debug log
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

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
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
                    <p><strong>Category:</strong> ${donor.category.charAt(0).to

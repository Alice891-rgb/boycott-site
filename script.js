document.addEventListener("DOMContentLoaded", () => {
    // Initialize i18next for multi-language support
    i18next.init({
        lng: 'en',
        debug: true,
        resources: {
            en: {
                translation: {
                    title: "EXPOSED: Boycott Trump's Top 10 Mega Donors",
                    nav: {
                        about: "About",
                        donors: "Donors",
                        progress: "Progress",
                        volunteer: "Volunteer"
                    },
                    popup: {
                        title: "Great Job!",
                        message: "You've voted to boycott! Share your pledge to inspire others:",
                        share: "Share Now",
                        close: "Close"
                    },
                    notifications: {
                        title: "Recent Votes"
                    },
                    header: {
                        title: "EXPOSED: Trump's Top 10 Mega Donors",
                        subtitle: "These billionaires are funding Trump's agenda—fight back by boycotting their brands!",
                        cta: "Join the Movement Now!"
                    },
                    about: {
                        title: "Why We’re Fighting Back",
                        content: "In 2024, billionaires and corporations poured millions into Trump’s campaign, fueling his agenda. By boycotting these mega donors, we’re hitting them where it hurts—their wallets. Together, we can make a difference!"
                    },
                    guide: {
                        title: "How to Boycott Effectively",
                        subtitle: "Follow these steps to make your boycott impactful:",
                        step1: { title: "Research Alternatives", content: "Use our recommended alternatives for each brand to find ethical options." },
                        step2: { title: "Spread Awareness", content: "Share your pledge on social media using #BoycottTrumpDonors to inspire others." },
                        step3: { title: "Track Your Progress", content: "Use our progress tracker to monitor your boycott journey and celebrate milestones." },
                        step4: { title: "Engage Locally", content: "Organize or join local events to amplify the movement—check out volunteer opportunities below." },
                        step5: { title: "Stay Informed", content: "Read articles and success stories to understand the broader impact of boycotts." }
                    },
                    stats: {
                        title: "Movement Impact",
                        participants: "Total Participants:"
                    },
                    leaderboard: {
                        title: "Top Boycotters",
                        subtitle: "See who’s making the biggest impact!"
                    },
                    donors: {
                        title: "Top 10 Mega Donors to Trump",
                        search: "Search for a donor...",
                        filters: { all: "All", finance: "Finance", tech: "Tech", casino: "Casino", retail: "Retail", energy: "Energy" },
                        warning: "MEGA DONOR",
                        panAm: "Pan Am Systems (Timothy Mellon): Donated $125M to Trump in 2024",
                        switch: "Switch to This Alternative:",
                        panAm: { alt: "EthicalBank" },
                        vote: "Vote to Boycott",
                        votes: "Votes:"
                    },
                    pledges: {
                        title: "Share Your Pledge",
                        subtitle: "Select a brand to boycott:",
                        select: "Select a Brand",
                        brands: { panAm: "Pan Am Systems" },
                        default: "Select a brand to generate your pledge.",
                        copy: "Copy Pledge",
                        shareX: "Share on X",
                        shareFacebook: "Share on Facebook"
                    },
                    footer: {
                        text: "Join the Global Movement—Share This Page!"
                    }
                }
            },
            es: {
                translation: {
                    title: "EXPOSICIÓN: Boicot a los 10 principales megadonantes de Trump",
                    nav: {
                        about: "Acerca de",
                        donors: "Donantes",
                        progress: "Progreso",
                        volunteer: "Voluntario"
                    },
                    popup: {
                        title: "¡Buen trabajo!",
                        message: "¡Has votado por el boicot! Comparte tu compromiso para inspirar a otros:",
                        share: "Compartir ahora",
                        close: "Cerrar"
                    },
                    notifications: {
                        title: "Votos recientes"
                    }
                    // Additional translations...
                }
            },
            zh: {
                translation: {
                    title: "曝光：抵制特朗普的十大巨额捐助者",
                    nav: {
                        about: "关于",
                        donors: "捐助者",
                        progress: "进展",
                        volunteer: "志愿者"
                    },
                    popup: {
                        title: "干得漂亮！",
                        message: "你已投票抵制！分享你的承诺以激励他人：",
                        share: "立即分享",
                        close: "关闭"
                    },
                    notifications: {
                        title: "最近的投票"
                    }
                    // Additional translations...
                }
            }
        }
    }, (err, t) => {
        if (err) return console.error(err);
        updateContent();
    });

    // Language Switcher
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        i18next.changeLanguage(e.target.value, () => {
            updateContent();
        });
    });

    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.startsWith('[placeholder]')) {
                element.placeholder = i18next.t(key.replace('[placeholder]', ''));
            } else {
                element.innerHTML = i18next.t(key);
            }
        });
    }

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".donor").forEach((donor, index) => {
        gsap.from(donor, {
            scrollTrigger: { trigger: donor, start: "top 80%" },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
        });
    });

    // Image Loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.previousElementSibling.style.display = 'none';
        });
        img.addEventListener('error', () => {
            img.src = 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9';
            img.classList.add('loaded');
            img.previousElementSibling.style.display = 'none';
        });
    });

    // Back to Top Button Visibility
    window.addEventListener('scroll', () => {
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Initialize pledge count and votes
    let pledgeCount = localStorage.getItem('pledgeCount') || 0;
    document.getElementById('pledgeCount').innerText = pledgeCount;

    const brands = ["Pan Am Systems", "Tesla", /* other brands */];
    const voteData = brands.map(brand => {
        const voteCount = localStorage.getItem(`vote-${brand}`) || 0;
        document.getElementById(`vote-${brand}`).innerText = voteCount;
        return parseInt(voteCount);
    });

    // Chart.js Initialization
    const ctx = document.getElementById('voteChart').getContext('2d');
    window.voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Boycott Votes',
                data: voteData,
                backgroundColor: '#d32f2f',
                borderColor: '#b71c1c',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Number of Votes' } },
                x: { title: { display: true, text: 'Brands' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Load vote notifications
    const savedNotifications = JSON.parse(localStorage.getItem('voteNotifications')) || [];
    savedNotifications.forEach(notification => addVoteNotification(notification.user, notification.brand));

    // Simulate real-time vote notifications
    setInterval(() => {
        const randomUser = `User${Math.floor(Math.random() * 1000)}`;
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        addVoteNotification(randomUser, randomBrand);
    }, 15000);
});

function voteForBoycott(brand) {
    let voteCount = localStorage.getItem(`vote-${brand}`) || 0;
    voteCount = parseInt(voteCount) + 1;
    localStorage.setItem(`vote-${brand}`, voteCount);
    document.getElementById(`vote-${brand}`).innerText = voteCount;

    let pledgeCount = localStorage.getItem('pledgeCount') || 0;
    pledgeCount = parseInt(pledgeCount) + 1;
    localStorage.setItem('pledgeCount', pledgeCount);
    document.getElementById('pledgeCount').innerText = pledgeCount;

    // Update chart
    const brands = ["Pan Am Systems", "Tesla", /* other brands */];
    const voteData = brands.map(b => parseInt(localStorage.getItem(`vote-${b}`) || 0));
    voteChart.data.datasets[0].data = voteData;
    voteChart.update();

    // Add vote notification
    const randomUser = `User${Math.floor(Math.random() * 1000)}`;
    addVoteNotification(randomUser, brand);

    // Show CTA popup
    document.getElementById('ctaPopup').style.display = 'flex';
}

function addVoteNotification(user, brand) {
    const notificationList = document.getElementById('notificationList');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<p><span>${user}</span> just voted to boycott ${brand}!</p>`;
    notificationList.prepend(notification);

    const notifications = JSON.parse(localStorage.getItem('voteNotifications')) || [];
    notifications.unshift({ user, brand });
    if (notifications.length > 5) notifications.pop();
    localStorage.setItem('voteNotifications', JSON.stringify(notifications));
}

function shareAfterVote() {
    const pledgeText = document.getElementById('pledge-text').innerText;
    if (pledgeText !== i18next.t('pledges.default')) {
        const encodedPledge = encodeURIComponent(pledgeText);
        window.open(`https://x.com/intent/tweet?text=${encodedPledge}`, '_blank');
        addPoints("Anonymous", 10);
        awardBadge("Anonymous", "Social Advocate");
    }
    closePopup();
}

function awardBadge(username, badgeName) {
    const badges = JSON.parse(localStorage.getItem('badges')) || {};
    if (!badges[username]) badges[username] = [];
    if (!badges[username].includes(badgeName)) {
        badges[username].push(badgeName);
        localStorage.setItem('badges', JSON.stringify(badges));
        alert(`Congratulations, ${username}! You've earned the "${badgeName}" badge!`);
    }
}

function addPoints(username, points) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.name === username) || { name: username, votes: 0, comments: 0, points: 0 };
    user.points = (user.points || 0) + points;
    if (!users.find(u => u.name === username)) users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

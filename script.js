document.addEventListener("DOMContentLoaded", () => {
    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".donor, .story-item").forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 80%" },
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
    if (pledgeText !== "Select a brand to generate your pledge.") {
        const encodedPledge = encodeURIComponent(pledgeText);
        window.open(`https://x.com/intent/tweet?text=${encodedPledge}`, '_blank');
        addPoints("Anonymous", 10);
        awardBadge("Anonymous", "Social Advocate");
    }
    closePopup();
}

function closePopup() {
    document.getElementById('ctaPopup').style.display = 'none';
}

function updatePledge() {
    const select = document.getElementById("brandSelect");
    const pledgeText = document.getElementById("pledge-text");
    const shareX = document.getElementById("shareX");
    const shareFacebook = document.getElementById("shareFacebook");

    if (select.value) {
        const [donorBrand, altBrand] = select.value.split("|");
        const pledge = `I’m boycotting ${donorBrand} and switching to ${altBrand} to fight Trump’s agenda! Join me! #BoycottTrumpDonors`;
        pledgeText.innerText = pledge;

        const encodedPledge = encodeURIComponent(pledge);
        const websiteUrl = encodeURIComponent("https://your-username.github.io/trump-donors-boycott");
        shareX.href = `https://x.com/intent/tweet?text=${encodedPledge}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}`;
    } else {
        pledgeText.innerText = "Select a brand to generate your pledge.";
        shareX.href = "#";
        shareFacebook.href = "#";
    }
}

function copyPledge() {
    const pledgeText = document.getElementById('pledge-text').innerText;
    navigator.clipboard.writeText(pledgeText).then(() => {
        alert("Pledge copied to clipboard!");
        addPoints("Anonymous", 2);
    });
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

function searchDonors() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const donors = document.getElementsByClassName("donor");
    for (let donor of donors) {
        const brand = donor.getAttribute("data-brand").toLowerCase();
        donor.style.display = brand.includes(input) ? "block" : "none";
    }
}

function filterAlternatives(category) {
    const donors = document.getElementsByClassName("donor");
    for (let donor of donors) {
        const alternatives = donor.querySelectorAll("li");
        let show = category === "all";
        alternatives.forEach((alt) => {
            if (alt.getAttribute("data-category") === category) show = true;
        });
        donor.style.display = show ? "block" : "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
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

    // Image Loading Animation
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

    // Initialize pledge count and votes
    let pledgeCount = localStorage.getItem('pledgeCount') || 0;
    document.getElementById('pledgeCount').innerText = pledgeCount;

    const brands = [
        "Pan Am Systems", "Tesla", "Las Vegas Sands", "Uline-Richard", "Uline-Liz",
        "Blackstone", "Continental Resources", "Energy Transfer Partners",
        "Susquehanna International Group", "Home Depot", "Hiatus"
    ];
    const voteData = brands.map(brand => {
        const voteCount = localStorage.getItem(`vote-${brand}`) || 0;
        document.getElementById(`vote-${brand}`).innerText = voteCount;
        return parseInt(voteCount);
    });

    // Initialize Chart.js for vote statistics
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
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Votes' }
                },
                x: {
                    title: { display: true, text: 'Brands' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Load comments, images, boycotts, and volunteers from localStorage
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
    savedComments.forEach(comment => addComment(comment));

    const savedImages = JSON.parse(localStorage.getItem('images')) || [];
    savedImages.forEach(image => addImageToGallery(image));

    const savedBoycotts = JSON.parse(localStorage.getItem('boycotts')) || [];
    savedBoycotts.forEach(boycott => addBoycottProgress(boycott.brand));

    const savedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    savedVolunteers.forEach(volunteer => addVolunteerEntry(volunteer));

    // Initialize leaderboard with points
    updateLeaderboard();

    // Embed X posts (mocked due to API limitations)
    const xFeed = document.getElementById('x-feed');
    const mockTweets = [
        { id: "example-tweet-id-1", text: "I’m boycotting Tesla and switching to Rivian! #BoycottTrumpDonors" },
        { id: "example-tweet-id-2", text: "Uline supports Trump—time to switch to EcoPack Solutions! #BoycottTrumpDonors" }
    ];
    mockTweets.forEach(tweet => {
        const tweetElement = document.createElement('div');
        tweetElement.innerHTML = `<blockquote class="twitter-tweet"><p>${tweet.text}</p></blockquote>`;
        xFeed.appendChild(tweetElement);
    });
    if (window.twttr) window.twttr.widgets.load();

    // Load recent vote notifications
    const savedNotifications = JSON.parse(localStorage.getItem('voteNotifications')) || [];
    savedNotifications.forEach(notification => addVoteNotification(notification.user, notification.brand));

    // Update boycott progress periodically
    setInterval(updateBoycottProgress, 60000);
});

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
    const brands = [
        "Pan Am Systems", "Tesla", "Las Vegas Sands", "Uline-Richard", "Uline-Liz",
        "Blackstone", "Continental Resources", "Energy Transfer Partners",
        "Susquehanna International Group", "Home Depot", "Hiatus"
    ];
    const voteData = brands.map(b => parseInt(localStorage.getItem(`vote-${b}`) || 0));
    voteChart.data.datasets[0].data = voteData;
    voteChart.update();

    // Record user vote and add points
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.name === "Anonymous") || { name: "Anonymous", votes: 0, comments: 0, points: 0 };
    user.votes += 1;
    user.points = (user.points || 0) + 5;
    if (!users.find(u => u.name === "Anonymous")) users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    updateLeaderboard();

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

    // Save to localStorage (keep only the latest 5 notifications)
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
    }
    closePopup();
}

function closePopup() {
    document.getElementById('ctaPopup').style.display = 'none';
}

function submitComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    if (commentText) {
        const comment = {
            text: commentText,
            date: new Date().toLocaleString()
        };
        addComment(comment);

        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));

        const users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.name === "Anonymous") || { name: "Anonymous", votes: 0, comments: 0, points: 0 };
        user.comments += 1;
        user.points = (user.points || 0) + 3;
        if (!users.find(u => u.name === "Anonymous")) users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        updateLeaderboard();

        commentInput.value = '';
    }
}

function addComment(comment) {
    const commentList = document.getElementById('commentList');
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `<p>${comment.text}</p><small>${comment.date}</small>`;
    commentList.prepend(commentDiv);
}

function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            addImageToGallery(imageData);

            const images = JSON.parse(localStorage.getItem('images')) || [];
            images.push(imageData);
            localStorage.setItem('images', JSON.stringify(images));

            addPoints("Anonymous", 5);
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    }
}

function addImageToGallery(imageData) {
    const gallery = document.getElementById('imageGallery');
    const img = document.createElement('img');
    img.src = imageData;
    gallery.appendChild(img);
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || [
        { name: "User1", votes: 5, comments: 2, points: 16 },
        { name: "User2", votes: 3, comments: 4, points: 23 },
        { name: "User3", votes: 2, comments: 1, points: 12 }
    ];

    users.sort((a, b) => (b.points || 0) - (a.points || 0));

    users.slice(0, 5).forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span class="rank">${index + 1}. ${user.name}</span>
            <span class="score">${user.points || 0} points (Votes: ${user.votes}, Comments: ${user.comments})</span>
        `;
        leaderboardList.appendChild(item);
    });

    localStorage.setItem('users', JSON.stringify(users));
}

function addPoints(username, points) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.name === username) || { name: username, votes: 0, comments: 0, points: 0 };
    user.points = (user.points || 0) + points;
    if (!users.find(u => u.name === username)) users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    updateLeaderboard();
}

function addBoycottBrand() {
    const select = document.getElementById('boycottBrands');
    const brand = select.value;
    if (brand) {
        const boycotts = JSON.parse(localStorage.getItem('boycotts')) || [];
        if (!boycotts.find(b => b.brand === brand)) {
            const boycott = {
                brand: brand,
                startDate: new Date().toISOString(),
                days: 0
            };
            boycotts.push(boycott);
            localStorage.setItem('boycotts', JSON.stringify(boycotts));
            addBoycottProgress(brand);

            addPoints("Anonymous", 5);
        }
        select.value = '';
    }
}

function addBoycottProgress(brand) {
    const progressList = document.getElementById('progress-list');
    const boycotts = JSON.parse(localStorage.getItem('boycotts')) || [];
    const boycott = boycotts.find(b => b.brand === brand);
    if (!boycott) return;

    const days = boycott.days || calculateDaysSince(boycott.startDate);
    boycott.days = days;
    localStorage.setItem('boycotts', JSON.stringify(boycotts));

    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';
    progressItem.innerHTML = `
        <h3>Boycotting ${brand}</h3>
        <p>Days: ${days}</p>
        <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${Math.min(days, 90) / 90 * 100}%"></div>
        </div>
        <div class="milestone-badges" id="badges-${brand}">
            ${days >= 30 ? '<span class="badge">30 Days</span>' : ''}
            ${days >= 60 ? '<span class="badge">60 Days</span>' : ''}
            ${days >= 90 ? '<span class="badge">90 Days</span>' : ''}
        </div>
    `;
    progressList.appendChild(progressItem);
}

function calculateDaysSince(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function updateBoycottProgress() {
    const progressList = document.getElementById('progress-list');
    progressList.innerHTML = '';
    const boycotts = JSON.parse(localStorage.getItem('boycotts')) || [];
    boycotts.forEach(boycott => {
        boycott.days = calculateDaysSince(boycott.startDate);
        addBoycottProgress(boycott.brand);
    });
    localStorage.setItem('boycotts', JSON.stringify(boycotts));
}

function submitVolunteer() {
    const nameInput = document.getElementById('volunteerName');
    const emailInput = document.getElementById('volunteerEmail');
    const messageInput = document.getElementById('volunteerMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name && email && message) {
        const volunteer = {
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString()
        };
        const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
        volunteers.push(volunteer);
        localStorage.setItem('volunteers', JSON

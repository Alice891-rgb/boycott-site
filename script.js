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
                    title: {
                        display: true,
                        text: 'Number of Votes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Brands'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Load comments from localStorage
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
    savedComments.forEach(comment => addComment(comment));

    // Load images from localStorage
    const savedImages = JSON.parse(localStorage.getItem('images')) || [];
    savedImages.forEach(image => addImageToGallery(image));

    // Initialize leaderboard
    updateLeaderboard();

    // Load boycott progress from localStorage
    const savedBoycotts = JSON.parse(localStorage.getItem('boycotts')) || [];
    savedBoycotts.forEach(boycott => addBoycottProgress(boycott.brand));

    // Load volunteers from localStorage
    const savedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    savedVolunteers.forEach(volunteer => addVolunteerEntry(volunteer));

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

    // Update boycott progress periodically
    setInterval(updateBoycottProgress, 60000); // Update every minute for simulation
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
    const shareReddit = document.getElementById("shareReddit");

    if (select.value) {
        const [donorBrand, altBrand] = select.value.split("|");
        const pledge = `I’m boycotting ${donorBrand} and switching to ${altBrand} to fight Trump’s agenda! Join me! #BoycottTrumpDonors`;
        pledgeText.innerText = pledge;

        const encodedPledge = encodeURIComponent(pledge);
        const websiteUrl = encodeURIComponent("https://your-username.github.io/trump-donors-boycott");
        shareX.href = `https://x.com/intent/tweet?text=${encodedPledge}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}`;
        shareReddit.href = `https://www.reddit.com/submit?url=${websiteUrl}&title=${encodedPledge}`;
    } else {
        pledgeText.innerText = "Select a brand to generate your pledge.";
        shareX.href = "#";
        shareFacebook.href = "#";
        shareReddit.href = "#";
    }
}

function copyPledge() {
    const pledgeText = document.getElementById('pledge-text').innerText;
    navigator.clipboard.writeText(pledgeText).then(() => {
        alert("Pledge copied to clipboard!");
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

    // Record user vote (assuming anonymous user)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.name === "Anonymous") || { name: "Anonymous", votes: 0, comments: 0 };
    user.votes += 1;
    if (!users.find(u => u.name === "Anonymous")) users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    updateLeaderboard();
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

        // Record user comment
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.name === "Anonymous") || { name: "Anonymous", votes: 0, comments: 0 };
        user.comments += 1;
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

    // Simulate user data: retrieve votes and comments from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [
        { name: "User1", votes: 5, comments: 2 },
        { name: "User2", votes: 3, comments: 4 },
        { name: "User3", votes: 2, comments: 1 }
    ];

    // Calculate total score (votes + comments * 2)
    users.forEach(user => {
        user.score = user.votes + user.comments * 2;
    });

    // Sort by score
    users.sort((a, b) => b.score - a.score);

    // Display top 5
    users.slice(0, 5).forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span class="rank">${index + 1}. ${user.name}</span>
            <span class="score">${user.score} points (Votes: ${user.votes}, Comments: ${user.comments})</span>
        `;
        leaderboardList.appendChild(item);
    });

    localStorage.setItem('users', JSON.stringify(users));
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
        }
        select.value = ''; // Reset the dropdown
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
        localStorage.setItem('volunteers', JSON.stringify(volunteers));
        addVolunteerEntry(volunteer);

        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        alert("Thank you for volunteering!");
    } else {
        alert("Please fill out all fields.");
    }
}

function addVolunteerEntry(volunteer) {
    const volunteerList = document.getElementById('volunteerList');
    const entry = document.createElement('div');
    entry.className = 'volunteer-entry';
    entry.innerHTML = `
        <p><strong>${volunteer.name}</strong> (${volunteer.email})</p>
        <p>${volunteer.message}</p>
        <small>${volunteer.date}</small>
    `;
    volunteerList.prepend(entry);
}

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
    const voteChart = new Chart(ctx, {
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
});

function searchDonors() {
    const input = document.querySelector('[id^="searchInput"]:not([style*="display: none"])').value.toLowerCase();
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
    const pledgeText = document.querySelector('#pledge-text:not([style*="display: none"])');
    const shareX = document.getElementById("shareX");
    const shareFacebook = document.getElementById("shareFacebook");
    const shareReddit = document.getElementById("shareReddit");

    if (select.value) {
        const [donorBrand, altBrand] = select.value.split("|");
        const lang = document.getElementById("languageSelect").value;
        let pledge;
        if (lang === "es") {
            pledge = `¡Estoy boicoteando ${donorBrand} y cambiando a ${altBrand} para luchar contra la agenda de Trump! ¡Únete! #BoycottTrumpDonors`;
        } else if (lang === "zh") {
            pledge = `我正在抵制${donorBrand}，并转向${altBrand}，以对抗特朗普的议程！加入我吧！#BoycottTrumpDonors`;
        } else {
            pledge = `I’m boycotting ${donorBrand} and switching to ${altBrand} to fight Trump’s agenda! Join me! #BoycottTrumpDonors`;
        }
        pledgeText.innerText = pledge;

        const encodedPledge = encodeURIComponent(pledge);
        const websiteUrl = encodeURIComponent("https://your-username.github.io/trump-donors-boycott");
        shareX.href = `https://x.com/intent/tweet?text=${encodedPledge}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}`;
        shareReddit.href = `https://www.reddit.com/submit?url=${websiteUrl}&title=${encodedPledge}`;
    } else {
        if (lang === "es") {
            pledgeText.innerText = "Selecciona una marca para generar tu compromiso.";
        } else if (lang === "zh") {
            pledgeText.innerText = "选择一个品牌以生成你的承诺。";
        } else {
            pledgeText.innerText = "Select a brand to generate your pledge.";
        }
        shareX.href = "#";
        shareFacebook.href = "#";
        shareReddit.href = "#";
    }
}

function copyPledge() {
    const pledgeText = document.querySelector('#pledge-text:not([style*="display: none"])').innerText;
    navigator.clipboard.writeText(pledgeText).then(() => {
        const lang = document.getElementById("languageSelect").value;
        if (lang === "es") {
            alert("¡Compromiso copiado al portapapeles!");
        } else if (lang === "zh") {
            alert("承诺已复制到剪贴板！");
        } else {
            alert("Pledge copied to clipboard!");
        }
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
    const voteData = brands.map(b => parseInt(localStorage.getItem(`vote-${b}`) || 0));
    voteChart.data.datasets[0].data = voteData;
    voteChart.update();

    // 记录用户投票（假设当前用户为匿名用户）
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.name === "Anonymous") || { name: "Anonymous", votes: 0, comments: 0 };
    user.votes += 1;
    if (!users.find(u => u.name === "Anonymous")) users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    updateLeaderboard();
}

function submitComment() {
    const commentInput = document.querySelector('[id^="commentInput"]:not([style*="display: none"])');
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

        // 记录用户评论
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

    // 模拟用户数据：从 localStorage 获取投票和评论数量
    const users = JSON.parse(localStorage.getItem('users')) || [
        { name: "User1", votes: 5, comments: 2 },
        { name: "User2", votes: 3, comments: 4 },
        { name: "User3", votes: 2, comments: 1 }
    ];

    // 计算总分（votes + comments * 2）
    users.forEach(user => {
        user.score = user.votes + user

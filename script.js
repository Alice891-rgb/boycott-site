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

    let pledgeCount = localStorage.getItem('pledgeCount') || 0;
    document.getElementById('pledgeCount').innerText = pledgeCount;

    const brands = [
        "Pan Am Systems", "Tesla", "Las Vegas Sands", "Uline-Richard", "Uline-Liz",
        "Blackstone", "Continental Resources", "Energy Transfer Partners",
        "Susquehanna International Group", "Home Depot"
    ];
    brands.forEach((brand) => {
        const voteCount = localStorage.getItem(`vote-${brand}`) || 0;
        document.getElementById(`vote-${brand}`).innerText = voteCount;
    });
});

function searchDonors() {
    const input = document.getElementById("searchInput").value.toLowerCase();
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
    const pledgeText = document.getElementById("pledge-text").innerText;
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
}

// data/donors.js
const donors = [
    {
        brand: "Pan Am Systems",
        category: "finance",
        image: { webp: "images/pan-am-systems.webp", jpg: "images/pan-am-systems.jpg" },
        alt: "Pan Am Systems - a mega donor to Trump",
        donation: "$125M",
        description: "Donated $125M to Trump in 2024. Timothy Mellon, a billionaire banking heir, has a history of funding anti-immigration groups and lobbying for deregulation that harms environmental and labor standards.",
        whyBoycott: "Pan Am Systems’ political contributions fuel policies that prioritize corporate profits over environmental sustainability and social equity, exacerbating inequality and climate challenges.",
        alternatives: [
            { name: "Aspiration", url: "https://www.aspiration.com", category: "finance" },
            { name: "DHL Green Logistics", url: "https://www.dhl.com", category: "finance" },
        ],
    },
    {
        brand: "Tesla",
        category: "tech",
        image: { webp: "images/tesla.webp", jpg: "images/tesla.jpg" },
        alt: "Tesla - a mega donor to Trump",
        donation: "$75M",
        description: "Donated $75M to Trump in 2024. Elon Musk, CEO of Tesla and SpaceX, has publicly endorsed deregulation policies that undermine climate initiatives, despite Tesla’s green branding.",
        whyBoycott: "Musk’s support for deregulation contradicts Tesla’s sustainability mission, weakening renewable energy incentives and prioritizing corporate interests over global climate goals.",
        alternatives: [
            { name: "Rivian", url: "https://www.rivian.com", category: "tech" },
            { name: "Lucid Motors", url: "https://www.lucidmotors.com", category: "tech" },
        ],
    },
    {
        brand: "Adelson Family",
        category: "casino",
        image: { webp: "images/adelson-family.webp", jpg: "images/adelson-family.jpg" },
        alt: "Adelson Family - a mega donor to Trump",
        donation: "$100M",
        description: "Donated $100M to Trump in 2024. The Adelson family, owners of Las Vegas Sands, has long funded Republican campaigns to influence tax and gambling regulations, often at the expense of workers and local communities.",
        whyBoycott: "Las Vegas Sands faces criticism for low wages, anti-union practices, and political donations that perpetuate policies favoring the ultra-wealthy over everyday workers.",
        alternatives: [
            { name: "Caesars Entertainment", url: "https://www.caesars.com", category: "casino" },
        ],
    },
    {
        brand: "Uline",
        category: "retail",
        image: { webp: "images/uline.webp", jpg: "images/uline.jpg" },
        alt: "Uline - a mega donor to Trump",
        donation: "$60M",
        description: "Donated $60M to Trump in 2024. Uline, a major packaging supplier, is criticized for its anti-union policies and reliance on single-use plastics, contributing to environmental harm.",
        whyBoycott: "Uline’s excessive plastic use and anti-worker stance harm the environment and employees, while its political contributions support policies that deepen economic inequality.",
        alternatives: [
            { name: "EcoEnclose", url: "https://www.ecoenclose.com", category: "retail" },
        ],
    },
    {
        brand: "Koch Industries",
        category: "energy",
        image: { webp: "images/koch-industries.webp", jpg: "images/koch-industries.jpg" },
        alt: "Koch Industries - a mega donor to Trump",
        donation: "$50M",
        description: "Donated $50M to Trump in 2024. Koch Industries, a conglomerate in energy and chemicals, has long funded conservative policies opposing climate regulations, prioritizing fossil fuel profits.",
        whyBoycott: "Koch Industries’ lobbying delays renewable energy adoption, exacerbating climate change and prioritizing corporate greed over environmental sustainability.",
        alternatives: [
            { name: "NextEra Energy", url: "https://www.nexteraenergy.com", category: "energy" },
        ],
    },
    {
        brand: "Wynn Resorts",
        category: "casino",
        image: { webp: "images/wynn-resorts.webp", jpg: "images/wynn-resorts.jpg" },
        alt: "Wynn Resorts - a mega donor to Trump",
        donation: "$45M",
        description: "Donated $45M to Trump in 2024. Wynn Resorts, a luxury casino chain, supports tax policies favoring the ultra-wealthy and has faced allegations of workplace misconduct.",
        whyBoycott: "Wynn Resorts’ political donations and labor practices prioritize profits over employee welfare, undermining fair wages and workplace safety.",
        alternatives: [
            { name: "MGM Resorts", url: "https://www.mgmresorts.com", category: "casino" },
        ],
    },
    {
        brand: "Blackstone Group",
        category: "finance",
        image: { webp: "images/blackstone-group.webp", jpg: "images/blackstone-group.jpg" },
        alt: "Blackstone Group - a mega donor to Trump",
        donation: "$40M",
        description: "Donated $40M to Trump in 2024. Blackstone Group, a private equity firm, invests heavily in fossil fuels and real estate, often leading to gentrification and displacement of low-income communities.",
        whyBoycott: "Blackstone’s investments drive environmental degradation and social inequity, prioritizing profit over community well-being.",
        alternatives: [
            { name: "Vanguard", url: "https://www.vanguard.com", category: "finance" },
        ],
    },
    {
        brand: "Home Depot",
        category: "retail",
        image: { webp: "images/home-depot.webp", jpg: "images/home-depot.jpg" },
        alt: "Home Depot - a mega donor to Trump",
        donation: "$35M",
        description: "Donated $35M to Trump in 2024. Home Depot, a major home improvement retailer, is criticized for its labor practices and support for anti-worker policies.",
        whyBoycott: "Home Depot’s anti-union stance and political contributions harm workers’ rights and fair wages, prioritizing corporate profits.",
        alternatives: [
            { name: "Lowe's", url: "https://www.lowes.com", category: "retail" },
        ],
    },
    {
        brand: "Chevron",
        category: "energy",
        image: { webp: "images/chevron.webp", jpg: "images/chevron.jpg" },
        alt: "Chevron - a mega donor to Trump",
        donation: "$30M",
        description: "Donated $30M to Trump in 2024. Chevron, a leading oil and gas company, lobbies against climate regulations to protect its fossil fuel interests.",
        whyBoycott: "Chevron’s actions contribute to climate change and environmental destruction, including oil spills and pollution in vulnerable communities.",
        alternatives: [
            { name: "Shell Renewables", url: "https://www.shell.com", category: "energy" },
        ],
    },
    {
        brand: "Walmart",
        category: "retail",
        image: { webp: "images/walmart.webp", jpg: "images/walmart.jpg" },
        alt: "Walmart - a mega donor to Trump",
        donation: "$25M",
        description: "Donated $25M to Trump in 2024. The Walton family, owners of Walmart, supports policies favoring corporate tax breaks, often at the expense of workers and small businesses.",
        whyBoycott: "Walmart’s low wages, poor working conditions, and role in displacing small businesses harm communities and workers.",
        alternatives: [
            { name: "Target", url: "https://www.target.com", category: "retail" },
        ],
    },
];

export default donors;

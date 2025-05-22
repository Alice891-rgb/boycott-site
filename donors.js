// data/donors.js
const donors = [
    {
        brand: "Pan Am Systems",
        category: "finance",
        image: { webp: "images/pan-am-systems.webp", jpg: "images/pan-am-systems.jpg" },
        alt: "Pan Am Systems - a mega donor to Trump",
        donation: "$125M",
        description: "Donated $125M to Trump in 2024. Mellon, a billionaire heir, funds anti-immigration groups.",
        whyBoycott: "Linked to lobbying for deregulation that harms environmental standards.",
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
        description: "Donated $75M to Trump in 2024. Musk supports deregulation undermining climate initiatives.",
        whyBoycott: "Musk’s deregulation support weakens renewable energy incentives.",
        alternatives: [
            { name: "Rivian", url: "https://www.rivian.com", category: "tech" },
            { name: "Lucid Motors", url: "https://www.lucidmotors.com", category: "tech" },
        ],
    },
    // 其他捐助者（按原 HTML 内容添加，格式类似）
];

export default donors;

// data/donors.js
const donors = [
    {
        brand: "Pan Am Systems",
        category: "finance",
        image: { webp: "images/pan-am-systems.webp", jpg: "images/pan-am-systems.jpg" },
        alt: "Pan Am Systems - 特朗普的主要捐助者",
        donation: "$125M",
        description: "2024年向特朗普捐款1.25億美元。梅隆，銀行財富的億萬富翁繼承人，有資助反移民團體的歷史。",
        whyBoycott: "與推動損害環境標準的管制放寬遊說有關。",
        alternatives: [
            { name: "Aspiration", url: "https://www.aspiration.com", category: "finance" },
            { name: "DHL Green Logistics", url: "https://www.dhl.com", category: "finance" },
        ],
    },
    {
        brand: "Tesla",
        category: "tech",
        image: { webp: "images/tesla.webp", jpg: "images/tesla.jpg" },
        alt: "Tesla - 特朗普的主要捐助者",
        donation: "$75M",
        description: "2024年向特朗普捐款7500萬美元。馬斯克，特斯拉和SpaceX的首席執行官，支持放寬管制，削弱氣候倡議。",
        whyBoycott: "馬斯克支持放寬管制削弱可再生能源激勵措施，與特斯拉的可持續性使命相矛盾。",
        alternatives: [
            { name: "Rivian", url: "https://www.rivian.com", category: "tech" },
            { name: "Lucid Motors", url: "https://www.lucidmotors.com", category: "tech" },
        ],
    },
    {
        brand: "Adelson Family",
        category: "casino",
        image: { webp: "images/adelson-family.webp", jpg: "images/adelson-family.jpg" },
        alt: "Adelson Family - 特朗普的主要捐助者",
        donation: "$100M",
        description: "2024年向特朗普捐款1億美元。Adelson家族擁有拉斯維加斯金沙，長期資助共和黨競選以影響稅收和博彩法規。",
        whyBoycott: "拉斯維加斯金沙因低工資和反對工會化等勞工做法受到批評。",
        alternatives: [
            { name: "Caesars Entertainment", url: "https://www.caesars.com", category: "casino" },
        ],
    },
    {
        brand: "Uline",
        category: "retail",
        image: { webp: "images/uline.webp", jpg: "images/uline.jpg" },
        alt: "Uline - 特朗普的主要捐助者",
        donation: "$60M",
        description: "2024年向特朗普捐款6000萬美元。Uline，一家主要包裝供應商，因反工會政策和過度使用塑料的環境影響受到批評。",
        whyBoycott: "Uline依賴一次性塑料導致環境污染，其反工會立場導致員工工作條件惡劣。",
        alternatives: [
            { name: "EcoEnclose", url: "https://www.ecoenclose.com", category: "retail" },
        ],
    },
    {
        brand: "Koch Industries",
        category: "energy",
        image: { webp: "images/koch-industries.webp", jpg: "images/koch-industries.jpg" },
        alt: "Koch Industries - 特朗普的主要捐助者",
        donation: "$50M",
        description: "2024年向特朗普捐款5000萬美元。Koch Industries，一家能源和化學品企業集團，長期資助反對氣候法規的保守派政策。",
        whyBoycott: "Koch Industries與推遲可再生能源採用的遊說活動

document.addEventListener("DOMContentLoaded", () => {
    // 处理图片加载
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        const placeholder = img.previousElementSibling;
        placeholder.style.display = 'block';
        img.style.display = 'none';

        img.addEventListener('load', () => {
            img.classList.add('loaded');
            placeholder.style.display = 'none';
            img.style.display = 'block';
        });

        img.addEventListener('error', () => {
            img.src = 'https://images.unsplash.com/photo-1593642634367-d91a5a9f8c35?w=800';
            img.classList.add('loaded');
            placeholder.style.display = 'none';
            img.style.display = 'block';

            img.addEventListener('error', () => {
                img.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
                img.classList.add('loaded');
                placeholder.style.display = 'none';
                img.style.display = 'block';
            }, { once: true });
        }, { once: true });
    });

    // 处理投票逻辑
    const voteButtons = document.querySelectorAll('.vote-btn');
    const voteCounts = document.querySelectorAll('.vote-count span');

    // 初始化投票计数
    voteCounts.forEach((countElement, index) => {
        const donorItem = countElement.closest('.donor-item');
        const donorId = donorItem.getAttribute('data-donor');
        const voteCount = localStorage.getItem(`vote-${donorId}`) || 0;
        countElement.textContent = voteCount;
    });

    // 绑定投票按钮事件
    voteButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const donorItem = button.closest('.donor-item');
            const donorId = donorItem.getAttribute('data-donor');
            const countElement = donorItem.querySelector('.vote-count span');

            // 增加投票计数
            let voteCount = parseInt(localStorage.getItem(`vote-${donorId}`) || 0);
            voteCount += 1;

            // 更新本地存储和页面显示
            localStorage.setItem(`vote-${donorId}`, voteCount);
            countElement.textContent = voteCount;
        });
    });
});

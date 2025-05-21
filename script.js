document.addEventListener("DOMContentLoaded", () => {
    // 1. 处理图片加载
    const handleImageLoading = () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            const placeholder = img.previousElementSibling;
            placeholder.style.display = 'block';
            img.style.display = 'none';

            // 图片加载成功
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                placeholder.style.display = 'none';
                img.style.display = 'block';
            });

            // 图片加载失败，提供多层备用图片
            img.addEventListener('error', () => {
                img.src = 'https://images.unsplash.com/photo-1593642532973-d31b97d1e5e3?w=800';
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
    };

    // 2. 处理投票逻辑
    const handleVoting = () => {
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

                // 可选：添加投票成功提示
                alert(`You voted for ${donorItem.querySelector('h3').textContent}! Total votes: ${voteCount}`);
            });
        });
    };

    // 3. 添加滚动效果：当滚动到捐助者列表时，添加动画
    const handleScrollAnimation = () => {
        const donorItems = document.querySelectorAll('.donor-item');
        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        donorItems.forEach(item => observer.observe(item));
    };

    // 4. 添加捐助者筛选功能（可选）
    const handleDonorFilter = () => {
        // 如果未来需要筛选功能，可以在这里添加
        // 例如：根据公司名称筛选捐助者
        const donorItems = document.querySelectorAll('.donor-item');
        // 示例：筛选出公司名称包含 "Uline" 的捐助者
        const filterUline = () => {
            donorItems.forEach(item => {
                const company = item.querySelector('p').textContent;
                if (company.includes('Uline')) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        // 示例：显示所有捐助者
        const showAll = () => {
            donorItems.forEach(item => {
                item.style.display = 'block';
            });
        };

        // 这里可以添加筛选按钮或逻辑
        // 示例：console.log 筛选结果
        console.log("Filter functions are ready. Call filterUline() or showAll() to test.");
    };

    // 5. 添加页面加载完成后的欢迎提示
    const showWelcomeMessage = () => {
        setTimeout(() => {
            console.log("Welcome to Mega Donors to Trump! Page loaded successfully.");
        }, 1000);
    };

    // 6. 处理窗口调整时的布局优化
    const handleResize = () => {
        window.addEventListener('resize', () => {
            // 动态调整图片占位符高度（可选）
            const placeholders = document.querySelectorAll('.image-placeholder');
            placeholders.forEach(placeholder => {
                if (window.innerWidth <= 600) {
                    placeholder.style.height = '150px';
                } else if (window.innerWidth <= 1024) {
                    placeholder.style.height = '200px';
                } else {
                    placeholder.style.height = '250px';
                }
            });
        });
    };

    // 初始化所有功能
    handleImageLoading();
    handleVoting();
    handleScrollAnimation();
    handleDonorFilter();
    showWelcomeMessage();
    handleResize();
});

// 添加 CSS 动画样式（需要在 style.css 中添加）
/*
.donor-item {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.donor-item.fade-in {
    opacity: 1;
}
*//* 动画样式 */
.donor-item {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.donor-item.fade-in {
    opacity: 1;
}

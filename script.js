document.addEventListener("DOMContentLoaded", () => {
    // 处理所有延迟加载的图片
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // 初始状态：显示占位符，隐藏图片
        const placeholder = img.previousElementSibling;
        placeholder.style.display = 'block';
        img.style.display = 'none';

        // 图片加载成功
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            placeholder.style.display = 'none'; // 隐藏占位符
            img.style.display = 'block'; // 显示图片
        });

        // 图片加载失败
        img.addEventListener('error', () => {
            // 尝试加载备用图片
            img.src = 'https://images.unsplash.com/photo-1593642532973-d31b97d1e5e3';
            img.classList.add('loaded');
            placeholder.style.display = 'none'; // 隐藏占位符
            img.style.display = 'block'; // 显示备用图片
        });
    });
});

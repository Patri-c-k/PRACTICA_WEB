document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ЛОГИКА БУРГЕР-МЕНЮ И КАТАЛОГА
    // ==========================================
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogDropdown = document.getElementById('catalogDropdown');
    const categoryItems = document.querySelectorAll('.catalog-dropdown__item');
    const subpanelContents = document.querySelectorAll('.subpanel-content');

    if (catalogBtn && catalogDropdown) {

        catalogBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            catalogDropdown.classList.toggle('open');
            catalogBtn.classList.toggle('catalog-btn--active');
        });

        categoryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const targetCategory = item.getAttribute('data-category');
                const targetPanel = document.getElementById(`cat-${targetCategory}`);

                if (targetPanel) {
                    categoryItems.forEach(el => el.classList.remove('active'));
                    subpanelContents.forEach(el => el.classList.remove('active'));

                    item.classList.add('active');
                    targetPanel.classList.add('active');
                }
            });
        });

        document.addEventListener('click', () => {
            catalogDropdown.classList.remove('open');
            catalogBtn.classList.remove('catalog-btn--active');
        });
    }

    // ==========================================
    // 2. УНИВЕРСАЛЬНАЯ ЛОГИКА СЛАЙДЕРОВ
    // ==========================================
    const initSlider = (sectionId, prevBtnClass, nextBtnClass) => {

        const section = document.getElementById(sectionId);
        if (!section) return;

        const sliderWindow = section.querySelector('.slider-window');
        const grid = section.querySelector('.products-grid');

        const prevBtn = section.querySelector('.' + prevBtnClass);
        const nextBtn = section.querySelector('.' + nextBtnClass);

        if (!sliderWindow || !grid || !prevBtn || !nextBtn) return;

        const getScrollStep = () => {
            const firstCard = grid.querySelector('.product-card');

            if (firstCard) {
                const gap = parseFloat(window.getComputedStyle(grid).gap) || 20;
                return firstCard.offsetWidth + gap;
            }

            return 300;
        };

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();

            sliderWindow.scrollBy({
                left: getScrollStep(),
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();

            sliderWindow.scrollBy({
                left: -getScrollStep(),
                behavior: 'smooth'
            });
        });
    };

    // Слайдеры
    initSlider('slider-months', 'month-prev', 'month-next');
    initSlider('slider-news', 'news-prev', 'news-next');
    initSlider('slider-promo', 'promo-prev', 'promo-next');

});
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
            sliderWindow.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sliderWindow.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });
    };

    initSlider('slider-months', 'month-prev', 'month-next');
    initSlider('slider-news', 'news-prev', 'news-next');
    initSlider('slider-promo', 'promo-prev', 'promo-next');

    // ==========================================
    // ВИДЖЕТ №7: TOOLTIP — Инициализация всех тултипов
    // ==========================================
    const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));

    // ==========================================
    // ВИДЖЕТ №8: POPOVER — Инициализация всех поповеров
    // ==========================================
    const popoverEls = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverEls.forEach(el => new bootstrap.Popover(el, { html: false }));

    // Закрытие поповеров при клике вне
    document.addEventListener('click', (e) => {
        popoverEls.forEach(el => {
            const popoverInstance = bootstrap.Popover.getInstance(el);
            if (popoverInstance && !el.contains(e.target)) {
                popoverInstance.hide();
            }
        });
    });

    // ==========================================
    // ВИДЖЕТ №6: TOAST — Уведомление о добавлении в корзину
    // ВИДЖЕТ №3: OFFCANVAS CART — Логика корзины
    // ==========================================
    const cartToastEl = document.getElementById('cartToast');
    const toastMessage = document.getElementById('toastMessage');
    const cartToast = cartToastEl ? new bootstrap.Toast(cartToastEl, { delay: 3000 }) : null;

    // Данные корзины
    const cart = [];
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    function formatPrice(num) {
        return num.toLocaleString('ru-RU') + ' ₽';
    }

    function renderCart() {
        if (!cartItemsEl) return;
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="text-muted text-center mt-4">Корзина пуста</p>';
            if (cartTotalEl) cartTotalEl.textContent = '0 ₽';
            return;
        }
        let html = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price;
            html += `
              <div class="cart-item">
                <span style="flex:1;padding-right:8px;">${item.name}</span>
                <span style="white-space:nowrap;font-weight:700;color:#1976d2;">${formatPrice(item.price)}</span>
                <button class="cart-item__remove ms-2" data-idx="${idx}" title="Удалить">×</button>
              </div>`;
        });
        cartItemsEl.innerHTML = html;
        if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);

        // Удаление из корзины
        cartItemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.getAttribute('data-idx'));
                cart.splice(i, 1);
                renderCart();
            });
        });
    }

    // Добавление в корзину
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-name') || 'Товар';
            const price = parseInt(btn.getAttribute('data-price')) || 0;
            cart.push({ name, price });
            renderCart();

            // Показываем Toast уведомление
            if (toastMessage) toastMessage.textContent = `✅ «${name}» добавлен в корзину!`;
            if (cartToast) cartToast.show();
        });
    });

    // ==========================================
    // ВИДЖЕТ №5: MODAL — Отправка формы обратной связи
    // ==========================================
    const sendBtn = document.getElementById('sendContactForm');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('contactModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
            // Показываем Toast
            if (toastMessage) toastMessage.textContent = '✅ Ваше сообщение отправлено! Мы свяжемся с вами скоро.';
            if (cartToast) cartToast.show();
        });
    }

    // ==========================================
    // ВИДЖЕТ №10: COLLAPSE — «Читать далее»
    // Меняем текст ссылки при раскрытии
    // ==========================================
    const readMoreBlock = document.getElementById('readMoreBlock');
    const readMoreLink = document.getElementById('readMoreLink');
    if (readMoreBlock && readMoreLink) {
        readMoreBlock.addEventListener('show.bs.collapse', () => {
            readMoreLink.textContent = 'Скрыть ▲';
        });
        readMoreBlock.addEventListener('hide.bs.collapse', () => {
            readMoreLink.textContent = 'Читать далее ▼';
        });
    }

    // ==========================================
    // ВИДЖЕТ №4: SCROLLSPY — активируем Bootstrap Scrollspy
    // ==========================================
    // Bootstrap Scrollspy инициализируется через data-атрибуты на <html>,
    // дополнительно обновляем при необходимости
    const scrollSpyEl = document.body;
    if (scrollSpyEl) {
        try {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNavbar',
                offset: 120
            });
        } catch(e) { /* уже инициализирован через data-атрибут */ }
    }

});

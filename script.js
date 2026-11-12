const pos = (() => {
    // 1. Data Katalog Sesuai Infor 1 & Infor 2
    const catalog = [
        { id: 1, name: 'Iphone 11', price: 1500000, img: 'https://images.unsplash.com/photo-1591337676887-a4b7f058097a?w=400&q=80' },
        { id: 2, name: 'Iphone 12', price: 1800000, img: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&q=80' },
        { id: 3, name: 'Iphone 13 Pro', price: 2000000, img: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80' },
        { id: 4, name: 'Iphone 14 Pro', price: 10000000, img: 'https://images.unsplash.com/photo-1663465374413-83a3c20d4400?w=400&q=80' },
        { id: 5, name: 'Iphone 15', price: 2000000, img: 'https://sl.bing.net/bIuhUj2YYRE' }
    ];

    let cart = [];
    
    // Utilitas Format Uang
    const formatRp = (angka) => 'Rp ' + angka.toLocaleString('id-ID').replace(/,/g, '.');

    // Inisialisasi Alur START -> MENU
    const initApp = () => {
        renderCatalog();
        // Animasi START layar berputar 360 derajat selama 2.5 detik lalu pindah ke Menu
        setTimeout(() => {
            switchScreen('menu-screen');
        }, 2500);
    };

    // Navigasi Transisi Halus
    const switchScreen = (screenId) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    };

    const goToMenu = () => switchScreen('menu-screen');
    const goToCheckout = () => {
        renderCheckout();
        switchScreen('checkout-screen');
    };

    // Render Produk ke Grid
    const renderCatalog = () => {
        const container = document.getElementById('product-catalog');
        container.innerHTML = catalog.map(item => `
            <div class="product-card" onclick="pos.addToCart(${item.id})">
                <img src="${item.img}" alt="${item.name}" class="product-image">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-price">${formatRp(item.price)}</p>
                <button class="btn-secondary">Tambahkan</button>
            </div>
        `).join('');
    };

    // Logika Keranjang (PILIH DAFTAR MENU)
    const addToCart = (id) => {
        const product = catalog.find(p => p.id === id);
        cart.push(product);
        updateCartHeader();
    };

    const getTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

    const updateCartHeader = () => {
        document.getElementById('cart-qty').innerText = cart.length;
        document.getElementById('cart-total').innerText = formatRp(getTotal());
    };

    const renderCheckout = () => {
        const summary = document.getElementById('order-summary');
        if (cart.length === 0) {
            summary.innerHTML = '<p style="color: var(--text-muted);">Belum ada barang dipilih.</p>';
            return;
        }

        let html = '<h3 style="margin-bottom: 24px;">Detail Pesanan</h3>';
        cart.forEach(item => {
            html += `<div class="summary-row"><span>${item.name}</span><span>${formatRp(item.price)}</span></div>`;
        });
        html += `<div class="summary-row total"><span>Total Belanja</span><span>${formatRp(getTotal())}</span></div>`;
        
        summary.innerHTML = html;
        document.getElementById('cash-input').value = '';
        document.getElementById('error-msg').innerText = '';
    };

    // Logika BAYAR & Format Nota FINISH (Logika presisi Infor 2)
    const processTransaction = () => {
        if (cart.length === 0) return document.getElementById('error-msg').innerText = 'Keranjang kosong!';
        
        const cashGiven = parseInt(document.getElementById('cash-input').value);
        const totalCost = getTotal();

        if (isNaN(cashGiven) || cashGiven < totalCost) {
            return document.getElementById('error-msg').innerText = 'Nominal pembayaran kurang atau tidak valid.';
        }

        const change = cashGiven - totalCost;
        generateReceipt(totalCost, cashGiven, change);
    };

    const generateReceipt = (total, cash, change) => {
        const pad = (text, length) => text.padEnd(length, ' ');
        
        // Susunan teks nota presisi sesuai Infor 2
        let receipt = `Uraian pembelian\n`;
        cart.forEach(item => {
            receipt += `${pad(item.name, 23)}${formatRp(item.price)}\n`;
        });
        receipt += `Total                  ${formatRp(total)}\n`;
        receipt += `Uang                   ${formatRp(cash)}\n`;
        receipt += `Kembalian              ${formatRp(change)}\n`;

        document.getElementById('receipt-text').innerHTML = `<pre>${receipt}</pre>`;
        document.getElementById('receipt-modal').classList.add('show');
    };

    // FINISH
    const finishAndReset = () => {
        cart = [];
        updateCartHeader();
        document.getElementById('receipt-modal').classList.remove('show');
        switchScreen('start-screen');
        // Re-trigger animasi opening
        setTimeout(() => switchScreen('menu-screen'), 2500);
    };

    window.onload = initApp;

    return { goToMenu, goToCheckout, addToCart, processTransaction, finishAndReset };
})();
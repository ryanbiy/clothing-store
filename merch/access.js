// Stock Access Control
// Add this to check if shop should be accessible

async function checkShopAccess() {
    // Admin bypass
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        return true;
    }

    try {
        const response = await fetch('products.json');
        const data = await response.json();

        // Check if stockAvailable setting exists
        if (data.shopSettings && data.shopSettings.stockAvailable === false) {
            // Redirect to gate page
            window.location.href = 'gate.html';
            return false;
        }

        // Also check if there's actually any stock
        const categories = ['outerwear', 'tees', 'jeans', 'footwear', 'accessories'];
        let totalStock = 0;

        categories.forEach(cat => {
            if (data[cat]) {
                data[cat].forEach(product => {
                    totalStock += (product.stock || 0);
                });
            }
        });

        if (totalStock === 0) {
            window.location.href = 'gate.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking shop access:', error);
        return true; // Allow access if error
    }
}

// Run check on page load (for non-gate pages)
if (!window.location.pathname.includes('gate.html') &&
    !window.location.pathname.includes('login.html') &&
    !window.location.pathname.includes('admin.html')) {
    checkShopAccess();
}

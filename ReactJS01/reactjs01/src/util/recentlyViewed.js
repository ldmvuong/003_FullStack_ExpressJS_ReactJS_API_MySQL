// Recently Viewed Products - localStorage utilities

const RECENT_PRODUCTS_KEY = 'recent_products';
const MAX_RECENT_PRODUCTS = 6;

export const addRecentlyViewed = (product) => {
    try {
        const { id, name, image, price, ram, rom } = product;
        const recentProduct = { id, name, image, price, ram, rom, viewedAt: Date.now() };
        
        let recent = getRecentlyViewed();
        
        // Remove if already exists
        recent = recent.filter(p => p.id !== id);
        
        // Add to beginning
        recent.unshift(recentProduct);
        
        // Keep only max items
        recent = recent.slice(0, MAX_RECENT_PRODUCTS);
        
        localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(recent));
        
        return recent;
    } catch (error) {
        console.error('Error adding recently viewed:', error);
        return [];
    }
};

export const getRecentlyViewed = () => {
    try {
        const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting recently viewed:', error);
        return [];
    }
};

export const clearRecentlyViewed = () => {
    try {
        localStorage.removeItem(RECENT_PRODUCTS_KEY);
    } catch (error) {
        console.error('Error clearing recently viewed:', error);
    }
};

export const removeFromRecentlyViewed = (productId) => {
    try {
        let recent = getRecentlyViewed();
        recent = recent.filter(p => p.id !== productId);
        localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(recent));
        return recent;
    } catch (error) {
        console.error('Error removing from recently viewed:', error);
        return getRecentlyViewed();
    }
};
// Artwork Categories Data Structure
// Each artwork can have multiple topic and media categories

const artworkCategories = {
    1: {
        topics: ['horses', 'portraits'],
        media: ['oil']
    },
    2: {
        topics: ['horses', 'landscapes'],
        media: ['acrylic']
    },
    3: {
        topics: ['horses', 'nature'],
        media: ['oil']
    },
    4: {
        topics: ['flowers', 'nature'],
        media: ['acrylic']
    },
    5: {
        topics: ['flowers', 'nature'],
        media: ['oil']
    },
    6: {
        topics: ['flowers', 'nature'],
        media: ['acrylic']
    },
    7: {
        topics: ['horses', 'nature'],
        media: ['oil']
    },
    8: {
        topics: ['flowers', 'nature'],
        media: ['soft_pastels']
    },
    9: {
        topics: ['horses', 'portraits'],
        media: ['oil']
    },
    10: {
        topics: ['flowers', 'nature'],
        media: ['oil']
    },
    11: {
        topics: ['horses', 'nature'],
        media: ['acrylic']
    },
    12: {
        topics: ['flowers', 'nature'],
        media: ['soft_pastels']
    },
    13: {
        topics: ['horses', 'landscapes'],
        media: ['oil']
    },
    14: {
        topics: ['flowers', 'landscapes', 'nature'],
        media: ['acrylic']
    },
    15: {
        topics: ['horses', 'nature'],
        media: ['acrylic']
    },
    16: {
        topics: ['flowers', 'nature'],
        media: ['soft_pastels']
    },
    17: {
        topics: ['horses', 'landscapes'],
        media: ['oil']
    },
    18: {
        topics: ['flowers', 'nature'],
        media: ['acrylic']
    },
    19: {
        topics: ['horses', 'portraits'],
        media: ['acrylic']
    },
    20: {
        topics: ['flowers', 'nature'],
        media: ['soft_pastels']
    }
};

// Category display names in Russian
const categoryDisplayNames = {
    topics: {
        nature: 'Природа',
        horses: 'Лошади',
        landscapes: 'Пейзажи',
        flowers: 'Цветы',
        portraits: 'Портреты'
    },
    media: {
        oil: 'Масло',
        acrylic: 'Акрил',
        soft_pastels: 'Пастель'
    }
};

// Get categories for a specific artwork
function getArtworkCategories(artworkId) {
    return artworkCategories[artworkId] || { topics: [], media: [] };
}

// Get all unique categories
function getAllCategories() {
    const allTopics = new Set();
    const allMedia = new Set();
    
    Object.values(artworkCategories).forEach(artwork => {
        artwork.topics.forEach(topic => allTopics.add(topic));
        artwork.media.forEach(medium => allMedia.add(medium));
    });
    
    return {
        topics: Array.from(allTopics),
        media: Array.from(allMedia)
    };
}

// Check if artwork matches filter criteria
function artworkMatchesFilter(artworkId, activeFilters) {
    const artwork = artworkCategories[artworkId];
    if (!artwork) return false;
    
    // If no filters are active, show all artworks
    if (activeFilters.topics.length === 0 && activeFilters.media.length === 0) {
        return true;
    }
    
    // Check if artwork matches any of the active topic filters
    const topicMatch = activeFilters.topics.length === 0 || 
        activeFilters.topics.some(filter => artwork.topics.includes(filter));
    
    // Check if artwork matches any of the active media filters
    const mediaMatch = activeFilters.media.length === 0 || 
        activeFilters.media.some(filter => artwork.media.includes(filter));
    
    // Artwork must match both topic and media filters (if both are active)
    return topicMatch && mediaMatch;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        artworkCategories,
        categoryDisplayNames,
        getArtworkCategories,
        getAllCategories,
        artworkMatchesFilter
    };
}


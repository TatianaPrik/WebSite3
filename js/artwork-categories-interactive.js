// Interactive Category Tags for Artwork Pages
document.addEventListener('DOMContentLoaded', () => {
    initializeInteractiveCategoryTags();
});

function initializeInteractiveCategoryTags() {
    // Get artwork ID from the current page
    const artworkId = getArtworkIdFromUrl();
    if (!artworkId) return;

    // Generate and insert interactive category tags
    const categoryContainer = document.querySelector('.artwork-categories');
    if (categoryContainer) {
        categoryContainer.innerHTML = generateInteractiveCategoryHTML(artworkId);
        addCategoryClickListeners();
    }
}

function getArtworkIdFromUrl() {
    // Extract artwork ID from URL (e.g., artwork-1.html -> 1)
    const path = window.location.pathname;
    const match = path.match(/artwork-(\d+)\.html/);
    return match ? parseInt(match[1]) : null;
}

function generateInteractiveCategoryHTML(artworkId) {
    const categories = getArtworkCategories(artworkId);
    let html = '';
    
    if (categories.topics.length > 0) {
        html += '<div class="category-group">';
        html += '<span class="category-label">Тема:</span>';
        categories.topics.forEach(topic => {
            const displayName = categoryDisplayNames.topics[topic];
            html += `<a href="#" class="category-tag topic-tag clickable" data-type="topics" data-category="${topic}">${displayName}</a>`;
        });
        html += '</div>';
    }
    
    if (categories.media.length > 0) {
        html += '<div class="category-group">';
        html += '<span class="category-label">Материал:</span>';
        categories.media.forEach(medium => {
            const displayName = categoryDisplayNames.media[medium];
            html += `<a href="#" class="category-tag media-tag clickable" data-type="media" data-category="${medium}">${displayName}</a>`;
        });
        html += '</div>';
    }
    
    return html;
}

function addCategoryClickListeners() {
    const categoryTags = document.querySelectorAll('.category-tag.clickable');
    
    categoryTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const type = tag.dataset.type;
            const category = tag.dataset.category;
            navigateToFilteredGallery(type, category);
        });
    });
}

function navigateToFilteredGallery(type, category) {
    // Create URL parameters for the filter
    const params = new URLSearchParams();
    params.set('filter', `${type}:${category}`);
    
    // Navigate to gallery with filter applied
    window.location.href = `index.html?${params.toString()}`;
}

// Function to apply filters from URL parameters on gallery page
function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam && typeof applyFilters === 'function') {
        // Parse filter parameter (e.g., "topics:horses" or "media:oil")
        const [type, category] = filterParam.split(':');
        
        if (type && category) {
            // Reset current filters
            activeFilters = {
                topics: [],
                media: []
            };
            
            // Apply the specific filter
            if (type === 'topics' && activeFilters.topics) {
                activeFilters.topics.push(category);
            } else if (type === 'media' && activeFilters.media) {
                activeFilters.media.push(category);
            }
            
            // Update UI to reflect active filter
            setTimeout(() => {
                const filterButton = document.querySelector(`[data-type="${type}"][data-category="${category}"]`);
                if (filterButton) {
                    filterButton.classList.add('active');
                }
                
                // Apply the filters
                applyFilters();
                updateFilterCounts();
                
                // Show a subtle indication that filtering was applied
                showFilterAppliedNotification(type, category);
            }, 100);
        }
    }
}

function showFilterAppliedNotification(type, category) {
    const displayName = categoryDisplayNames[type][category];
    const notification = document.createElement('div');
    notification.className = 'filter-notification';
    notification.textContent = `Фильтр применен: ${displayName}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add this to the gallery page initialization
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for other scripts to initialize first
        setTimeout(() => {
            applyFiltersFromURL();
        }, 200);
    });
}


// Category Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    let activeFilters = {
        topics: [],
        media: []
    };

    // Initialize filter interface
    initializeFilters();
    
    function initializeFilters() {
        const filterContainer = document.querySelector('.category-filters');
        if (!filterContainer) return;

        // Get all available categories
        const categories = getAllCategories();
        
        // Create topic filters
        const topicFilters = createFilterGroup('topics', categories.topics, 'Тема');
        const mediaFilters = createFilterGroup('media', categories.media, 'Материал');
        
        // Create reset button
        const resetButton = createResetButton();
        
        // Append all filters to container
        filterContainer.appendChild(topicFilters);
        filterContainer.appendChild(mediaFilters);
        filterContainer.appendChild(resetButton);
        
        // Add event listeners
        addFilterEventListeners();
    }
    
    function createFilterGroup(type, categories, title) {
        const group = document.createElement('div');
        group.className = 'filter-group';
        
        const titleElement = document.createElement('span');
        titleElement.className = 'filter-group-title';
        titleElement.textContent = title + ':';
        group.appendChild(titleElement);
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'filter-buttons';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.type = type;
            button.dataset.category = category;
            button.textContent = categoryDisplayNames[type][category];
            buttonsContainer.appendChild(button);
        });
        
        group.appendChild(buttonsContainer);
        return group;
    }
    
    function createResetButton() {
        const resetContainer = document.createElement('div');
        resetContainer.className = 'filter-reset-container';
        
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-filters';
        resetButton.textContent = 'Сбросить фильтры';
        resetButton.addEventListener('click', resetFilters);
        resetContainer.appendChild(resetButton);
        return resetContainer;
    }
    
    function addFilterEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                const category = button.dataset.category;
                
                toggleFilter(type, category, button);
                applyFilters();
                updateFilterCounts();
            });
        });
    }
    
    function toggleFilter(type, category, button) {
        const filterArray = activeFilters[type];
        const index = filterArray.indexOf(category);
        
        if (index > -1) {
            // Remove filter
            filterArray.splice(index, 1);
            button.classList.remove('active');
        } else {
            // Add filter
            filterArray.push(category);
            button.classList.add('active');
        }
    }
    
    function applyFilters() {
        const artworkItems = document.querySelectorAll('.artwork-item, .standard-item');
        let visibleCount = 0;
        
        artworkItems.forEach(item => {
            const artworkId = parseInt(item.dataset.artwork);
            const matches = artworkMatchesFilter(artworkId, activeFilters);
            
            if (matches) {
                item.style.display = '';
                item.classList.remove('filtered-out');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('filtered-out');
            }
        });
        
        // Update results count
        updateResultsCount(visibleCount);
        
        // Trigger layout recalculation for masonry view
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
    
    function resetFilters() {
        activeFilters = {
            topics: [],
            media: []
        };
        
        // Remove active class from all filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show all artworks
        applyFilters();
        updateFilterCounts();
    }
    
    function updateFilterCounts() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            const type = button.dataset.type;
            const category = button.dataset.category;
            
            // Count artworks that would be visible with this filter
            let count = 0;
            Object.keys(artworkCategories).forEach(artworkId => {
                const artwork = artworkCategories[artworkId];
                if (artwork[type].includes(category)) {
                    count++;
                }
            });
            
            // Update button text with count
            const displayName = categoryDisplayNames[type][category];
            button.textContent = `${displayName} (${count})`;
        });
    }
    
    function updateResultsCount(count) {
        let resultsElement = document.querySelector('.filter-results-count');
        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.className = 'filter-results-count';
            const filterContainer = document.querySelector('.category-filters');
            if (filterContainer) {
                filterContainer.appendChild(resultsElement);
            }
        }
        
        const totalCount = Object.keys(artworkCategories).length;
        if (count === totalCount) {
            resultsElement.textContent = '';
        } else {
            resultsElement.textContent = `Показано работ: ${count} из ${totalCount}`;
        }
    }
    
    // Initialize filter counts on page load
    setTimeout(() => {
        updateFilterCounts();
        updateResultsCount(Object.keys(artworkCategories).length);
    }, 100);
});

// Function to get category tags for artwork pages
function getCategoryTagsHTML(artworkId) {
    const categories = getArtworkCategories(artworkId);
    let html = '<div class="artwork-categories">';
    
    if (categories.topics.length > 0) {
        html += '<div class="category-group">';
        html += '<span class="category-label">Тема:</span>';
        categories.topics.forEach(topic => {
            html += `<span class="category-tag topic-tag">${categoryDisplayNames.topics[topic]}</span>`;
        });
        html += '</div>';
    }
    
    if (categories.media.length > 0) {
        html += '<div class="category-group">';
        html += '<span class="category-label">Материал:</span>';
        categories.media.forEach(medium => {
            html += `<span class="category-tag media-tag">${categoryDisplayNames.media[medium]}</span>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}


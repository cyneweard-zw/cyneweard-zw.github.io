document.addEventListener('DOMContentLoaded', function() {
    // Resource data with dates in a format that can be sorted
    const resources = [
        {
            type: 'webinars',
            date: '2023-04-25',
            displayDate: 'April 25, 2023',
            title: 'How the Corrupt Use Legal Tactics to Retaliate Against Whistleblowers',
            description: 'A comprehensive examination of strategic lawsuits and legal tactics used to silence whistleblowers, with practical protection strategies.',
            image: 'webinar-whistleblower.png',
            link: 'webinar-whistleblower.html'
        }
    ];

    // Sort resources by date (newest first)
    resources.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination variables
    let currentPage = 1;
    const cardsPerPage = 4;
    let filteredResources = resources;

    // Function to render resources with pagination
    function renderResources(filteredResources) {
        const container = document.getElementById('resources-container');
        container.innerHTML = ''; // Clear existing content

        // Calculate pagination
        const startIndex = (currentPage - 1) * cardsPerPage;
        const paginatedResources = filteredResources.slice(startIndex, startIndex + cardsPerPage);

        paginatedResources.forEach(resource => {
            // Highlight search terms if present
            let title = resource.title;
            let description = resource.description;
            
            const searchTerm = document.getElementById('resource-search').value.trim().toLowerCase();
            if (searchTerm !== '') {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                title = title.replace(regex, '<span class="search-highlight">$1</span>');
                description = description.replace(regex, '<span class="search-highlight">$1</span>');
            }
            
            const resourceHTML = `
                <div class="resource-card" data-type="${resource.type}">
                    <div class="resource-image">
                        <img src="${resource.image}" alt="${resource.title}">
                    </div>
                    <div class="resource-content">
                        <span class="resource-type">${getResourceTypeName(resource.type)}</span>
                        <span class="date">${resource.displayDate}</span>
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <a href="${resource.link}" class="read-more">${getActionText(resource.type)}</a>
                    </div>
                </div>
            `;
            container.innerHTML += resourceHTML;
        });

        // Create pagination controls
        renderPagination(filteredResources);
    }

    // Function to render pagination controls
    function renderPagination(resources) {
        const totalPages = Math.ceil(resources.length / cardsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        paginationHTML += `<button class="page-button prev-button ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>`;
        
        // Page numbers
        paginationHTML += '<div class="page-numbers">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="page-number ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationHTML += '</div>';
        
        // Next button
        paginationHTML += `<button class="page-button next-button ${currentPage === totalPages ? 'disabled' : ''}" ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>`;
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        document.querySelectorAll('.page-number').forEach(button => {
            button.addEventListener('click', () => {
                currentPage = parseInt(button.getAttribute('data-page'));
                renderResources(filteredResources);
                window.scrollTo({top: document.querySelector('.resources-grid').offsetTop - 100, behavior: 'smooth'});
            });
        });

        document.querySelector('.prev-button').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderResources(filteredResources);
                window.scrollTo({top: document.querySelector('.resources-grid').offsetTop - 100, behavior: 'smooth'});
            }
        });

        document.querySelector('.next-button').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderResources(filteredResources);
                window.scrollTo({top: document.querySelector('.resources-grid').offsetTop - 100, behavior: 'smooth'});
            }
        });
    }

    // Search functionality
    const searchInput = document.getElementById('resource-search');
    const searchButton = document.getElementById('search-button');
    const searchDropdown = document.getElementById('search-dropdown');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Hide dropdown when executing the full search
        searchDropdown.classList.remove('active');
        
        if (searchTerm === '') {
            // If search is empty, reset to filter view
            const activeFilter = document.querySelector('.filter-button.active').getAttribute('data-filter');
            if (activeFilter === 'all') {
                filteredResources = resources;
            } else {
                filteredResources = resources.filter(resource => resource.type === activeFilter);
            }
        } else {
            // Filter based on search term
            const activeFilter = document.querySelector('.filter-button.active').getAttribute('data-filter');
            const baseResources = activeFilter === 'all' ? resources : resources.filter(resource => resource.type === activeFilter);
            
            filteredResources = baseResources.filter(resource => 
                resource.title.toLowerCase().includes(searchTerm) || 
                resource.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Reset to first page
        currentPage = 1;
        renderResources(filteredResources);
    }
    
    // New function to handle search suggestions
    function updateSearchSuggestions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            searchDropdown.classList.remove('active');
            return;
        }
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-button.active').getAttribute('data-filter');
        const baseResources = activeFilter === 'all' ? resources : resources.filter(resource => resource.type === activeFilter);
        
        // Find matching resources
        const matches = baseResources.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm) || 
            resource.description.toLowerCase().includes(searchTerm)
        ).slice(0, 5); // Limit to 5 suggestions
        
        // Clear and populate the dropdown
        searchDropdown.innerHTML = '';
        
        if (matches.length === 0) {
            searchDropdown.classList.remove('active');
            return;
        }
        
        matches.forEach(resource => {
            const itemElement = document.createElement('div');
            itemElement.className = 'search-suggestion-item';
            
            // Highlight matching text
            let title = resource.title;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            title = title.replace(regex, '<span class="search-highlight">$1</span>');
            
            itemElement.innerHTML = `
                <div class="suggestion-type">${getResourceTypeName(resource.type)}</div>
                <div class="suggestion-title">${title}</div>
            `;
            
            // Add click event to select this suggestion
            itemElement.addEventListener('click', () => {
                searchInput.value = resource.title;
                searchDropdown.classList.remove('active');
                performSearch();
            });
            
            searchDropdown.appendChild(itemElement);
        });
        
        searchDropdown.classList.add('active');
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        } else {
            updateSearchSuggestions();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchDropdown.classList.remove('active');
        }
    });

    // Helper function to get resource type display name
    function getResourceTypeName(type) {
        const types = {
            'articles': 'Article',
            'guides': 'Practical Guide',
            'case-studies': 'Case Study',
            'webinars': 'Webinar Recording'
        };
        return types[type] || 'Resource';
    }

    // Helper function to get appropriate action text
    function getActionText(type) {
        const actions = {
            'articles': 'Read Article',
            'guides': 'Download Guide',
            'case-studies': 'Read Case Study',
            'webinars': 'Watch Webinar'
        };
        return actions[type] || 'Learn More';
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Reset search
            searchInput.value = '';
            
            // Filter resources
            const filter = button.getAttribute('data-filter');
            
            if (filter !== 'all') {
                filteredResources = resources.filter(resource => resource.type === filter);
            } else {
                filteredResources = resources;
            }
            
            // Reset to first page when filtering
            currentPage = 1;
            renderResources(filteredResources);
        });
    });

    // Initial render
    renderResources(resources);
});
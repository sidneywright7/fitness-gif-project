// Giphy API Configuration
const API_KEY = 'QW93VHJqdxnT65JZPNpakCmfk4tugXn9';
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';

console.log('API Key loaded:', API_KEY.substring(0, 5) + '...');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const gifContainer = document.getElementById('gifContainer');

// Event Listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Main search function - Initiates a search when user clicks search button or presses Enter
function performSearch() {
    const searchTerm = searchInput.value.trim();
    
    // Validate that user entered something
    if (searchTerm === '') {
        alert('Please enter an exercise name to search!');
        return;
    }
    
    // Enhance search term with fitness keywords for better results
    const enhancedSearchTerm = `${searchTerm} exercise workout`;
    
    // Make API request with enhanced search term
    fetchGifs(enhancedSearchTerm);
}
/// ===================================
// API REQUEST HANDLER
// ===================================
/**
 * Fetches GIF data from Giphy API based on search term
 * @param {string} searchTerm - The exercise name to search for
 */
async function fetchGifs(searchTerm) {
    try {
        // Show loading message
        gifContainer.innerHTML = '<p style="color: white; text-align: center; width: 100%; font-size: 1.2rem;">Loading exercises...</p>';
        
        // Build the API URL with parameters
        const url = `${GIPHY_API_URL}?api_key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=20&rating=g`;
        
        console.log('Fetching URL:', url);
        
        // Fetch data from API
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        console.log('Data received:', data);
        
    // Display the GIFs
    data.data.forEach(gif => {
    // Create container div for each GIF
    const gifItem = document.createElement('div');
    gifItem.classList.add('gif-item');
    
    // Create image element with GIF data
    const img = document.createElement('img');
    img.src = gif.images.fixed_height.url;
    img.alt = gif.title || 'Exercise GIF';
    img.loading = 'lazy';
    
    // Create title element
    const title = document.createElement('p');
    title.textContent = gif.title || 'Exercise';
    title.style.padding = '0.5rem';
    title.style.fontSize = '0.9rem';
    title.style.textAlign = 'center';
    
    // Append image and title to container
    gifItem.appendChild(img);
    gifItem.appendChild(title);
    
    // Append container to main gif grid
    gifContainer.appendChild(gifItem);
});
        
    } catch (error) {
        console.error('Error fetching GIFs:', error);
        gifContainer.innerHTML = `<p style="color: white; text-align: center; width: 100%;">Error: ${error.message}. Check console for details!</p>`;
    }
}

// ===================================
// DOM MANIPULATION
// ===================================
/**
 * Takes array of GIF objects and displays them on the page
 * @param {Array} gifs - Array of GIF objects from Giphy API
 */
function displayGifs(gifs) {
    // Clear previous results
    gifContainer.innerHTML = '';
    
    // Check if any GIFs were returned
    if (gifs.length === 0) {
        gifContainer.innerHTML = '<p style="color: white; text-align: center; width: 100%; font-size: 1.2rem;">No exercises found. Try a different search term!</p>';
        return;
    }
    
    // Loop through each GIF and create HTML elements
    gifs.forEach(gif => {
        // Create a container div for each GIF
        const gifItem = document.createElement('div');
        gifItem.classList.add('gif-item');
        
        // Create image element
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title || 'Exercise GIF';
        img.loading = 'lazy'; // Lazy loading for better performance
        
        // Append image to container
        gifItem.appendChild(img);
        
        // Append container to main gif container
        gifContainer.appendChild(gifItem);
    });
}
// Get the navbar element
const navbar = document.getElementById('mainNavbar');
// Get the menu toggle button
const menuToggle = document.getElementById('menuToggle');
// Get the navigation list
const navList = navbar.querySelector('ul');

// Get Modal elements
const contactModal = document.getElementById('contactModal');
const modalOverlay = contactModal.querySelector('.modal-overlay');
const modalContent = contactModal.querySelector('.modal-content'); 
const modalClose = contactModal.querySelector('.modal-close');
const openContactModalLink = document.getElementById('openContactModal'); 

// Define the scroll threshold (e.g., 50 pixels from the top)
const scrollThreshold = 50;

// Function to handle the scroll event
function handleScroll() {
  // Check the current scroll position
  if (window.scrollY > scrollThreshold) {
    // If scrolled down past the threshold, add the 'scrolled' class
    navbar.classList.add('scrolled');
  } else {
    // If scrolled back up above the threshold, remove the 'scrolled' class
    navbar.classList.remove('scrolled');
  }
}

// Function to toggle the mobile menu visibility
function toggleMenu() {
    navList.classList.toggle('active');
}

// Function to open the modal
function openModal() {
    contactModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

// Function to close the modal
function closeModal() {
    contactModal.classList.remove('visible');
    document.body.style.overflow = '';
}

// Add the scroll event listener to the window
window.addEventListener('scroll', handleScroll);

// Add click event listener to the menu toggle button
menuToggle.addEventListener('click', toggleMenu);

// Also call scroll handler once on page load in case the page is loaded already scrolled
handleScroll();

// Add click event listener to the "Contact" link in the navbar to open the modal
openContactModalLink.addEventListener('click', (event) => {
    event.preventDefault(); 
    openModal();
    if (navList.classList.contains('active')) {
        navList.classList.remove('active');
    }
});

// Add click event listeners to close the modal
modalClose.addEventListener('click', closeModal);

// Close modal if clicking outside the modal content (on the overlay)
contactModal.addEventListener('click', (event) => {
    if (event.target === contactModal || event.target === modalOverlay) {
        closeModal();
    }
});

// Prevent default link behavior for all links within the navigation list,
navList.querySelectorAll('a').forEach(link => {
    if (link.id !== 'openContactModal') { 
        link.addEventListener('click', (event) => {
        });
    }
});
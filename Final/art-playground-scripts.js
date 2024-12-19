// Art Playground Interaction Script
const artPieces = document.querySelectorAll('.art-piece');
const rateButtons = document.querySelectorAll('.rate-btn');

// Add event listeners for art piece clicks (to expand them)
artPieces.forEach(piece => {
    piece.addEventListener('click', () => {
        piece.classList.toggle('expanded');
    });
});

// Add event listeners for rate button clicks
rateButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent expanding the piece when rating
        button.textContent = '❤️';
        button.disabled = true; // Disable rating once clicked
    });
});

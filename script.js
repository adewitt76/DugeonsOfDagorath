// @ts-check
import { Game } from './src/game.js';

// Show custom modal for user interaction (required for audio)
const prepareBtn = document.getElementById('prepare-btn');
const prepareModal = /** @type {HTMLDialogElement} */ (document.getElementById('prepare-modal'));

if (prepareBtn && prepareModal) {
  // Show the dialog when page loads
  prepareModal.showModal();
  
  prepareBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Button clicked, closing modal...');
    
    // Close the modal
    prepareModal.close();
    
    console.log('Modal closed, starting game...');
    
    // Start the game
    const game = Game.instance;
    requestAnimationFrame(game.start);
  });
}


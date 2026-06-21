describe('Create Deck Flow', () => {
  beforeEach(() => {
    cy.loginAsGuest(); 
    cy.visit('http://localhost:5173/create-deck');
  });

  it('should allow a user to successfully create a private deck', () => {
    cy.get('[data-cy="deck-name-input"]').type('Biology 101');
    cy.get('[data-cy="deck-description-input"]').type('Flashcards covering cellular anatomy.');
    
    // Checkbox is true by default, let's verify it's checked
    cy.get('[data-cy="deck-private-checkbox"]').should('be.checked');
    
    cy.get('[data-cy="deck-submit-button"]').click();

    // Verify it routes out of the form page onto the new deck profile view
    cy.url().should('include', '/decks/');
  });
});
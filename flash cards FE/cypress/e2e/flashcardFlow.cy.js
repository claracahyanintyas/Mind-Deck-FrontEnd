describe('Flashcard Core Lifecycle', () => {
    beforeEach(() => {
        cy.loginAsGuest();
    });

    it('should create a deck, add a card, and allow the user to review it', () => {
        cy.visit('http://localhost:5173/create-deck');
        cy.get('[data-cy="deck-name-input"]').type('Cypress Automated Deck');
        cy.get('[data-cy="deck-submit-button"]').click();

        cy.addCard('What is 2 + 2?', '4');

        cy.get('[data-cy="start-review-button"]').click();

        cy.reviewCard('What is 2 + 2?', '4', '[data-cy="grade-easy-button"]');

        cy.contains('Review Completed')
    });
});
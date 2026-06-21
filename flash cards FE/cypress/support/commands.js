import 'cypress-fill-command'

Cypress.Commands.add('register', (username, email, password) => {
    cy.visit('http://localhost:5173/register')
    cy.url().should('include', '/register')
    cy.get('[data-cy=username]').should('exist')
    cy.get('[data-cy=username]').fill(username)
    cy.get('[data-cy=email]').fill(email)
    cy.get('[data-cy=password]').fill(password)
    cy.get('[data-cy=submit-form]').click()
    cy.url().should('include', '/login')
})
Cypress.Commands.add('loginAsGuest', () => {
    cy.visit('http://localhost:5173/login')
    cy.url().should('include', '/login')
    cy.get('[data-cy="guestLogin"]').click()
    cy.url().should('include', '/')
})
Cypress.Commands.add('logout', () => {
    cy.visit('http://localhost:5173/logout')
    cy.url().should('include', '/logout')
    cy.get('button[type="submit"]').click()
    cy.contains('Welcome')
})
// Command to add a brand new flashcard to a deck
Cypress.Commands.add('addCard', (frontText, backText) => {
    // If the form isn't open yet, toggle it open
cy.get('[data-cy="add-card-toggle-button"]').click();

    // Fill out and submit the card form
    cy.get('[data-cy="new-card-front-input"]').type(frontText);
    cy.get('[data-cy="new-card-back-input"]').type(backText);
    cy.get('[data-cy="new-card-submit-button"]').click();

    // Verify the card appears down in the list layout
    cy.get('[data-cy="card-list"]').should('contain', frontText);
});

// Command to execute a complete active flashcard study review cycle
Cypress.Commands.add('reviewCard', (expectedFront, expectedBack, selfGradeButtonSelector) => {
    // 1. Verify you are seeing the right question upfront
    cy.get('[data-cy="review-front-text"]').should('contain', expectedFront);
    
    // 2. Click to flip the card over to reveal the answer side
    cy.get('[data-cy="flip-card-button"]').click();
    
    // 3. Verify the hidden back answers are now visible
    cy.get('[data-cy="review-back-text"]').should('contain', expectedBack);
    
    // 4. Click your self-grade score button (e.g., '[data-cy="grade-easy-button"]')
    cy.get(selfGradeButtonSelector).click();
});
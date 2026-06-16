// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })>
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
Cypress.Commands.add('login', (username, password) => {
    cy.visit('http://localhost:5173/login')
    cy.url().should('include', '/login')
    cy.get('[data-cy="usernameOrEmail"]').type(username)
    cy.get('[data-cy="password"]').type(password)
    cy.get('[data-cy="submit-form"]').click()
    cy.contains('logged in')
})
Cypress.Commands.add('createPayoutMethod', (type, providerName, accountName, accountNumber) => {
    cy.visit('http://localhost:5173/payout-methods/create')
    cy.url().should('include', '/payout-methods/create')
    cy.get("select").select(type);
    cy.get("input[name='providerName']").type(providerName);
    cy.get("input[name='accountName']").type(accountName);
    cy.get("input[name='accountNumber']").type(accountNumber);
    cy.get("button[type='submit']").click();
    cy.url().should('include', '/users')
})
Cypress.Commands.add('logout', () => {
    cy.visit('http://localhost:5173/logout')
    cy.url().should('include', '/logout')
    cy.get('button[type="submit"]').click()
    cy.contains('Welcome')
})
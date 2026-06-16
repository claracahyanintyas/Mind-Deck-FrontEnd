import Chance from 'chance'
const username = chance.string();
const email = chance.email();
const username2 = chance.string();
const email2 = chance.email();
const password = chance.string();

describe('Registration Flow', () => {
    it('should register successfully', () => {
        cy.visit('http://localhost:5173/register')
        cy.url().should('include', '/register')
        cy.get('[data-cy=username]').should('exist')
        cy.get('[data-cy=username]').fill(username)
        cy.get('[data-cy=email]').fill(email)
        cy.get('[data-cy=password]').fill(password)
        cy.get('[data-cy=submit-form]').click()
        cy.contains('Successfully registered')
    })
})
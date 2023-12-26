/// <reference types="cypress" />
import { LandingPageObject } from '../../page-objects/LandingPageObject';
import { CleverScreeningPageObject } from '../../page-objects/CleverScreeningPageObject';
import * as constants from 'src/constants';
const landingPage = new LandingPageObject();
const cleverScreeningPage = new CleverScreeningPageObject();

describe('When app is opened', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    })

    it('should load the login page',() => {
        landingPage.loginButton().should('exist');
    });

    describe('when user leave the input fields empty and clicks the login button', () => {
        it('should not open the clever screen dashboard', function () {
            landingPage.loginButton().click({force: true})
            cy.wait(1000);
            cleverScreeningPage.sidebar().should('not.exist');
        });
    })

    describe('When user provides invalid credentials', () => {
        it('should show an error notification which says "Invalid credentials"', function () {
            landingPage.usernameInput().type('invalid');
            landingPage.passwordInput().type('invalid');
            landingPage.loginButton().click({force: true})
            cy.wait(1000);
            landingPage.invalidCredentialsNotification().should('have.text', constants.TEXT_INVALID_CREDENTIALS)
        });
    })

    describe('When user provides valid credentials', () => {
        it('should show clever screen dashboard', function () {
            landingPage.usernameInput().type('test@gmail.com');
            landingPage.passwordInput().type('secret123');
            landingPage.loginButton().click({force: true})
            cy.wait(1000);
            cleverScreeningPage.sidebar().should('exist');
        });
    })
});

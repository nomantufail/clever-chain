/// <reference types="cypress" />
export class LandingPageObject {
    loginButton() {
        return cy.get('button[type="submit"]').first();
    }

    usernameInput() {
        return cy.get('#username');
    }

    passwordInput() {
        return cy.get('#password');
    }

    invalidCredentialsNotification() {
        return cy.get('.Toastify__toast-body')
    }
}

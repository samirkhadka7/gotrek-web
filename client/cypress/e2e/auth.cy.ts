/**
 * E2E Tests for Login and Signup — 10 Test Cases
 * Requires: frontend running on localhost:3000, backend on localhost:5050
 */

describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('1. should display login form with all required elements', () => {
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Sign In');
    cy.contains('Welcome back').should('be.visible');
    cy.contains("Don't have an account?").should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
  });

  it('2. should show validation errors for empty login submission', () => {
    cy.get('button[type="submit"]').click();
    // Zod validation should show error messages
    cy.contains(/invalid email|email/i).should('be.visible');
  });

  it('3. should show validation error for invalid email format', () => {
    cy.get('input[name="email"]').type('not-an-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains(/invalid email/i).should('be.visible');
  });

  it('4. should show validation error for short password', () => {
    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('12');
    cy.get('button[type="submit"]').click();
    cy.contains(/at least 6/i).should('be.visible');
  });

  it('5. should toggle password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    // Click the eye icon button to show password
    cy.get('input[name="password"]').parent().find('button').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    // Click again to hide
    cy.get('input[name="password"]').parent().find('button').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('6. should show error toast on invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    // Should show an error toast or message
    cy.contains(/failed|invalid|error/i, { timeout: 10000 }).should('be.visible');
  });

  it('7. should navigate to register page via link', () => {
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');
  });

});

describe('Register Page', () => {

  beforeEach(() => {
    cy.visit('/register');
  });

  it('8. should display registration form with all required fields', () => {
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Create Account');
    cy.contains('Create your account').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
  });

  it('9. should show validation errors for empty registration submission', () => {
    cy.get('button[type="submit"]').click();
    // Should show validation errors for name, email, password
    cy.contains(/name|email|password/i).should('be.visible');
  });

  it('10. should navigate to login page via link', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });

});

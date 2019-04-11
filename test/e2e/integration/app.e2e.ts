describe('Landing page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the page and display the initial page title', () => {
    cy.title().should('equal', 'Home | Steem Engine');
  });

  // it('should display greeting', () => {
  //   cy.get('h2').contains('Welcome to the Aurelia Navigation App!');
  // });
});

context('Actions', () => {
  beforeEach(() => {
    cy.visit('localhost:8081');
  })

  it('should render simple app with menu and one microfrontend', () => {
    cy.get('.App__menu-item').should('have.length', 1);
  });
})

beforeEach(() => {
  cy.resetDatabase();
});

describe("Testing page changes", () => {
  it("should be able to go to Top page", () => {
    cy.visit("http://localhost:3000/");

    cy.createRecommendation();

    cy.contains("Top").click();

    cy.contains("0").should("be.visible");

    cy.url().should("equal", "http://localhost:3000/top");
  });

  it("should be able to go to Random page", () => {
    cy.visit("http://localhost:3000/");

    cy.createRecommendation();

    cy.contains("Random").click();

    cy.contains("0").should("be.visible");

    cy.url().should("equal", "http://localhost:3000/random");
  });
});

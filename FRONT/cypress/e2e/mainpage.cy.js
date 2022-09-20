describe("Testing /", () => {
  it("should create new recomendation", () => {
    cy.visit("http://localhost:3000/");

    cy.get('input[placeholder="Name"]').type("teste");
    cy.get('input[placeholder="https://youtu.be/..."]').type("teste");
    // cy.contains("svg").click();

    cy.url().should("equal", "http://localhost:3000/");
  });
});

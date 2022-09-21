beforeEach(() => {
  cy.resetDatabase();
});

describe("Testing interactions", () => {
  it("should be able to upVote", () => {
    cy.visit("http://localhost:3000/");

    cy.createRecommendation();

    cy.intercept("GET", `http://localhost:5009/recommendations`).as(
      "loadRecom"
    );
    cy.wait("@loadRecom");

    cy.get("#upVote").click();

    cy.contains("1").should("be.visible");
  });

  it("should be able to downVote", () => {
    cy.visit("http://localhost:3000/");

    cy.createRecommendation();

    cy.intercept("GET", `http://localhost:5009/recommendations`).as(
      "loadRecom"
    );
    cy.wait("@loadRecom");

    cy.get("#downVote").click();

    cy.contains("-1").should("be.visible");
  });

  it("should be able to eliminate recommendation by downVoting 6 times", () => {
    cy.visit("http://localhost:3000/");

    cy.createRecommendation();

    cy.intercept("GET", `http://localhost:5009/recommendations`).as(
      "loadRecom"
    );
    cy.wait("@loadRecom");

    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();

    cy.contains("No recommendations yet! Create your own :)").should(
      "be.visible"
    );
  });
});

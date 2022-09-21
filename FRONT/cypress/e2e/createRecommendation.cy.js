import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetDatabase();
});

describe("Testing /", () => {
  it("should create new recomendation", () => {
    const newRecommendation = {
      name: faker.name.firstName(),
      YTUrl: "https://www.youtube.com/watch?v=AyvLFfg9bPk",
    };
    cy.visit("http://localhost:3000/");

    cy.get("#name").type(newRecommendation.name);
    cy.get("#url").type(newRecommendation.YTUrl);
    cy.intercept("POST", `http://localhost:5009/recommendations`).as(
      "newRecom"
    );

    cy.get("#button").click();

    cy.wait("@newRecom");

    cy.contains(newRecommendation.name).should("be.visible");
  });
});

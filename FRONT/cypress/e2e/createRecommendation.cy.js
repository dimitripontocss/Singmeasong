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

  it("should fail to create new recomendation with wrong link", () => {
    const newRecommendation = {
      name: faker.name.firstName(),
      YTUrl:
        "https://bootcampra.notion.site/Materiais-0750a51f86f04626bd2303e9f7c51cd0",
    };
    cy.visit("http://localhost:3000/");

    cy.get("#name").type(newRecommendation.name);
    cy.get("#url").type(newRecommendation.YTUrl);
    cy.intercept("POST", `http://localhost:5009/recommendations`).as(
      "newRecom"
    );

    cy.get("#button").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error creating recommendation!");
    });
  });

  it("should fail to create new recomendation with same name", () => {
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

    cy.get("#name").type(newRecommendation.name);
    cy.get("#url").type(newRecommendation.YTUrl);
    cy.intercept("POST", `http://localhost:5009/recommendations`).as(
      "newRecom2"
    );

    cy.get("#button").click();

    cy.wait("@newRecom2");

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error creating recommendation!");
    });
  });
});

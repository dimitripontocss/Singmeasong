import { faker } from "@faker-js/faker";

Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", `http://localhost:5009/e2e/reset`, {});
});

Cypress.Commands.add("createRecommendation", () => {
  const newRecommendation = {
    name: faker.name.firstName(),
    YTUrl: "https://www.youtube.com/watch?v=AyvLFfg9bPk",
  };
  cy.request("POST", `http://localhost:5009/recommendations`, {
    name: newRecommendation.name,
    youtubeLink: newRecommendation.YTUrl,
  });
});

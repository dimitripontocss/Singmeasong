import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";

import {
  createScenarioWithRecommendationPosted,
  deleteAllData,
  disconnectPrisma,
} from "./factories/scenarioFactory";
import { createRecommendation } from "./factories/recommendationFactory";

beforeEach(async () => {
  await deleteAllData();
});

const server = supertest(app);

describe("Testing recomendation routers", () => {
  it("Testing POST / with valid information", async () => {
    const recommendationData = await createRecommendation();

    const result = await server
      .post("/recommendations/")
      .send(recommendationData);

    const verifier = await prisma.recommendation.findFirst({
      where: {
        name: recommendationData.name,
      },
    });

    expect(result.status).toBe(201);
    expect(verifier).not.toBeNull();
  });

  it("Testing GET / ", async () => {
    const insertedRecommendation =
      await createScenarioWithRecommendationPosted();

    const result = await server.get("/recommendations/");

    expect(result.status).toBe(200);
    expect(result.body[0].name).toEqual(insertedRecommendation.name);
  });
});

afterAll(async () => {
  await disconnectPrisma();
});

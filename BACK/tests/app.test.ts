import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";

import {
  createRecommendationWith5Downvotes,
  createScenarioWithRecommendationPosted,
  deleteAllData,
  disconnectPrisma,
} from "./factories/scenarioFactory";
import { createRecommendation } from "./factories/recommendationFactory";

beforeEach(async () => {
  await deleteAllData();
});

const server = supertest(app);

describe("Testing POST recomendation routers", () => {
  it("Testing POST /recommendations with valid information", async () => {
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

  it("Testing POST /recommendations with same name", async () => {
    const recommendationData = await createScenarioWithRecommendationPosted();
    const result = await server.post("/recommendations/").send({
      name: recommendationData.name,
      youtubeLink: recommendationData.youtubeLink,
    });

    expect(result.status).toBe(409);
  });

  it("Testing POST /recommendations with invalid information", async () => {
    const recommendationData = null;

    const result = await server
      .post("/recommendations/")
      .send(recommendationData);

    expect(result.status).toBe(422);
  });

  it("Testing POST /recommendations/:id/upvote", async () => {
    const insertedRecommendation =
      await createScenarioWithRecommendationPosted();

    const result = await server.post(
      `/recommendations/${insertedRecommendation.id}/upvote`
    );

    const verifier = await prisma.recommendation.findFirst({
      where: {
        id: insertedRecommendation.id,
      },
    });

    expect(result.status).toBe(200);
    expect(verifier.score).toBe(1);
  });

  it("Testing POST /recommendations/:id/upvote with a unexisting id", async () => {
    const result = await server.post(`/recommendations/5/upvote`);

    expect(result.status).toBe(404);
  });

  it("Testing POST /recommendations/:id/downvote", async () => {
    const insertedRecommendation =
      await createScenarioWithRecommendationPosted();

    const result = await server.post(
      `/recommendations/${insertedRecommendation.id}/downvote`
    );

    const verifier = await prisma.recommendation.findFirst({
      where: {
        id: insertedRecommendation.id,
      },
    });

    expect(result.status).toBe(200);
    expect(verifier.score).toBe(-1);
  });

  it("Testing if a recommendation with a score minor than -5 is deleted", async () => {
    const insertedRecommendation = await createRecommendationWith5Downvotes();
    const lastApearence = await prisma.recommendation.findFirst({
      where: {
        id: insertedRecommendation.id,
      },
    });
    await server.post(`/recommendations/${insertedRecommendation.id}/downvote`);

    const verifier = await prisma.recommendation.findFirst({
      where: {
        id: insertedRecommendation.id,
      },
    });
    expect(lastApearence.score).toBe(-5);
    expect(verifier).toBeNull();
  });

  it("Testing POST /recommendations/:id/downvote with a unexisting id", async () => {
    const result = await server.post(`/recommendations/5/downvote`);

    expect(result.status).toBe(404);
  });
});

describe("Testing GET recomendation routers", () => {
  it("Testing GET /recommendations and should list recommendations ", async () => {
    const insertedRecommendation =
      await createScenarioWithRecommendationPosted();

    const result = await server.get("/recommendations/");

    expect(result.status).toBe(200);
    expect(result.body[0].name).toEqual(insertedRecommendation.name);
  });

  it("Testing GET /recommendations/:id and should list recommendation", async () => {
    const insertedRecommendation =
      await createScenarioWithRecommendationPosted();

    const result = await server.get(
      `/recommendations/${insertedRecommendation.id}`
    );

    expect(result.body.name).toEqual(insertedRecommendation.name);
    expect(result.status).toBe(200);
  });

  it("Testing GET /recommendations/random and should list recommendation", async () => {
    await createScenarioWithRecommendationPosted();
    const result = await supertest(app).get("/recommendations/random");
    expect(result.status).toBe(200);
  });

  it("Testing GET /recommendations/random with no recommendation registered and should fail", async () => {
    const result = await server.get("/recommendations/random");

    expect(result.status).toBe(404);
  });

  it("Testing GET /recommendations/top/:amount and should list recommendations", async () => {
    const result = await server.get("/recommendations/top/0");

    expect(result.body.length).toBe(0);
  });

  it("Testing GET /recommendations/top/:amount and should list recommendations", async () => {
    await createScenarioWithRecommendationPosted();
    await createScenarioWithRecommendationPosted();
    await createScenarioWithRecommendationPosted();
    const result = await server.get("/recommendations/top/3");

    expect(result.body.length).toBe(3);
  });
});

afterAll(async () => {
  await disconnectPrisma();
});

import { prisma } from "../../src/database";
import { createRecommendation } from "./recommendationFactory";

export async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations`,
  ]);
}

export async function createScenarioWithRecommendationPosted() {
  const data = await createRecommendation();
  return await prisma.recommendation.create({
    data,
  });
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}

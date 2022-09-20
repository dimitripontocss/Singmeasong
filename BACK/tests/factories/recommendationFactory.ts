import { faker } from "@faker-js/faker";

export async function createRecommendation() {
  return {
    name: faker.name.firstName(),
    youtubeLink: "https://www.youtube.com/watch?v=juWM6saNCZk",
  };
}

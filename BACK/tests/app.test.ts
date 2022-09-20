import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import { deleteAllData, disconnectPrisma } from "./factories/scenarioFactory";

beforeEach(async () => {
  await deleteAllData();
});

const server = supertest(app);

describe("Testes com usuário", () => {
  it("Testa POST /sing-up passando usuário válido", async () => {});
});

describe("Testes com provas", () => {
  it("Testa se cria um prova com sucesso", async () => {});
});

afterAll(async () => {
  await disconnectPrisma();
});

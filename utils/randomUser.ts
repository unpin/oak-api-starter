import { generateHexString } from "./generateHexString.ts";

const userNames = ["Lincoln", "Brisa", "Steve", "Destiny", "Lukas"];
const userSurnames = ["Case", "Burke", "Graham", "Bradley", "Mclaughlin"];

function getRandomItem(array: unknown[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function createRandomUser() {
  return {
    name: getRandomItem(userNames) + " " + getRandomItem(userSurnames),
    email: crypto.randomUUID().replaceAll("-", "") + "@example.com",
    password: generateHexString(),
  };
}

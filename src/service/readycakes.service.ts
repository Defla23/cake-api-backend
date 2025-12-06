import * as cakeRepository from "../repositories/readycakes.repository";
import { Cake } from "../types/readycakes.types";

export const listCakes = async () => {
  return await cakeRepository.getAllCakes();
};

export const getCake = async (id: number) => {
  if (isNaN(id)) {
    throw new Error("Invalid cake ID");
  }

  const cake = await cakeRepository.getCakeById(id);
  if (!cake) {
    throw new Error("Cake not found");
  }

  return cake;
};

export const createCake = async (cakeData: Cake) => {
  if (!cakeData.cakeName || !cakeData.flavorsUsed || !cakeData.size) {
    throw new Error("cakeName, flavorsUsed, and size are required");
  }

  const newCake = await cakeRepository.createCake(cakeData);
  return newCake;
};

export const updateCake = async (id: number, cakeData: Partial<Cake>) => {
  const existingCake = await cakeRepository.getCakeById(id);
  if (!existingCake) {
    throw new Error("Cake not found");
  }

  await cakeRepository.updateCake(id, cakeData);
  return { message: "Cake updated successfully" };
};

export const deleteCake = async (id: number) => {
  const existingCake = await cakeRepository.getCakeById(id);
  if (!existingCake) {
    throw new Error("Cake not found");
  }

  await cakeRepository.deleteCake(id);
  return { message: "Cake deleted successfully" };
};

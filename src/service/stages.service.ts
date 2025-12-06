import * as stagesRepository from "../repositories/stages.repository";
import { Stage } from "../types/stages.types";

export const getStages = async () => {
  return await stagesRepository.getAllStages();
};

export const getStagesByOrderId = async (orderId: number) => {
  return await stagesRepository.getOrderStages(orderId);
};

export const addNewStage = async (stage: Stage) => {
  return await stagesRepository.addStage(stage);
};

export const getStageDetails = async (stageId: number) => {
  const stage = await stagesRepository.getStageById(stageId);
  if (!stage) {
    throw new Error("Stage not found");
  }
  return await stagesRepository.getStageById(stageId);
};

export const changeStageStatus = async (Id: number, status: string) => {
  const stage = await stagesRepository.getStageById(Id);
  if (!stage) {
    throw new Error("Stage not found");
  }
  await stagesRepository.updateStageStatus(Id, status);
  return { message: "Stage status updated successfully" };
};

export const removeStage = async (Id: number) => {
  const stage = await stagesRepository.getStageById(Id);
  if (!stage) {
    throw new Error("Stage not found");
  }
  await stagesRepository.deleteStageById(Id);
  return { message: "Stage removed successfully" };
};

export const completeStage = async (Id: number) => {
  const stage = await stagesRepository.getStageById(Id);
  if (!stage) {
    throw new Error("Stage not found");
  }
  await stagesRepository.markStageAsCompleted(Id);
  return { message: "Stage marked as completed" };
};

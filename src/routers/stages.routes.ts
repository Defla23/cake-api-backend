import * as stagesController from "../Controllers/stages.controller";

export const registerStageRoutes = (app: any) => {
  app.get("/stages", stagesController.fetchStages);
  app.post("/stages", stagesController.createStage);
  app.get("/stages/order/:orderId", stagesController.fetchStagesByOrderId);
  app.get("/stages/:stageId", stagesController.fetchStageDetails);
  app.patch("/stages/:stageId", stagesController.updateStage);
  app.post("/stages/:stageId/complete", stagesController.completeStage);
  app.delete("/stages/:stageId", stagesController.deleteStage);
};

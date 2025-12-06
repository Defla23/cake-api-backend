import { Express } from "express";
import * as designController from "../Controllers/design.controller";

export default function registerDesignRoutes(app: any) {
  app.get("/designs", designController.getAllDesigns);
  app.get("/designs/:id", designController.getDesign);
  app.post("/designs", designController.createDesign);
  app.put("/designs/:id", designController.updateDesign);
  app.delete("/designs/:id", designController.deleteDesign);
}

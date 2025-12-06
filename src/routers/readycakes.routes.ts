import { Express } from "express";
import * as cakeController from "../Controllers/readycakes.controller";
import { adminOnly } from "../middlewares/auth.middlewares";


export default function registerCakeRoutes(app: Express) {
  // ⭐ PUBLIC ROUTES: Anyone can access
  app.get("/api/readycakes", cakeController.getCakes);       // List all cakes
  app.get("/api/readycakes/:id", cakeController.getCake);    // Get single cake

  // 🔐 ADMIN-PROTECTED ROUTES: Only admin can access
  app.post("/api/readycakes",  cakeController.addCake);
  app.put("/api/readycakes/:id",  cakeController.updateCake);
  app.delete("/api/readycakes/:id", cakeController.deleteCake);

  //  app.post("/api/readycakes", adminOnly, cakeController.addCake);
  // app.put("/api/readycakes/:id", adminOnly, cakeController.updateCake);
  // app.delete("/api/readycakes/:id", adminOnly, cakeController.deleteCake);

}

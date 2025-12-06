import { Application, application } from "express";
import * as userController from "../Controllers/user.controller";
//import { adminOnly, userOnly } from "../middlewares/auth.middlewares";

export default function registerUserRoutes(app: Application) {
  app.post("/users/register", userController.createUserController);
  app.post("/users/login", userController.loginUserController);
  app.get("/users", userController.getAllUsersController);
  app.get("/users/:id", userController.getUserByIdController);
  app.put("/users/:id", userController.updateUserRolesController);
  app.delete("/users/:id", userController.deleteUserController);
  app.post("/users/verify", userController.verifyUserController);
  app.post("/users/verify/resend", userController.resendVerificationController);
}

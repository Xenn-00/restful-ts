import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserController } from "../controller/user.controller";

export const privateRouter = express.Router();
privateRouter.use(authMiddleware);

privateRouter.get("/api/v1/users/current", UserController.get);
privateRouter.get("/api/v1/users/refresh", UserController.refresh);
privateRouter.patch("/api/v1/users/current", UserController.update);
privateRouter.delete("/api/v1/users/logout", UserController.logout);

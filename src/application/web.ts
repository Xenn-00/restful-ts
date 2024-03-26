import { configDotenv } from "dotenv";
import express from "express";
import { errorMiddleware } from "../middleware/error.middleware";
import { publicRouter } from "../router/public-api";
import { privateRouter } from "../router/private-api";
import cookieParser from "cookie-parser";

configDotenv();
export const web = express();

web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);

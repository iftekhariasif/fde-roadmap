import express from "express";
import { todoRouter } from "./routes/todos";

const app = express();
app.use(express.json());
app.use("/todos", todoRouter);

export default app;

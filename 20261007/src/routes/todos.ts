import { Router, Request, Response } from "express";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

export function resetTodos(): void {
  todos = [];
  nextId = 1;
}

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  res.json(todos);
});

router.post("/", async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const todo: Todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    res.status(404).json({ error: "todo not found" });
    return;
  }
  res.json(todo);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: "todo not found" });
    return;
  }
  todos.splice(index, 1);
  res.status(204).send();
});

export { router as todoRouter };

import request from "supertest";
import app from "../src/app";
import { resetTodos } from "../src/routes/todos";

beforeEach(() => {
  resetTodos();
});

describe("GET /todos/:id", () => {
  it("should return a todo by id", async () => {
    const created = await request(app)
      .post("/todos")
      .send({ title: "Buy milk" });

    const res = await request(app).get(`/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("should return 404 for a non-existent todo", async () => {
    const res = await request(app).get("/todos/999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("todo not found");
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete an existing todo and return 204", async () => {
    const created = await request(app)
      .post("/todos")
      .send({ title: "Buy milk" });

    const res = await request(app).delete(`/todos/${created.body.id}`);
    expect(res.status).toBe(204);

    const list = await request(app).get("/todos");
    expect(list.body).toHaveLength(0);
  });

  it("should return 404 for a non-existent todo", async () => {
    const res = await request(app).delete("/todos/999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("todo not found");
  });

  it("should only delete the specified todo", async () => {
    await request(app).post("/todos").send({ title: "First" });
    const second = await request(app).post("/todos").send({ title: "Second" });

    await request(app).delete(`/todos/${second.body.id}`);

    const list = await request(app).get("/todos");
    expect(list.body).toHaveLength(1);
    expect(list.body[0].title).toBe("First");
  });
});

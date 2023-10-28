import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { Index } from "./components/Index";
import { Todo } from "./todo";

let TODOS: Todo[] = [
  {
    id: crypto.randomUUID(),
    name: "Taste htmx",
    done: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Buy a unicorn",
    done: false,
  },
];

const app = new Hono();

app.get("/", (c) => {
  const { filter } = c.req.query();

  return c.html(<Index todos={TODOS} filter={filter} />);
});

app.post("/todos", async (c) => {
  const { filter } = c.req.query();
  const { todo: name } = await c.req.parseBody();

  const newTodo = {
    id: crypto.randomUUID(),
    name: typeof name === "string" ? name : "",
    done: false,
  };

  TODOS = [newTodo, ...TODOS];

  return c.redirect("/?filter=" + filter);
});

app.get("/todos/edit/:id", (c) => {
  const { filter } = c.req.query();
  const id = c.req.param("id");

  const todo = TODOS.find((t) => t.id === id)!;

  return c.redirect("/?filter=" + filter);
});

app.post("/todos/toggle/:id", (c) => {
  const { filter } = c.req.query();
  const { id } = c.req.param();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.done = !todo.done;

  return c.redirect("/?filter=" + filter);
});

app.post("/todos/update/:id", async (c) => {
  const { filter } = c.req.query();
  const { id } = c.req.param();
  const body = await c.req.parseBody();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.name = typeof body.name == "string" ? body.name : "";

  return c.redirect("/?filter=" + filter);
});

app.post("/todos/delete/:id", (c) => {
  const { filter } = c.req.query();
  const id = c.req.param("id");
  TODOS = TODOS.filter((t) => t.id !== id)!;

  return c.redirect("/?filter=" + filter);
});

app.post("/todos/clear-completed", (c) => {
  const { filter } = c.req.query();

  TODOS = TODOS.filter((t) => !t.done);

  return c.redirect("/?filter=" + filter);
});

app.post("/todos/toggle-all", (c) => {
  const { filter } = c.req.query();
  const all = TODOS.every((todo) => todo.done);
  TODOS.forEach((todo) => (todo.done = !all));

  return c.redirect("/?filter=" + filter);
});

app.use("/*", serveStatic({ root: "./assets/" }));

export default app;

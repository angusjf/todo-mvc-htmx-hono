import { Context, Hono } from "hono";
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

function redirectKeepQuery(
  c: Context,
  path: string
): ReturnType<Context["redirect"]> {
  const q = new URLSearchParams(c.req.query());
  return c.redirect(path + "?" + q);
}

app.get("/", (c) => {
  const { filter } = c.req.query();

  return c.html(<Index todos={TODOS} filter={filter} />);
});

app.post("/todos", async (c) => {
  const { todo: name } = await c.req.parseBody();

  const newTodo = {
    id: crypto.randomUUID(),
    name: typeof name === "string" ? name : "",
    done: false,
  };

  TODOS = [newTodo, ...TODOS];

  return redirectKeepQuery(c, "/");
});

app.post("/todos/toggle/:id", (c) => {
  const { id } = c.req.param();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.done = !todo.done;

  return redirectKeepQuery(c, "/");
});

app.post("/todos/update/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.parseBody();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.name = typeof body.name == "string" ? body.name : "";

  return redirectKeepQuery(c, "/");
});

app.post("/todos/delete/:id", (c) => {
  const id = c.req.param("id");
  TODOS = TODOS.filter((t) => t.id !== id)!;

  return redirectKeepQuery(c, "/");
});

app.post("/todos/clear-completed", (c) => {
  TODOS = TODOS.filter((t) => !t.done);

  return redirectKeepQuery(c, "/");
});

app.post("/todos/toggle-all", (c) => {
  const all = TODOS.every((todo) => todo.done);
  TODOS.forEach((todo) => (todo.done = !all));

  return redirectKeepQuery(c, "/");
});

app.use("/*", serveStatic({ root: "./assets/" }));

export default app;

import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { TodoList } from "./components/TodoList";
import { Footer } from "./components/Footer";
import { Index } from "./components/Index";
import { TodoItem } from "./components/TodoItem";
import { EditItem } from "./components/EditTodo";
import { Todo, filterTodos } from "./todo";

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
    name: typeof name === "string" ?  name : "",
    done: false,
  };

  TODOS = [newTodo, ...TODOS];

  return c.html(
    <>
      {filterTodos(filter, [newTodo]).length ? (
        <TodoItem todo={newTodo} filter={filter} />
      ) : null}
      <Footer filter={filter} todos={TODOS} />
    </>
  );
});

app.get("/todos/edit/:id", (c) => {
  const id = c.req.param("id");

  const todo = TODOS.find((t) => t.id === id)!;

  return c.html(<EditItem todo={todo} />);
});

app.patch("/todos/:id", (c) => {
  const { filter } = c.req.query();
  const { id } = c.req.param();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.done = !todo.done;

  return c.html(
    <>
      {filterTodos(filter, [todo]).length ? (
        <TodoItem todo={todo} filter={filter} />
      ) : null}
      <Footer filter={filter} todos={TODOS} />
    </>
  );
});

app.post("/todos/update/:id", async (c) => {
  const { filter } = c.req.query();
  const { id } = c.req.param();
  const body = await c.req.parseBody();

  const todo = TODOS.find((t) => t.id === id)!;
  todo.name = typeof body.name == 'string' ? body.name : "";

  return c.html(
    <>
      <TodoItem todo={todo} filter={filter} />
      <Footer filter={filter} todos={TODOS} />
    </>
  );
});

app.delete("/todos/:id", (c) => {
  const { filter } = c.req.query();
  const id = c.req.param("id");
  TODOS = TODOS.filter((t) => t.id !== id)!;

  return c.html(<Footer filter={filter} todos={TODOS} />);
});

app.post("/todos/clear-completed", (c) => {
  const { filter } = c.req.query();

  TODOS = TODOS.filter((t) => !t.done);

  return c.html(
    <>
      <TodoList todos={TODOS} filter={filter} />
      <Footer filter={filter} todos={TODOS} />
    </>
  );
});

app.post("/todos/toggle-all", (c) => {
  const { filter } = c.req.query();
  const all = TODOS.every((todo) => todo.done);
  TODOS.forEach((todo) => (todo.done = !all));

  return c.html(
    <>
      <TodoList todos={TODOS} filter={filter} />
      <Footer filter={filter} todos={TODOS} />
    </>
  );
});

app.use("/*", serveStatic({ root: "./assets/" }));

export default app

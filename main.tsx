/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import {
  serveStatic,
  jsx,
  Fragment,
} from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { TodoList } from "./components/TodoList.tsx";
import { Footer } from "./components/Footer.tsx";
import { Index } from "./components/Index.tsx";
import { TodoItem } from "./components/TodoItem.tsx";
import { EditItem } from "./components/EditTodo.tsx";
import { Todo, filterTodos } from "./todo.ts";

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
    name: name instanceof File ? "" : name,
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
  todo.name = body.name instanceof File ? "" : body.name;

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

Deno.serve(app.fetch);

/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import {
  serveStatic,
  jsx,
  Fragment,
} from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { TodoList } from "./components/TodoList.tsx";
import { ItemCount } from "./components/ItemCount.tsx";
import { Index } from "./components/Index.tsx";
import { TodoItem } from "./components/TodoItem.tsx";
import { EditItem } from "./components/EditTodo.tsx";

let todos = [
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

const createFragment = (props: unknown, children: string[]) => {
  return children.join("");
};

const getItemsLeft = () => todos.filter((t) => !t.done).length;

const app = new Hono();

app.get("/", (c) => {
  const filter = c.req.query("filter");

  let filteredTodos = [];
  switch (filter) {
    case "all":
      filteredTodos = todos;
      break;
    case "active":
      filteredTodos = todos.filter((t) => !t.done);
      break;
    case "completed":
      filteredTodos = todos.filter((t) => t.done);
      break;
    default:
      filteredTodos = todos;
  }

  return c.html(
    "<!DOCTYPE html>" +
    <Index todos={filteredTodos} filter={filter} itemsLeft={getItemsLeft()} />
  );
});

app.post("/todos", async (c) => {
  const body = await c.req.parseBody();

  const newTodo = {
    id: crypto.randomUUID(),
    name: body["todo"] as string,
    done: false,
  };

  todos = [newTodo, ...todos];

  return c.html(
    <>
      <TodoItem todo={newTodo} />
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.get("/todos/edit/:id", (c) => {
  const id = c.req.param("id");

  const todo = todos.find((t) => t.id === id)!;

  return c.html(<EditItem todo={todo} />);
});

app.patch("/todos/:id", (c) => {
  const id = c.req.param("id");

  const todo = todos.find((t) => t.id === id)!;
  todo.done = !todo.done;

  return c.html(
    <>
      <TodoItem todo={todo} />
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.post("/todos/update/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();

  const todo = todos.find((t) => t.id === id)!;
  todo.name = body.name as string;

  return c.html(
    <>
      <TodoItem todo={todo} />
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.delete("/todos/:id", (c) => {
  const id = c.req.param("id");
  todos = todos.filter((t) => t.id !== id)!;

  return c.html(<ItemCount itemsLeft={getItemsLeft()} />);
});

app.post("/todos/clear-completed", (c) => {
  todos = todos.filter((t) => !t.done);

  return c.html(
    <>
      <TodoList todos={todos} />
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.post("/todos/toggle-all", (c) => {
  const all = todos.every((todo) => todo.done);
  todos.forEach((todo) => (todo.done = !all));

  return c.html(
    <>
      <TodoList todos={todos} />
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.use("/*", serveStatic({ root: "./assets/" }));

Deno.serve(app.fetch);

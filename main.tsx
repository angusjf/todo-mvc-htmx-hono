/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import {
  serveStatic,
  jsx,
  Fragment,
  html,
} from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { TodoList } from "./components/TodoList.tsx";
import { ItemCount } from "./components/ItemCount.tsx";
import { Index } from "./components/Index.tsx";
import { TodoItem } from "./components/TodoItem.tsx";
import { EditItem } from "./components/EditTodo.tsx";
import { Todo } from "./todo.ts";

let TODOS = [
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

const getItemsLeft = () => TODOS.filter((t) => !t.done).length;

const app = new Hono();

const filterTodos = (filter: string, todos: Todo[]): Todo[] => {
  switch (filter) {
    case "all":
      return todos;
    case "active":
      return todos.filter((t) => !t.done);
    case "completed":
      return todos.filter((t) => t.done);
    default:
      return todos;
  }
};

app.get("/", (c) => {
  const { filter } = c.req.query();

  return c.html(
    <Index
      todos={filterTodos(filter, TODOS)}
      filter={filter}
      itemsLeft={getItemsLeft()}
    />
  );
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
      <ItemCount itemsLeft={getItemsLeft()} />
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
      <ItemCount itemsLeft={getItemsLeft()} />
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
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.delete("/todos/:id", (c) => {
  const id = c.req.param("id");
  TODOS = TODOS.filter((t) => t.id !== id)!;

  return c.html(<ItemCount itemsLeft={getItemsLeft()} />);
});

app.post("/todos/clear-completed", (c) => {
  const { filter } = c.req.query();

  TODOS = TODOS.filter((t) => !t.done);

  return c.html(
    <>
      <TodoList todos={TODOS} filter={filter} />
      <ItemCount itemsLeft={getItemsLeft()} />
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
      <ItemCount itemsLeft={getItemsLeft()} />
    </>
  );
});

app.use("/*", serveStatic({ root: "./assets/" }));

Deno.serve(app.fetch);

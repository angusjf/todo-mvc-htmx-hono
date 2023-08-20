/** @jsx jsx */

import { html, jsx } from "https://deno.land/x/hono@v3.4.1/middleware.ts";
import { TodoList } from "./TodoList.tsx";
import { ItemCount } from "./ItemCount.tsx";
import { Todo } from "../todo.ts";

type AppProps = {
  todos: Todo[];
  filter?: "all" | "active" | "completed" | string;
  itemsLeft: number;
};

const Filters = ({
  filter,
}: {
  filter?: "all" | "active" | "completed" | string;
}) => (
  <ul class="filters">
    <li>
      <a
        class={filter === "all" || filter === "" ? "selected" : undefined}
        href="/?filter=all"
      >
        All
      </a>
    </li>
    <li>
      <a
        class={filter === "active" ? "selected" : undefined}
        href="/?filter=active"
      >
        Active
      </a>
    </li>
    <li>
      <a
        class={filter === "completed" ? "selected" : undefined}
        href="/?filter=completed"
      >
        Completed
      </a>
    </li>
  </ul>
);

const App = ({ todos, filter, itemsLeft }: AppProps) => (
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <form
        hx-post={"/todos?filter=" + filter}
        hx-target="#todo-list"
        hx-swap="afterbegin"
        _="on htmx:afterOnLoad set #txtTodo.value to ''"
      >
        <input
          class="new-todo"
          id="txtTodo"
          name="todo"
          placeholder="What needs to be done?"
          autofocus
        />
      </form>
    </header>
    <section class="main">
      <input
        class="toggle-all"
        id="toggle-all"
        type="checkbox"
        hx-post="/todos/toggle-all"
        hx-target="#todo-list"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list" id="todo-list">
        <TodoList todos={todos} filter={filter} />
      </ul>
    </section>
    <footer class="footer">
      <ItemCount itemsLeft={itemsLeft} />
      <Filters filter={filter} />
      <button
        class="clear-completed"
        hx-post="/todos/clear-completed"
        hx-target="#todo-list"
      >
        Clear completed
      </button>
    </footer>
  </section>
);

export const Index = (props: AppProps) =>
  html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Template • TodoMVC</title>
        <link rel="stylesheet" href="/css/todomvc-common/base.css" />
        <link rel="stylesheet" href="/css/todomvc-app-css/index.css" />
      </head>

      <body>
        ${(<App {...props} />)}
        <footer class="info">
          <p>Click to edit a todo</p>
          <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
          <p>
            Created by
            <a href="https://twitter.com/rajasegar_c">Rajasegar Chandran</a>
          </p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
        <script src="https://unpkg.com/htmx.org@1.3.1"></script>
        <script src="https://unpkg.com/hyperscript.org@0.0.5"></script>
      </body>
    </html>`;

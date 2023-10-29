import { html } from "hono/html";
import { Todo, filterTodos } from "../todo";
import { Footer } from "./Footer";
import { TodoItem } from "./TodoItem";

type AppProps = {
  todos: Todo[];
  filter?: "all" | "active" | "completed" | string;
};

const App = ({ todos, filter }: AppProps) => (
  <section>
    <header>
      <h1>todos</h1>
      <form action={"/todos?filter=" + filter} method="POST">
        <input
          class="new-todo"
          name="todo"
          placeholder="What needs to be done?"
          autofocus
        />
      </form>
    </header>
    <section class="main">
      <form method="POST" action={"/todos/toggle-all?filter=" + filter}>
        <input
          class="toggle-all"
          id="toggle-all"
          type="submit"
          value="Mark all as complete"
        />
      </form>
      <ul class="todo-list" id="todo-list">
        {filterTodos(filter, todos).map((todo) => (
          <TodoItem todo={todo} filter={filter} />
        ))}
      </ul>
    </section>
    <Footer todos={todos} filter={filter} />
  </section>
);

export const Index = (props: AppProps) =>
  html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Template • TodoMVC</title>
        <style>
          :root {
            font-family: system-ui;
          }
          body {
            max-width: 400px;
            margin: 0 auto;
          }
          .todo-list {
            display: block;
            padding-inline-start: 0;
          }
          .todo-list > li {
            display: flex;
          }
          .todo-list > li input {
            appearance: none;
          }
          .todo-list > li button {
            appearance: none;
            background: transparent;
            border: 0;
          }
          .todo-list > li[data-checked] button {
            border-radius: 4px;
            border: 2px solid black;
            width: 3ch;
            height: 3ch;
          }
          footer > ul {
            display: flex;
            gap: 40px;
          }
          footer > ul > li {
            display: block;
          }
          li
        </style>
      </head>
      <body>
        ${(<App {...props} />)}
      </body>
    </html>`;

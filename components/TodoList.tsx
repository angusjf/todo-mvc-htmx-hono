/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx, Fragment } from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { Todo, filterTodos } from "../todo.ts";

import { TodoItem } from "./TodoItem.tsx";

export const TodoList = ({
  todos,
  filter,
}: {
  todos: Todo[];
  filter?: string;
}) => (
  <ul class="todo-list" id="todo-list">
    {filterTodos(filter, todos).map((todo) => (
      <TodoItem todo={todo} filter={filter} />
    ))}
  </ul>
);

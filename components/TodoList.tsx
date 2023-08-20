/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx, Fragment } from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { Todo } from "../todo.ts";

import { TodoItem } from "./TodoItem.tsx";

export const TodoList = ({
  todos,
  filter,
}: {
  todos: Todo[];
  filter?: string;
}) => (
  <>
    {todos.map((todo) => (
      <TodoItem todo={todo} filter={filter} />
    ))}
  </>
);

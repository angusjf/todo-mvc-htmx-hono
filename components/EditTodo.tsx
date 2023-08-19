/** @jsx jsx */
import { jsx } from "https://deno.land/x/hono@v3.4.1/middleware.ts";

import { Todo } from "../todo.ts";

export const EditItem = ({ todo }: { todo: Todo }) => (
  <form hx-post={"/todos/update/" + todo.id}>
    <input class="edit" type="text" name="name" value={todo.name} />
  </form>
);

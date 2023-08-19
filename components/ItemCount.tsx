/** @jsx jsx */

import { jsx } from "https://deno.land/x/hono@v3.4.1/middleware.ts";

export const ItemCount = ({ itemsLeft }: { itemsLeft: number }) => (
  <span class="todo-count" id="todo-count" hx-swap-oob="true">
    <strong>{itemsLeft}</strong> {itemsLeft != 1 ? "items" : "item"} left
  </span>
);

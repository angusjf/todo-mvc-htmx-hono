
import { Todo } from "../todo";

export const TodoItem = ({ todo, filter }: { todo: Todo; filter?: string }) => (
  <li class={todo.done ? "completed" : ""} id={"todo-" + todo.id}>
    <div class="view">
      <input
        class="toggle"
        hx-patch={"/todos/" + todo.id + "?filter=" + filter}
        type="checkbox"
        checked={todo.done}
        hx-target={"#todo-" + todo.id}
        hx-swap="outerHTML"
      />
      <label
        hx-get={"/todos/edit/" + todo.id}
        hx-target={"#todo-" + todo.id}
        hx-swap="outerHTML"
      >
        {todo.name}
      </label>
      <button
        class="destroy"
        hx-delete={"/todos/" + todo.id + "?filter=" + filter}
        _={"on htmx:afterOnLoad remove #todo-" + todo.id}
      />
    </div>
  </li>
);

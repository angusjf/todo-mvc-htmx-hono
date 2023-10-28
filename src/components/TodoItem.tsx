import { Todo } from "../todo";

export const TodoItem = ({ todo, filter }: { todo: Todo; filter?: string }) => (
  <li class={todo.done ? "completed" : ""} id={"todo-" + todo.id}>
    <div class="view">
      <form
        method="POST"
        action={"/todos/toggle/" + todo.id + "?filter=" + filter}
      >
        <input data-checked={todo.done} class="toggle" type="submit" />
      </form>
      <form method="post" action={"/todos/update/" + todo.id}>
        <input class="edit" type="text" name="name" value={todo.name} />
      </form>
      <form>
        <label hx-get={"/todos/edit/" + todo.id}>{todo.name}</label>
      </form>
      <form
        action={"/todos/delete/" + todo.id + "?filter=" + filter}
        method="POST"
      >
        <button class="destroy" />
      </form>
    </div>
  </li>
);

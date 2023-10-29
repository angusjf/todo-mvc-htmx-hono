import { Todo } from "../todo";

export const TodoItem = ({ todo, filter }: { todo: Todo; filter?: string }) => (
  <li id={"todo-" + todo.id} data-checked={todo.done}>
    <form
      method="POST"
      action={"/todos/toggle/" + todo.id + "?filter=" + filter}
    >
      <button>{todo.done ? "✔️" : ""}</button>
    </form>
    <form method="post" action={"/todos/update/" + todo.id}>
      <input class="edit" type="text" name="name" value={todo.name} />
    </form>
    <form
      action={"/todos/delete/" + todo.id + "?filter=" + filter}
      method="POST"
    >
      <button>×</button>
    </form>
  </li>
);

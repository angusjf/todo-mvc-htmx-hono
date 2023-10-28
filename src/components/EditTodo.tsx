import { Todo } from "../todo";

export const EditItem = ({ todo }: { todo: Todo }) => (
  <form hx-post={"/todos/update/" + todo.id}>
    <input class="edit" type="text" name="name" value={todo.name} />
  </form>
);

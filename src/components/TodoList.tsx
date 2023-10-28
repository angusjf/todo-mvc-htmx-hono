import { Todo, filterTodos } from "../todo";
import { TodoItem } from "./TodoItem";

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

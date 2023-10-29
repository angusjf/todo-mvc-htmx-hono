import { Todo } from "../todo";

const Filters = ({
  filter,
}: {
  filter?: "all" | "active" | "completed" | string;
}) => (
  <ul class="filters">
    <li>
      <a
        class={filter === "all" || filter === "" ? "selected" : undefined}
        href="/?filter=all"
      >
        All
      </a>
    </li>
    <li>
      <a
        class={filter === "active" ? "selected" : undefined}
        href="/?filter=active"
      >
        Active
      </a>
    </li>
    <li>
      <a
        class={filter === "completed" ? "selected" : undefined}
        href="/?filter=completed"
      >
        Completed
      </a>
    </li>
  </ul>
);

export const Footer = ({
  todos,
  filter,
}: {
  todos: Todo[];
  filter: string | undefined;
}) => {
  const itemsLeft = todos.filter((t) => !t.done).length;

  return (
    <div id="footer">
      {todos.length > 0 && (
        <footer class="footer">
          <span class="todo-count">
            <strong>{itemsLeft}</strong> {itemsLeft != 1 ? "items" : "item"}{" "}
            left
          </span>
          <Filters filter={filter} />
          <form
            method="post"
            action={"/todos/clear-completed?filter=" + filter}
          >
            <button class="clear-completed">Clear completed</button>
          </form>
        </footer>
      )}
    </div>
  );
};

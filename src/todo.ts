export type Todo = {
    name: string;
    id: string;
    done: boolean;
}

export const filterTodos = (filter: string | undefined, todos: Todo[]): Todo[] => {
  switch (filter) {
    case "all":
      return todos;
    case "active":
      return todos.filter((t) => !t.done);
    case "completed":
      return todos.filter((t) => t.done);
    default:
      return todos;
  }
};

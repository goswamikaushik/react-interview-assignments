export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

export type Filter = "All" | "Active" | "Completed";

export interface State {
  todos: Todo[];
  filter: Filter;
  editingId: string | null;
  inputText: string;
  editingText: string;
}

export type ActionType =
  | "add-todo"
  | "toggle-todo"
  | "delete-todo"
  | "start-edit"
  | "save-edit"
  | "cancel-edit"
  | "set-filter"
  | "mark-all-complete"
  | "clear-complete"
  | "input"
  | "edit-input";

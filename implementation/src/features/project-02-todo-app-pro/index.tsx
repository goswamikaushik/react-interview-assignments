import { useEffect, useReducer, useState } from "react";
import { localStorageAction } from "../../utils";
import type { ActionType, State, Todo } from "./type";
import "./index.css";

const reducer = (
  state: State,
  action: { type: ActionType; payload?: any },
): State => {
  const { type, payload } = action;
  switch (type) {
    case "clear-complete":
      return { ...state, todos: state.todos.filter((t) => !t.completed) };
    case "mark-all-complete":
      return {
        ...state,
        todos: state.todos.map((t) => ({
          ...t,
          completed: true,
          completedAt: payload,
        })),
      };
    case "input":
      return { ...state, inputText: payload };
    case "add-todo":
      return { ...state, todos: [payload, ...state.todos] };
    case "delete-todo":
      return { ...state, todos: state.todos.filter((t) => t.id !== payload) };
    case "toggle-todo":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === payload.id
            ? {
                ...t,
                completed: payload.status,
                completedAt: payload.status ? new Date().toISOString() : null,
              }
            : t,
        ),
      };
    case "start-edit":
      return {
        ...state,
        editingId: payload.id,
        editingText: payload.text,
      };
    case "save-edit":
      return {
        ...state,
        editingText: "",
        editingId: null,
        todos: state.todos.map((t) =>
          t.id === payload.id ? { ...t, text: state.editingText } : t,
        ),
      };
    case "cancel-edit":
      return { ...state, editingId: null, editingText: "" };
    case "edit-input":
      return { ...state, editingText: payload };
    case "set-filter":
      return { ...state, filter: payload };
    default:
      return state;
  }
};

const initialValue: State = {
  todos: [],
  filter: "All",
  editingId: null,
  inputText: "",
  editingText: "",
};

const init = (): State => {
  const { get } = localStorageAction();
  try {
    const stored = get("todo-app-state");
    return stored ? JSON.parse(stored) : initialValue;
  } catch {
    return initialValue;
  }
};

function TodoPro() {
  const { set } = localStorageAction();

  const [state, dispatch] = useReducer(reducer, initialValue, init);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    set("todo-app-state", JSON.stringify(state));
  }, [state, set]);

  const isALLCompleted = state.todos.every((t) => t.completed);

  const onAddTodo = () => {
    const text = state.inputText.trim();

    if (!text) {
      setError("Task cannot be empty");
      return;
    }

    setError("");
    const createdAt = new Date().toISOString();
    dispatch({
      type: "add-todo",
      payload: {
        id: crypto.randomUUID(),
        text: text,
        completed: false,
        createdAt,
        completedAt: null,
      },
    });
    dispatch({
      type: "input",
      payload: "",
    });
  };

  const getVisibleTasks = () => {
    const { todos, filter } = state;

    const active = todos
      .filter((t) => !t.completed)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const completed = todos
      .filter((t) => t.completed)
      .sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime(),
      );

    if (filter === "Active") return active;
    if (filter === "Completed") return completed;
    return [...active, ...completed];
  };

  const tabs = Object.entries(
    state.todos.reduce(
      (acc, curr) => {
        acc["All"] = acc["All"] + 1;

        if (curr.completed) {
          acc["Completed"] = acc["Completed"] + 1;
        } else {
          acc["Active"] = acc["Active"] + 1;
        }
        return acc;
      },
      { Completed: 0, Active: 0, All: 0 },
    ),
  );

  const visibleTasks = getVisibleTasks();
  const onEditSave = (id: string) => {
    dispatch({
      type: "save-edit",
      payload: { id, text: state.editingText },
    });
  };

  const onEditCancel = (payload: string) => {
    dispatch({ type: "cancel-edit", payload });
  };

  const getMessage = () => {
    if (visibleTasks.length) {
      return null;
    }

    const { filter } = state;
    if (filter === "Active") return "Your'e all caught up! 🎉";
    if (filter === "Completed") return "No completed tasks yet";
    return "Nothing to do. Add your first task above.";
  };

  return (
    <div>
      <h1>Todo APP</h1>
      {/* Input Container */}
      <div className="input-action-container">
        <div className="input-container">
          <input
            type="text"
            value={state.inputText}
            onChange={(e) => {
              dispatch({ type: "input", payload: e.target.value });
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddTodo();
              }
            }}
            placeholder="Add task here"
          />
          {error && <p className="error-text">{error}</p>}
        </div>
        <button onClick={onAddTodo} className="delete-button">
          Add
        </button>
      </div>

      <div className="tab-container">
        {tabs.map(([t, count]) => (
          <button
            key={t}
            type="button"
            className={state.filter === t ? "active-tab" : "tab-button"}
            onClick={() => dispatch({ type: "set-filter", payload: t })}
          >
            {`${t} (${count})`}
          </button>
        ))}
      </div>

      <div className="todo-container">
        {visibleTasks.map((t: Todo) => (
          <div key={t.id} className="todo-item">
            {state.editingId === t.id ? (
              <input
                value={state.editingText}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onEditSave(t.id);
                  }

                  if (e.key === "Escape") {
                    onEditCancel(t.id);
                  }
                }}
                onChange={(e) =>
                  dispatch({ type: "edit-input", payload: e.target.value })
                }
              />
            ) : (
              <p className={`${t.completed && "completed-item"}`}>{t.text}</p>
            )}

            <div>
              {state.editingId === t.id ? (
                // Edit is Open
                <>
                  <button
                    className="delete-button"
                    onClick={() => onEditSave(t.id)}
                  >
                    Save
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onEditCancel(t.id)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                // Edit is closed
                <div className="todo-action-container">
                  {t.completedAt && (
                    <p>{new Date(t.completedAt).toLocaleDateString()}</p>
                  )}
                  <input
                    checked={t.completed}
                    onChange={(e) =>
                      dispatch({
                        type: "toggle-todo",
                        payload: {
                          id: t.id,
                          status: e.target.checked,
                        },
                      })
                    }
                    type="checkbox"
                  />
                  {!t.completed && (
                    <>
                      <button
                        className="delete-button"
                        onClick={() =>
                          dispatch({
                            type: "start-edit",
                            payload: { id: t.id, text: t.text },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() =>
                          dispatch({ type: "delete-todo", payload: t.id })
                        }
                      >
                        X
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <p>{getMessage()}</p>
      </div>

      {state.todos.length > 0 && (
        <div className="actions">
          {state.filter === "Completed" && (
            <button onClick={() => dispatch({ type: "clear-complete" })}>
              Clear Completed
            </button>
          )}
          {!isALLCompleted &&
            (state.filter === "Active" || state.filter === "All") && (
              <button
                onClick={() =>
                  dispatch({
                    type: "mark-all-complete",
                    payload: new Date().toISOString(),
                  })
                }
              >
                Mark All Complete
              </button>
            )}
        </div>
      )}
    </div>
  );
}

export default TodoPro;

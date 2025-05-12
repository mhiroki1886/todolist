import "./App.css";
import DeleteDialog from "./components/DeleteDialog";
import Snackbar from "./components/Snackbar";
import { useTodoList } from "./hooks/useTodoList";
import { Status, type TodoStatus } from "./types";

function App() {
  const [data, handle] = useTodoList();

  return (
    <>
      <div id="todo-list-header">
        <h1>TODO LIST</h1>
        {data.selected === Status.DELETE ? null : (
          <form
            id="add-task-form"
            onSubmit={(e) => {
              e.preventDefault();
              handle.addTask();
            }}
          >
            <input
              type="text"
              placeholder="タスクを追加"
              value={data.newTask}
              onChange={(e) => handle.onChangeNewTask(e.currentTarget.value)}
              autoComplete="off"
            />
            <button type="submit" onSubmit={handle.addTask}>
              追加
            </button>
          </form>
        )}
        <div id="select-task-form">
          <div className="todo-select">
            <select
              value={data.selected}
              onChange={(e) => handle.onSelect(e.currentTarget.value as TodoStatus)}
            >
              <option value={Status.ALL}>全て</option>
              <option value={Status.ACTIVE}>未完了</option>
              <option value={Status.COMPLETED}>完了</option>
              <option value={Status.DELETE}>ゴミ箱</option>
            </select>
          </div>
          {data.selected === Status.DELETE && (
            <button onClick={handle.toggleAlertDialog} disabled={data.filteredTodo.length <= 0}>
              ゴミ箱を空にする
            </button>
          )}
        </div>
      </div>
      <div id="todo-list">
        {data.filteredTodo.length === 0 ? (
          <p className="none-task">タスクはありません。</p>
        ) : (
          data.filteredTodo.map((t) => (
            <div className="todo-item" key={t.id}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => handle.toggleTask(t.id)}
                disabled={t.deleted}
              />
              <input
                type="text"
                value={t.task}
                onChange={(e) => handle.editTask(t.id, e.currentTarget.value)}
                disabled={t.done || t.deleted}
              />
              {t.deleted ? (
                <button
                  className="restore"
                  onClick={() => {
                    handle.restoreTask(t.id);
                  }}
                >
                  復元
                </button>
              ) : (
                <button
                  onClick={() => {
                    handle.deleteTask(t.id);
                  }}
                >
                  削除
                </button>
              )}
            </div>
          ))
        )}
      </div>
      {/* ゴミ箱を空にするダイアログ */}
      <DeleteDialog
        isOpen={data.isDialogOpen}
        onClose={handle.toggleAlertDialog}
        onConfirm={handle.allDeleteTask}
      />
      <Snackbar
        isOpen={data.isSnackbarOpen}
        message={data.snackbarMessage}
        onClose={handle.closeSnackbar}
      />
    </>
  );
}

export default App;

import { useCallback, useEffect, useState } from "react";
import { Status, type Todo, type TodoStatus } from "../types";

export function useTodoList() {
  // ローカルストレージのキーを定義
  const lsKey = "todoList";
  // ローカルストレージから todo を取得する
  const ls = localStorage.getItem(lsKey);
  // ローカルストレージから取得した todo を状態として管理する
  const [todo, setTodo] = useState<Todo[]>(ls ? JSON.parse(ls) : []);
  // フィルタリングされた todo を管理する
  const [filteredTodo, setFilteredTodo] = useState<Todo[]>([]);
  // 新しいタスクの入力を管理する
  const [newTask, setNewTask] = useState<string>("");
  // 選択されたタスクの状態を管理する
  const [selected, setSelected] = useState<TodoStatus>(Status.ALL);
  // ダイアログの表示状態を管理する
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // スナックバーの表示状態を管理する
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // スナックバーのメッセージを管理する
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ローカルストレージに todo を保存する関数
  const setStorage = (newTodo: Todo[]) => {
    localStorage.setItem(lsKey, JSON.stringify(newTodo));
  };

  // 新しいタスクの入力を管理する
  const onChangeNewTask = (newTask: string) => {
    setNewTask(newTask);
  };

  // 新しいタスクを追加する
  const addTask = () => {
    if (newTask === "") return;
    const newTodo: Todo = {
      id: todo.length > 0 ? Math.max(...todo.map((t) => t.id)) + 1 : 1,
      task: newTask,
      done: false,
    };
    setTodo([...todo, newTodo]);
    setStorage([...todo, newTodo]);
    setIsSnackbarOpen(true);
    setSnackbarMessage("タスクを追加しました。");
    setTimeout(() => {
      setIsSnackbarOpen(false);
      setSnackbarMessage("");
    }, 2000);
    setNewTask("");
  };

  // タスクのフィルタリングを管理する
  const onSelect = useCallback(
    (v?: TodoStatus) => {
      if (v) setSelected(v);
      switch (v ?? selected) {
        case Status.ALL:
          setFilteredTodo(todo.filter((t) => !t.deleted));
          break;
        case Status.ACTIVE:
          setFilteredTodo(todo.filter((t) => !t.done && !t.deleted));
          break;
        case Status.COMPLETED:
          setFilteredTodo(todo.filter((t) => t.done && !t.deleted));
          break;
        case Status.DELETE:
          setFilteredTodo(todo.filter((t) => t.deleted));
          break;
        default:
          setFilteredTodo(todo);
      }
    },
    [todo, selected]
  );

  // タスクの状態を切り替える
  const toggleTask = (id: number) => {
    const newTodo = todo.map((t) => {
      if (t.id === id) {
        return { ...t, done: !t.done };
      }
      return t;
    });
    setStorage(newTodo);
    setTodo(newTodo);
    setIsSnackbarOpen(true);
    setSnackbarMessage("タスクの状態を変更しました。");
    setTimeout(() => {
      setIsSnackbarOpen(false);
      setSnackbarMessage("");
    }, 2000);
  };

  // タスクを編集する
  const editTask = (id: number, task: string) => {
    const newTodo = todo.map((t) => {
      if (t.id === id) {
        return { ...t, task };
      }
      return t;
    });
    setStorage(newTodo);
    setTodo(newTodo);
  };

  // タスクを削除する
  const deleteTask = (id: number) => {
    const newTodo = todo.map((t) => {
      if (t.id === id) {
        return { ...t, deleted: true };
      }
      return t;
    });
    setStorage(newTodo);
    setTodo(newTodo);
    setIsSnackbarOpen(true);
    setSnackbarMessage("タスクを削除しました。");
    setTimeout(() => {
      setIsSnackbarOpen(false);
      setSnackbarMessage("");
    }, 2000);
  };

  // タスクを復元する
  const restoreTask = (id: number) => {
    const newTodo = todo.map((t) => {
      if (t.id === id) {
        return { ...t, deleted: false };
      }
      return t;
    });
    setStorage(newTodo);
    setTodo(newTodo);
  };

  // ダイアログの表示状態を切り替える
  const toggleAlertDialog = () => {
    setIsDialogOpen((prev) => !prev);
  };

  // スナックバーの表示状態を切り替える
  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  // ゴミ箱を空にする
  const allDeleteTask = () => {
    const newTodo = todo.filter((t) => !t.deleted);
    setStorage(newTodo);
    setTodo(newTodo);
    toggleAlertDialog();
    setIsSnackbarOpen(true);
    setSnackbarMessage("ゴミ箱を空にしました。");
    setTimeout(() => {
      setIsSnackbarOpen(false);
      setSnackbarMessage("");
    }, 2000);
  };

  // useEffect を使って、todo の変更を監視し、フィルタリングを行う
  useEffect(() => {
    onSelect();
  }, [onSelect]);

  //
  return [
    { todo, filteredTodo, newTask, selected, isDialogOpen, isSnackbarOpen, snackbarMessage },
    {
      onChangeNewTask,
      addTask,
      onSelect,
      toggleTask,
      editTask,
      deleteTask,
      restoreTask,
      toggleAlertDialog,
      closeSnackbar,
      allDeleteTask,
    },
  ] as const;
}

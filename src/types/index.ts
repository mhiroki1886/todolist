export type Todo = {
  id: number;
  task: string;
  done: boolean;
  deleted?: boolean;
};

export const Status = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
  DELETE: "delete",
} as const;
export type TodoStatus = (typeof Status)[keyof typeof Status];

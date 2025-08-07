export type TTaskProps = {
  _id: string;
  TaskName: string;
  TaskDescription: string;
  TaskDeadline: Date;
  isFinished: boolean;
};

export type TModifiedTaskProps = TTaskProps & {
  onEdit?: (
    _id: string,
    newTaskName: string,
    newTaskDeadline: Date,
    newTaskDescription: string
  ) => void;
  onChangeStatus?: (_id: string, newStatus: boolean) => void;
  onDelete?: (_id: string) => void;
};

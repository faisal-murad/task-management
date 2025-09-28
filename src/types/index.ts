export interface LoginResponse {
  data: {
    message: string;
    user: {
      _id: string;
      email: string;
      role: "user" | "admin";
    };
    accessToken: string;
  };
}

export interface NewTaskForm {
  title: string;
  description: string;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "urgent";
  // dueDate: string;
}

export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  fullName: string;
}

export interface CreateTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (task: NewTaskForm) => void;
  users?: IUser[];
  usersLoading?: boolean;
  creatingTask?: boolean;
}


export interface ITask {
  _id: number;
  title: string;
  description: string;
  createdBy: any;
  assignedTo: any;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  dueDate: string;
}
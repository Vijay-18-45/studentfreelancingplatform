export type UserRole = 'student_buyer' | 'student_worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills: string[];
  bio: string;
  rating: number;
  completedTasks: number;
  points: number;
  reliabilityScore: number;
  joinedAt: string;
}

export type TaskCategory = 'Tutoring' | 'Content' | 'Coding' | 'Design' | 'Writing' | 'Other';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'disputed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  budget: number;
  deadline: string;
  posterId: string;
  workerId?: string;
  status: TaskStatus;
  isUrgent: boolean;
  isSkillSwap: boolean;
  swapSkill?: string;
  createdAt: string;
  applications: Application[];
}

export interface Application {
  id: string;
  taskId: string;
  applicantId: string;
  message: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'new_application' | 'system';
  read: boolean;
  createdAt: string;
}

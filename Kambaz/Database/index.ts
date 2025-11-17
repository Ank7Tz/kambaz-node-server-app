import courses from "./courses";
import assignments from "./assignments";
import enrollments from "./enrollments";
import modules from "./modules";
import users from "./users";

export interface User {
  _id: string;
  firstName: string;
  username: string;
  password: string;
  lastName: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
  dob?: string | Date;
  email?: string;
}

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  image: string;
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
}

export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableTill: string;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

export interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

export interface Profile {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date | string;
  email: string;
  role: string;
}

export interface DB {
    courses : Course[];
    assignments: Assignment[];
    enrollments: Enrollment[];
    modules: Module[];
    users: User[];
}

export default { courses, assignments, enrollments, modules, users } as DB;
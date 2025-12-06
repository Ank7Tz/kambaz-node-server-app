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
  modules?: Module[];
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  course?: string;
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
  grade?: number;
  letterGrade?: string;
  enrollmentDate?: Date;
  status?: "ENROLLED" | "DROPPED" | "COMPLETED";
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

export interface Quiz {
  _id: string;

  title: string;
  description?: string;
  course: string;
  
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  
  shuffleAnswers: boolean;
  timeLimit: number; 
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode?: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  
  dueDate?: Date;
  availableDate?: Date;
  untilDate?: Date;
  
  published: boolean;
  
  points: number;
}

export interface QuizQuestion {
  _id: string;
  
  quiz: string;
  course: string;
  
  title: string;
  type: "multiple-choice" | "true-false" | "fill-in-blank";
  points: number;
  question: string; 
  
  choices?: string[];
  
  //For multiple-choice: number 
  //For true-false: boolean 
  correctAnswer?: number | boolean;
  
  // Fill in Blank Fields
  possibleAnswers?: string[];
  
  isEditing?: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: number | boolean | string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface QuizAttempt {
  _id?: string;
  
  quiz: string;
  student: string;
  course: string;
  
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  
  answers: QuizAnswer[];
  
  score?: number;
  totalPoints?: number;
  
  isCompleted?: boolean;
}

export default { courses, assignments, enrollments, modules, users } as DB;
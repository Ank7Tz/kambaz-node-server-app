import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: { type: Boolean, default: false },
    pointsEarned: { type: Number, default: 0 }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    
    quiz: { type: String, ref: "QuizModel", required: true },
    student: { type: String, ref: "UserModel", required: true },
    course: { type: String, ref: "CourseModel", required: true }, // Redundant but speeds up queries
    
    attemptNumber: { type: Number, required: true, default: 1 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    
    answers: [answerSchema],
    
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, required: true },
    
    isCompleted: { type: Boolean, default: false }
  },
  { collection: "quizAttempts" }
);

export default attemptSchema;
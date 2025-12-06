import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,

    quiz: { type: String, ref: "QuizModel", required: true },
    course: { type: String, ref: "CourseModel", required: true },

    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "fill-in-blank"],
      required: true
    },
    points: { type: Number, required: true, default: 1 },
    question: { type: String, required: true },

    // Multiple Choice Fields
    choices: [String],

    //For multiple-choice: Number
    //For true-false: Boolean 
    correctAnswer: mongoose.Schema.Types.Mixed,

    // Fill in Blank Fields
    possibleAnswers: [String],

    isEditing: { type: Boolean, default: false }
  },
  { collection: "quizQuestions" }
);

export default questionSchema;
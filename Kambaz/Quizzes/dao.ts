import { Quiz } from "../Database";
import model from "./model";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  
  const findQuizzesForCourse = async (courseId: string) => {
    const quizzes = await model.find({ course: courseId });
    return quizzes;
  };

  const findQuizById = async (courseId: string, quizId: string) => {
    const quiz = await model.find({ _id: quizId, course: courseId });
    return quiz;
  };

  const createQuiz = async (courseId: string, quizId: string, quizData: Quiz) => {
    const newQuiz = {
      ...quizData,
      _id: quizId || uuidv4(),
      course: courseId,
      published: false,
      points: 0
    };
    const created = await model.create(newQuiz);
    return created;
  };

  const updateQuiz = async (courseId: string, quizId: string, updatedQuizData: Quiz) => {
    const result = await model.updateOne(
      { _id: quizId, course: courseId },
      { $set: updatedQuizData }
    );
    return result;
  };

  const deleteQuiz = async (courseId: string, quizId: string) => {
    const result = await model.deleteOne({ _id: quizId, course: courseId });
    return result;
  };

  const publishQuiz = async (courseId: string, quizId: string) => {
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    await model.updateOne(
      { _id: quizId, course: courseId },
      { $set: { published: true } }
    );
    return await model.findById(quizId);
  };

  const unpublishQuiz = async (courseId: string, quizId: string) => {
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    await model.updateOne(
      { _id: quizId, course: courseId },
      { $set: { published: false } }
    );
    return await model.findById(quizId);
  };

  const updateQuizPoints = async (quizId: string, totalPoints: number) => {
    const result = await model.updateOne(
      { _id: quizId },
      { $set: { points: totalPoints } }
    );
    return result;
  };

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    updateQuizPoints
  };
}
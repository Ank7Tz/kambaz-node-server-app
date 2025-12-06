import model from "./model";
import QuizzesDao from "../Quizzes/dao";
import { v4 as uuidv4 } from "uuid";
import { QuizQuestion } from "../Database/index";

export default function QuizQuestionsDao() {
  const quizzesDao = QuizzesDao();

  const fetchQuizQuestions = async (quizId: string) => {
    const questions = await model.find({ quiz: quizId });
    return questions;
  };

  const createQuizQuestion = async (questionData: QuizQuestion) => {
    const newQuestion = {
      ...questionData,
      _id: uuidv4(),
      isEditing: false
    };
    const created = await model.create(newQuestion);
    
    await updateQuizTotalPoints(questionData.quiz);
    
    return created;
  };

  const updateQuizQuestion = async (courseId: string, quizId: string, questionId: string, updatedData: QuizQuestion) => {
    const result = await model.updateOne(
      { _id: questionId, course: courseId, quiz: quizId },
      { $set: updatedData }
    );
    
    await updateQuizTotalPoints(quizId);
    
    return result;
  };

  const deleteQuizQuestion = async (courseId: string, quizId: string, questionId: string) => {
    const result = await model.deleteOne({
      _id: questionId,
      quiz: quizId,
      course: courseId
    });
    
    await updateQuizTotalPoints(quizId);
    
    return result;
  };

  const updateQuizTotalPoints = async (quizId: string) => {
    const questions = await model.find({ quiz: quizId });
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    await quizzesDao.updateQuizPoints(quizId, totalPoints);
  };

  return {
    fetchQuizQuestions,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
    updateQuizTotalPoints
  };
}
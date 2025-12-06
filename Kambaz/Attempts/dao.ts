import model from "./model";
import QuizQuestionsDao from "../QuizQuestions/dao";
import QuizzesDao from "../Quizzes/dao";
import { v4 as uuidv4 } from "uuid";
import { QuizAnswer, QuizAttempt } from "../Database";

export default function AttemptsDao() {
  const quizQuestionsDao = QuizQuestionsDao();
  const quizzesDao = QuizzesDao();

  const createAttempt = async (attemptData: QuizAttempt) => {
    const { quiz, student, course, answers } = attemptData;

    const questions = await quizQuestionsDao.fetchQuizQuestions(quiz);

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

    const existingAttempts = await model.find({
      quiz: quiz,
      student: student
    }).sort({ attemptNumber: -1 });
    const attemptNumber = existingAttempts.length > 0
      ? existingAttempts[0].attemptNumber + 1
      : 1;

    const gradedAnswers = gradeQuizAnswers(questions, answers);
    const totalScore = gradedAnswers.reduce((sum: number, a: QuizAnswer) => sum + (a.pointsEarned || 0), 0);

    const newAttempt = {
      _id: uuidv4(),
      quiz: quiz,
      student: student,
      course: course,
      attemptNumber: attemptNumber,
      startedAt: new Date(),
      submittedAt: new Date(),
      answers: gradedAnswers,
      score: totalScore,
      totalPoints: totalPoints,
      isCompleted: true
    };

    const created = await model.create(newAttempt);
    return created;
  };

  const gradeQuizAnswers = (questions: any, studentAnswers: any) => {
    return questions.map((question: any) => {
      const studentAnswer = studentAnswers.find(
        (ans: any) => ans.questionId === question._id
      );

      if (!studentAnswer || studentAnswer.answer === null || studentAnswer.answer === undefined) {
        return {
          questionId: question._id,
          answer: null,
          isCorrect: false,
          pointsEarned: 0
        };
      }

      let isCorrect = false;

      switch (question.type) {
        case "multiple-choice":
          const studentMC = Number(studentAnswer.answer);
          const correctMC = Number(question.correctAnswer);
          isCorrect = studentMC === correctMC;
          break;

        case "true-false":
          const studentTF = Boolean(studentAnswer.answer);
          const correctTF = Boolean(question.correctAnswer);
          isCorrect = studentTF === correctTF;
          break;

        case "fill-in-blank":
          const normalizedAnswer = String(studentAnswer.answer).toLowerCase().trim();

          if (!question.possibleAnswers || question.possibleAnswers.length === 0) {
            const correctAns = String(question.correctAnswer || "").toLowerCase().trim();
            isCorrect = normalizedAnswer === correctAns && normalizedAnswer !== "";
          } else {
            isCorrect = question.possibleAnswers.some(
              (possibleAns: any) => {
                const normalized = String(possibleAns).toLowerCase().trim();
                return normalized === normalizedAnswer && normalized !== "";
              }
            );
          }
          break;

        default:
          isCorrect = false;
      }

      return {
        questionId: question._id,
        answer: studentAnswer.answer,
        isCorrect: isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      };
    });
  };

  const fetchAttempts = async (courseId: string, quizId: string, studentId: string) => {
    const attempts = await model.find({
      course: courseId,
      quiz: quizId,
      student: studentId
    }).sort({ attemptNumber: -1 });

    return attempts;
  };

  const fetchLatestAttempt = async (courseId: string, quizId: string, studentId: string) => {
    const attempt = await model.findOne({
      course: courseId,
      quiz: quizId,
      student: studentId
    }).sort({ attemptNumber: -1 });

    return attempt;
  };

  const updateAttempt = async (courseId: string, quizId: string, attemptId: string, updateData: QuizAttempt) => {
    const result = await model.updateOne(
      { _id: attemptId, course: courseId, quiz: quizId },
      { $set: updateData }
    );
    return result;
  };

  const getAttemptCount = async (quizId: string, studentId: string) => {
    const count = await model.countDocuments({
      quiz: quizId,
      student: studentId,
      isCompleted: true
    });
    return count;
  };

  const canStudentTakeQuiz = async (quizId: string, studentId: string, courseId: string) => {
    const quizResults = await quizzesDao.findQuizById(courseId, quizId);
    const quiz = quizResults[0];

    if (!quiz.multipleAttempts) {
      const attemptCount = await getAttemptCount(quizId, studentId);
      return attemptCount === 0;
    }

    const attemptCount = await getAttemptCount(quizId, studentId);
    return attemptCount < quiz.howManyAttempts;
  };

  return {
    createAttempt,
    fetchAttempts,
    fetchLatestAttempt,
    updateAttempt,
    getAttemptCount,
    canStudentTakeQuiz,
    gradeQuizAnswers
  };
}
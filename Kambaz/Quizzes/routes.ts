import QuizzesDao from "./dao";
import QuizQuestionsDao from "../QuizQuestions/dao";
import AttemptsDao from "../Attempts/dao";
import { Express, Request, Response } from 'express';

export default function QuizRoutes(app: Express) {
  const quizzesDao = QuizzesDao();
  const quizQuestionsDao = QuizQuestionsDao();
  const attemptsDao = AttemptsDao();

  const findQuizzesForCourse = async (req: Request, res: Response) => {
    try {
      const { cid } = req.params;
      const currentUser = req.session["currentUser"];

      let quizzes = await quizzesDao.findQuizzesForCourse(cid);

      if (currentUser && currentUser.role === "STUDENT") {
        quizzes = quizzes.filter(quiz => quiz.published);
      }

      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const getQuizDetails = async (req: Request, res: Response) => {
    try {
      const { cid, qid } = req.params;
      const quizDetails = await quizzesDao.findQuizById(cid, qid);

      if (quizDetails.length === 0) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      if (quizDetails.length > 1) {
        res.status(500).json({ error: "Multiple quizzes found with same ID" });
        return;
      }

      res.json(quizDetails[0]);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const createQuiz = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can create quizzes" });
        return;
      }

      const { cid, qid } = req.params;

      const existingQuiz = await quizzesDao.findQuizById(cid, qid);
      if (existingQuiz.length > 0) {
        res.status(400).json({ error: "Quiz with this ID already exists" });
        return;
      }

      const newQuiz = await quizzesDao.createQuiz(cid, qid, req.body);
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const updateQuiz = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can update quizzes" });
        return;
      }

      const { cid, qid } = req.params;
      const result = await quizzesDao.updateQuiz(cid, qid, req.body);

      if (result.matchedCount === 0) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      res.json({ message: "Quiz updated successfully", result });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const deleteQuiz = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can delete quizzes" });
        return;
      }

      const { cid, qid } = req.params;
      const result = await quizzesDao.deleteQuiz(cid, qid);

      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const publishQuiz = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can publish quizzes" });
        return;
      }

      const { cid, qid } = req.params;
      const updatedQuiz = await quizzesDao.publishQuiz(cid, qid);
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const unpublishQuiz = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can unpublish quizzes" });
        return;
      }

      const { cid, qid } = req.params;
      const updatedQuiz = await quizzesDao.unpublishQuiz(cid, qid);
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const getQuizQuestions = async (req: Request, res: Response) => {
    try {
      const { qid } = req.params;
      const questions = await quizQuestionsDao.fetchQuizQuestions(qid);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const createQuizQuestion = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can create questions" });
        return;
      }

      const newQuestion = await quizQuestionsDao.createQuizQuestion(req.body);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const updateQuizQuestion = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can update questions" });
        return;
      }

      const { cid, qid, questionId } = req.params;
      const result = await quizQuestionsDao.updateQuizQuestion(cid, qid, questionId, req.body);

      if (result.matchedCount === 0) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      res.json({ message: "Question updated successfully", result });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const deleteQuizQuestion = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (currentUser.role !== "FACULTY") {
        res.status(403).json({ error: "Only faculty can delete questions" });
        return;
      }

      const { cid, qid, questionId } = req.params;
      const result = await quizQuestionsDao.deleteQuizQuestion(cid, qid, questionId);

      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      res.json({ message: "Question deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const createAttempt = async (req: Request, res: Response) => {
    try {
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { cid, qid } = req.params;

      const canTake = await attemptsDao.canStudentTakeQuiz(qid, currentUser._id, cid);
      if (!canTake) {
        res.status(403).json({ error: "Maximum attempts reached" });
        return;
      }

      const attemptData = {
        quiz: qid,
        student: currentUser._id,
        course: cid,
        answers: req.body.answers
      };

      const newAttempt = await attemptsDao.createAttempt(attemptData as any);
      res.status(201).json(newAttempt);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const fetchAttempts = async (req: Request, res: Response) => {
    try {
      const { cid, qid, userId } = req.params;
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      if (currentUser.role === "STUDENT" && currentUser._id !== userId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const attempts = await attemptsDao.fetchAttempts(cid, qid, userId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const fetchLatestAttempt = async (req: Request, res: Response) => {
    try {
      const { cid, qid, userId } = req.params;
      const currentUser = req.session["currentUser"];

      if (!currentUser) {
        res.sendStatus(401)
        return;
      }

      if (currentUser.role === "STUDENT" && currentUser._id !== userId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const attempt = await attemptsDao.fetchLatestAttempt(cid, qid, userId);

      if (!attempt) {
        res.status(404).json({ error: "No attempts found" });
        return;
      }

      res.json(attempt);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const updateAttempt = async (req: Request, res: Response) => {
    try {
      const { cid, qid, attemptId } = req.params;
      const result = await attemptsDao.updateAttempt(cid, qid, attemptId, req.body);

      if (result.matchedCount === 0) {
        res.status(404).json({ error: "Attempt not found" });
        return;
      }

      res.json({ message: "Attempt updated successfully", result });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/courses/:cid/quizzes/:qid", getQuizDetails);
  app.post("/api/courses/:cid/quizzes/:qid", createQuiz);
  app.put("/api/courses/:cid/quizzes/:qid", updateQuiz);
  app.delete("/api/courses/:cid/quizzes/:qid", deleteQuiz);
  app.post("/api/courses/:cid/quizzes/:qid/publish", publishQuiz);
  app.post("/api/courses/:cid/quizzes/:qid/unpublish", unpublishQuiz);

  app.get("/api/courses/:cid/quizzes/:qid/questions", getQuizQuestions);
  app.post("/api/courses/:cid/quizzes/:qid/questions", createQuizQuestion);
  app.put("/api/courses/:cid/quizzes/:qid/questions/:questionId", updateQuizQuestion);
  app.delete("/api/courses/:cid/quizzes/:qid/questions/:questionId", deleteQuizQuestion);

  app.post("/api/courses/:cid/quizzes/:qid/attempts", createAttempt);
  app.get("/api/courses/:cid/quizzes/:qid/attempts/:userId", fetchAttempts);
  app.get("/api/courses/:cid/quizzes/:qid/attempts/:userId/latest", fetchLatestAttempt);
  app.put("/api/courses/:cid/quizzes/:qid/attempts/:attemptId", updateAttempt);
}
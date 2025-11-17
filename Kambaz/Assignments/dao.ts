import { Assignment, DB } from "../Database/index";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db: DB) {
    const findAssignmentsForCourse = (courseId: string): Assignment[] => {
        const { assignments } = db;
        const assignmentsForCourse = assignments.filter((a: Assignment) => a.course === courseId);
        return assignmentsForCourse;
    }

    const findAssignmentById = (courseId: string, assignmentId: string): Assignment => {
        const { assignments } = db;
        const assignment = assignments.filter((a: Assignment) => a._id == assignmentId && a.course === courseId);
        return assignment[0];
    }

    const createAssignment = (newAssignment: Assignment): Assignment => {
        newAssignment._id = uuidv4();
        db.assignments = [...db.assignments, newAssignment];
        return newAssignment;
    }

    const updateAssignment = (courseId: string, assignmentId: string, assignmentUpdate: Assignment): Assignment | null => {
        const { assignments } = db;
        const assignment = assignments.find((a: Assignment) => a._id === assignmentId && a.course === courseId);
        if (!assignment) {
            return null;
        }
        Object.assign(assignment, assignmentUpdate);
        return assignment;
    }

    const deleteAssignment = (courseId: string, assignmentId: string) => {
        db.assignments = db.assignments.filter((a: Assignment) => !(a._id === assignmentId && a.course === courseId));
    }

    return {
        findAssignmentById,
        findAssignmentsForCourse,
        createAssignment,
        updateAssignment,
        deleteAssignment,
    }
}
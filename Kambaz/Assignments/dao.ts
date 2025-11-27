import { Assignment, DB } from "../Database/index";
import { v4 as uuidv4 } from "uuid";
import model from "./model";

export default function AssignmentsDao(db: DB) {
    const findAssignmentsForCourse = async (courseId: string): Promise<Assignment[]> => {
        const result = await model.find<Assignment>({ course: courseId });
        return result;
    }

    const findAssignmentById = async (assignmentId: string): Promise<Assignment | null> => {
        const result = await model.findById<Assignment>(assignmentId);
        return result;
    }

    const createAssignment = async (newAssignment: Assignment): Promise<Assignment> => {
        newAssignment._id = uuidv4();
        const result = await model.create(newAssignment);
        return result.toObject<Assignment>();
    }

    const updateAssignment = async (assignmentId: string, assignmentUpdate: Assignment): Promise<Assignment | null> => {
        const assignment = await model.findByIdAndUpdate(assignmentId, { $set: assignmentUpdate }, { new: true }).lean<Assignment | null>();
        if (!assignment) {
            return null;
        }
        return assignment;
    }

    const deleteAssignment = async (assignmentId: string) => {
        return model.deleteOne({_id: assignmentId});
    }

    return {
        findAssignmentById,
        findAssignmentsForCourse,
        createAssignment,
        updateAssignment,
        deleteAssignment,
    }
}
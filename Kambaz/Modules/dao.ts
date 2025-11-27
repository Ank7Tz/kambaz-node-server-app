import { DB, Module } from "../Database/index";
import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model";

export default function ModulesDao(db: DB) {
    async function findModulesForCourse(courseId: string) {
        const courses = await model.findById(courseId);
        if (courses?.modules) {
            return courses.modules;
        } else {
            return [];
        }
    }

    async function createModule(courseId: string, module: Module) {
        const newModule = { ...module, _id: uuidv4() };
        await model.updateOne(
            {_id: courseId},
            {$push: {modules: newModule}}
        );
        return newModule;
    }

    async function deleteModule(courseId: string, moduleId: string) {
        const status = await model.updateOne(
            {_id: courseId},
            {$pull: {modules: { _id: moduleId}}}
        );
        return status;
    }

    async function updateModule(courseId: string, moduleId: string, moduleUpdates: Module) {
        const course = await model.findById(courseId);
        const module = course?.modules.id(moduleId);
        if (!module) {
            return null;
        }
        Object.assign(module, moduleUpdates);
        await course?.save();
        return module;
    }

    return {
        findModulesForCourse,
        createModule,
        deleteModule,
        updateModule,
    };
}

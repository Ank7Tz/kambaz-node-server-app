import { DB, Module } from "../Database";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db: DB) {
    function findModulesForCourse(courseId: string) {
        const { modules } = db;
        return modules.filter((module: Module) => module.course === courseId);
    }

    function createModule(module: Module) {
        const newModule = { ...module, _id: uuidv4() };
        db.modules = [...db.modules, newModule];
        return newModule;
    }

    function deleteModule(moduleId: string) {
        const { modules } = db;
        db.modules = modules.filter((module) => module._id !== moduleId);
    }

    function updateModule(moduleId: string, moduleUpdates: Module) {
        const { modules } = db;
        const module = modules.find((module) => module._id === moduleId);
        if (!module) {
            return null
        }
        Object.assign(module, moduleUpdates);
        return module;
    }

    return {
        findModulesForCourse,
        createModule,
        deleteModule,
        updateModule,
    };
}

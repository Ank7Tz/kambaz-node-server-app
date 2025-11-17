import { v4 as uuidv4 } from "uuid";
import { DB, User } from "../Database/index";
export default function UsersDao(db: DB) {
    const createUser = (user: User) => {
        const newUser = { ...user, _id: uuidv4() };
        db.users = [...db.users, newUser];
        return newUser;
    };
    const findAllUsers = () => db.users;
    const findUserById = (userId: string) => db.users.find((user) => user._id === userId);
    const findUserByUsername = (username: string) => db.users.find((user) => user.username === username);
    const findUserByCredentials = (username: string, password: string) =>
        db.users.find((user) => user.username === username && user.password === password);
    const findUsersByFirstName = (firstName: string) => 
        db.users.filter((user) => user.firstName.toLowerCase() === firstName.toLowerCase());
    const updateUser = (userId: string, user: User) => (db.users = db.users.map((u) => (u._id === userId ? user : u)));
    const deleteUser = (userId: string) => (db.users = db.users.filter((u) => u._id !== userId));
    return {
        createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, findUsersByFirstName, updateUser, deleteUser
    };
}

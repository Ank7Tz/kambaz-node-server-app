import { v4 as uuidv4 } from "uuid";
import { DB, User } from "../Database/index.js";
export default function UsersDao(db: DB) {
    let { users } = db;
    const createUser = (user: User) => {
        const newUser = { ...user, _id: uuidv4() };
        users = [...users, newUser];
        return newUser;
    };
    const findAllUsers = () => users;
    const findUserById = (userId: string) => users.find((user) => user._id === userId);
    const findUserByUsername = (username: string) => users.find((user) => user.username === username);
    const findUserByCredentials = (username: string, password: string) =>
        users.find((user) => user.username === username && user.password === password);
    const findUsersByFirstName = (firstName: string) => 
        users.filter((user) => user.firstName.toLowerCase() === firstName.toLowerCase());
    const updateUser = (userId: string, user: User) => (users = users.map((u) => (u._id === userId ? user : u)));
    const deleteUser = (userId: string) => (users = users.filter((u) => u._id !== userId));
    return {
        createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, findUsersByFirstName, updateUser, deleteUser
    };
}

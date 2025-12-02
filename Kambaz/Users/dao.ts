import { DB, User } from "../Database/index";
import model from "./model"
import { v4 as uuidv4 } from 'uuid';

export default function UsersDao(db: DB) {
    const createUser = async (user: User): Promise<User> => {
        const newUser = { ...user, _id: uuidv4() };
        const createdUser = await model.create(newUser);
        return createdUser.toObject<User>();
    };
    const findAllUsers = (): Promise<User[]> => model.find().lean<User[]>();
    const findUserById = (userId: string): Promise<User | null> => model.findById(userId).lean<User | null>();
    const findUserByUsername = (username: string): Promise<User | null> => model.findOne({ username: username }).lean<User | null>();
    const findUserByCredentials = (username: string, password: string): Promise<User | null> => {
        return model.findOne({ username: username, password: password }).lean<User | null>();
    }
    const findUsersByFirstName = (firstName: string): Promise<User[]> =>
        model.find({ firstName: { $regex: new RegExp(`^${firstName}$`, 'i') } }).lean<User[]>();
    const updateUser = (userId: string, user: User) => model.updateOne({ _id: userId }, { $set: user });
    const deleteUser = (userId: string) => model.deleteOne({ _id: userId });
    const findUsersByRole = (role: string): Promise<User[]> => model.find({ role: role }).lean<User[]>();
    const findUsersByPartialName = (partialName: string): Promise<User[]> => {
        const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
        return model.find({
            $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
        }).lean<User[]>();
    };

    return {
        createUser,
        findAllUsers,
        findUserById,
        findUserByUsername,
        findUserByCredentials,
        findUsersByFirstName,
        updateUser,
        deleteUser,
        findUsersByRole,
        findUsersByPartialName,
    };
}

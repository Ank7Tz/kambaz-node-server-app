import mongoose from "mongoose";
import schema from "./schema";

const model = mongoose.model("QuestionModel", schema);
export default model;
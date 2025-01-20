import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./Category";

export enum Priority {
  Low = "Baixa", // Baixa prioridade
  Medium = "Média", // Prioridade média
  High = "Alta", // Alta prioridade
}

interface ITask extends Document {
  title: string;
  category: ICategory["_id"]; // Referência para a categoria
  priority: Priority;
  duration: Number; //Duração em segundos
  notes: string;
  finished: boolean;
  userId: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  priority: {
    type: String,
    enum: Object.values(Priority),
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    required: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;

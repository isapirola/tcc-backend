import { Request, Response } from "express";
import Task from "../models/Task";
import Category from "../models/Category";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, priority, duration, notes, finished } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      res.status(400).json({ message: "Categoria não encontrada" });
      return;
    }

    const newTask = new Task({
      title,
      category,
      priority,
      duration,
      notes,
      finished,
      userId,
    });

    await newTask.save();

    res.status(201).json({ message: "Tarefa criada com sucesso", task: newTask });
  } catch (error) {
    console.error("Erro ao criar tarefa", error);
    res.status(500).send("Erro ao criar tarefa");
  }
};

export const getTasksByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const tasks = await Task.find({ userId });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Erro ao buscar tarefas", error);
    res.status(500).send("Erro ao buscar tarefas");
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const taskId = req.params.taskId; // ID da tarefa a ser editada
    const { title, category, priority, duration, notes, finished } = req.body; // Campos atualizados
    const userId = req.user?.id; // ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    // Verificar se a tarefa existe e pertence ao usuário autenticado
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      res.status(404).json({ message: "Tarefa não encontrada ou não pertence ao usuário." });
      return;
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(400).json({ message: "Categoria não encontrada." });
        return;
      }
    }

    // Atualizar os campos da tarefa
    task.title = title || task.title;
    task.category = category || task.category;
    task.priority = priority || task.priority;
    task.duration = duration || task.duration;
    task.notes = notes || task.notes;
    task.finished = finished !== undefined ? finished : task.finished;

    await task.save();

    res.status(200).json({ message: "Tarefa atualizada com sucesso.", task });
  } catch (error) {
    console.error("Erro ao atualizar tarefa", error);
    res.status(500).send("Erro ao atualizar tarefa.");
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const taskId = req.params.taskId; // ID da tarefa a ser deletada
    const userId = req.user?.id; // ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    // Verificar se a tarefa existe e pertence ao usuário autenticado
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      res.status(404).json({ message: "Tarefa não encontrada ou não pertence ao usuário." });
      return;
    }

    // Deletar a tarefa
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Tarefa deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar tarefa", error);
    res.status(500).send("Erro ao deletar tarefa.");
  }
};
